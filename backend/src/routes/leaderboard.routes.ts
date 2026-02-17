import { Router } from "express";
import { redis } from "../cache/redis";

const router = Router();

/**
 * GET /v1/leaderboard/score?limit=10&userId=xxx
 */
router.get("/score", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const userId = req.query.userId as string;

  try {
    // 1️⃣ Get Top N users
    const topUsers = await redis.zRangeWithScores(
      "leaderboard:score",
      0,
      limit - 1,
      { REV: true }
    );

    // Format response
    const formatted = topUsers.map((entry, index) => ({
      rank: index + 1,
      userId: entry.value,
      totalScore: entry.score
    }));

    // 2️⃣ Get current user rank
    let currentUserRank = null;

    if (userId) {
      const rank = await redis.zRevRank("leaderboard:score", userId);
      if (rank !== null) {
        currentUserRank = rank + 1;
      }
    }

    res.json({
      leaderboard: formatted,
      currentUserRank
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});
/**
 * GET /v1/leaderboard/streak?limit=10&userId=xxx
 */
router.get("/streak", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const userId = req.query.userId as string;

  try {
    const topUsers = await redis.zRangeWithScores(
      "leaderboard:streak",
      0,
      limit - 1,
      { REV: true }
    );

    const formatted = topUsers.map((entry, index) => ({
      rank: index + 1,
      userId: entry.value,
      maxStreak: entry.score
    }));

    let currentUserRank = null;

    if (userId) {
      const rank = await redis.zRevRank("leaderboard:streak", userId);
      if (rank !== null) {
        currentUserRank = rank + 1;
      }
    }

    res.json({
      leaderboard: formatted,
      currentUserRank
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal error" });
  }
});
export default router;
