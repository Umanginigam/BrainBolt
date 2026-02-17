import { Router } from "express";
import { pool } from "../db";
import { redis } from "../cache/redis";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { updateDifficulty } from "../services/adaptive.service";
import { calculateScore } from "../services/score.service";

const router = Router();

router.get("/next", async (req, res) => {
  const userId = (req.query.userId as string) || uuidv4();

  try {
    // 1️⃣ Ensure user exists
    await pool.query(
      `INSERT INTO users (id) VALUES ($1)
       ON CONFLICT (id) DO NOTHING`,
      [userId]
    );

    // 2️⃣ Load user_state (check Redis first)
    let userState = await redis.get(`user_state:${userId}`);

    if (userState) {
      userState = JSON.parse(userState);
    } else {
      const result = await pool.query(
        `SELECT * FROM user_state WHERE user_id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        // Create initial state
        await pool.query(
          `INSERT INTO user_state (user_id) VALUES ($1)`,
          [userId]
        );

        userState = {
          current_difficulty: 1,
          streak: 0,
          max_streak: 0,
          total_score: 0,
          momentum: 0,
          confidence: 0,
          state_version: 1
        };
      } else {
        userState = result.rows[0];
      }

      // Save to Redis
      await redis.set(
        `user_state:${userId}`,
        JSON.stringify(userState),
        { EX: 3600 }
      );
    }

    // 3️⃣ Apply streak decay (15 minutes inactivity)
    const now = new Date();
    const lastAnswer = new Date(userState.last_answer_at || now);
    const diffMinutes =
      (now.getTime() - lastAnswer.getTime()) / (1000 * 60);

    if (diffMinutes > 15 && userState.streak > 0) {
      userState.streak = Math.floor(userState.streak / 2);

      await pool.query(
        `UPDATE user_state
         SET streak = $1
         WHERE user_id = $2`,
        [userState.streak, userId]
      );
    }

    // 4️⃣ Get question by difficulty
    const questionResult = await pool.query(
      `SELECT id, difficulty, prompt, choices
       FROM questions
       WHERE difficulty = $1
       ORDER BY RANDOM()
       LIMIT 1`,
      [userState.current_difficulty]
    );

    if (questionResult.rows.length === 0) {
      return res.status(404).json({
        message: "No questions available for this difficulty"
      });
    }

    const question = questionResult.rows[0];

    // 5️⃣ Return response
    res.json({
      userId,
      questionId: question.id,
      difficulty: question.difficulty,
      prompt: question.prompt,
      choices: question.choices,
      stateVersion: userState.state_version,
      currentScore: userState.total_score,
      currentStreak: userState.streak
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/answer", async (req, res) => {
  const {
    userId,
    questionId,
    answer,
    stateVersion,
    idempotencyKey
  } = req.body;

  const client = await pool.connect();

  try {
    // 1️⃣ Idempotency check
    const idempotentCheck = await pool.query(
      `SELECT response FROM idempotency_keys WHERE key = $1`,
      [idempotencyKey]
    );

    if (idempotentCheck.rows.length > 0) {
      return res.json(idempotentCheck.rows[0].response);
    }

    await client.query("BEGIN");

    // 2️⃣ Lock user_state
    const stateResult = await client.query(
      `SELECT * FROM user_state WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    if (stateResult.rows.length === 0) {
      throw new Error("User state not found");
    }
   const state = stateResult.rows[0];

   state.total_score = Number(state.total_score);
   state.streak = Number(state.streak);
   state.max_streak = Number(state.max_streak);
   state.current_difficulty = Number(state.current_difficulty);
   state.momentum = Number(state.momentum);
   state.confidence = Number(state.confidence);
   state.state_version = Number(state.state_version);


    // 3️⃣ Check stateVersion
    if (state.state_version !== stateVersion) {
      return res.status(409).json({
        message: "State version mismatch"
      });
    }

    // 4️⃣ Get correct answer hash
    const questionResult = await client.query(
      `SELECT correct_answer_hash FROM questions WHERE id = $1`,
      [questionId]
    );

    const correctHash = questionResult.rows[0].correct_answer_hash;

    const answerHash = crypto
      .createHash("sha256")
      .update(answer)
      .digest("hex");

    const correct = answerHash === correctHash;

    // 5️⃣ Update difficulty & streak
    updateDifficulty(state, correct);

    // 6️⃣ Calculate score
    let scoreDelta = 0;
    if (correct) {
      scoreDelta = calculateScore(
        state.current_difficulty,
        state.streak
      );
      state.total_score += scoreDelta;
    }

    // Update max streak
    state.max_streak = Math.max(state.max_streak, state.streak);

    // Increase version
    state.state_version += 1;

    // 7️⃣ Update user_state
    await client.query(
      `
      UPDATE user_state
      SET current_difficulty = $1,
          streak = $2,
          max_streak = $3,
          total_score = $4,
          momentum = $5,
          confidence = $6,
          state_version = $7,
          last_answer_at = NOW()
      WHERE user_id = $8
      `,
      [
        state.current_difficulty,
        state.streak,
        state.max_streak,
        state.total_score,
        state.momentum,
        state.confidence,
        state.state_version,
        userId
      ]
    );

    // 8️⃣ Insert answer_log
    await client.query(
      `
      INSERT INTO answer_log
      (id, user_id, question_id, difficulty, answer, correct, score_delta, streak_at_answer)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        crypto.randomUUID(),
        userId,
        questionId,
        state.current_difficulty,
        answer,
        correct,
        scoreDelta,
        state.streak
      ]
    );

    await client.query("COMMIT");

    // 9️⃣ Update Redis cache
    await redis.set(
      `user_state:${userId}`,
      JSON.stringify(state),
      { EX: 3600 }
    );

    // 🔟 Update Leaderboards
    await redis.zAdd("leaderboard:score", {
      score: state.total_score,
      value: userId
    });

    await redis.zAdd("leaderboard:streak", {
      score: state.max_streak,
      value: userId
    });

    const rankScore = await redis.zRevRank("leaderboard:score", userId);
    const rankStreak = await redis.zRevRank("leaderboard:streak", userId);

    const response = {
      correct,
      newDifficulty: state.current_difficulty,
      newStreak: state.streak,
      scoreDelta,
      totalScore: state.total_score,
      stateVersion: state.state_version,
      leaderboardRankScore: rankScore !== null ? rankScore + 1 : null,
      leaderboardRankStreak: rankStreak !== null ? rankStreak + 1 : null
    };

    // Save idempotency result
    await pool.query(
      `INSERT INTO idempotency_keys (key, response)
       VALUES ($1,$2)`,
      [idempotencyKey, response]
    );

    res.json(response);

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  } finally {
    client.release();
  }
});


export default router;
