import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db/index.js";
import "./cache/redis";
import { setupDatabase } from "./db/setup";
import { seedQuestions } from "./db/seed";
import quizRoutes from "./routes/quiz.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";





dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "BrainBolt Backend Running 🚀" });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await setupDatabase();
  await seedQuestions();


  try {
    await pool.query("SELECT 1");
    console.log("✅ Database test query successful");
  } catch (error) {
    console.error("❌ Database connection failed", error);
  }
});
app.use("/v1/quiz", quizRoutes);

app.use("/v1/leaderboard", leaderboardRoutes);