import { pool } from "./index";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

function hashAnswer(answer: string) {
  return crypto.createHash("sha256").update(answer).digest("hex");
}

const questions = [
  // Difficulty 1
  {
    difficulty: 1,
    prompt: "What is 2 + 2?",
    choices: [
      { id: "A", text: "3" },
      { id: "B", text: "4" },
      { id: "C", text: "5" },
      { id: "D", text: "6" }
    ],
    correct: "B"
  },

  {
    difficulty: 1,
    prompt: "What color is the sky?",
    choices: [
      { id: "A", text: "Blue" },
      { id: "B", text: "Green" },
      { id: "C", text: "Red" },
      { id: "D", text: "Yellow" }
    ],
    correct: "A"
  },

  // Difficulty 2
  {
    difficulty: 2,
    prompt: "What is 5 × 3?",
    choices: [
      { id: "A", text: "15" },
      { id: "B", text: "10" },
      { id: "C", text: "20" },
      { id: "D", text: "25" }
    ],
    correct: "A"
  },

  // Difficulty 3
  {
    difficulty: 3,
    prompt: "Which planet is known as the Red Planet?",
    choices: [
      { id: "A", text: "Earth" },
      { id: "B", text: "Mars" },
      { id: "C", text: "Jupiter" },
      { id: "D", text: "Venus" }
    ],
    correct: "B"
  },

  // Difficulty 5
  {
    difficulty: 5,
    prompt: "What is the time complexity of binary search?",
    choices: [
      { id: "A", text: "O(n)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n^2)" },
      { id: "D", text: "O(1)" }
    ],
    correct: "B"
  },

  // Difficulty 7
  {
    difficulty: 7,
    prompt: "What does ACID stand for in databases?",
    choices: [
      { id: "A", text: "Atomicity, Consistency, Isolation, Durability" },
      { id: "B", text: "Accuracy, Consistency, Integrity, Durability" },
      { id: "C", text: "Atomicity, Correctness, Isolation, Data" },
      { id: "D", text: "None of the above" }
    ],
    correct: "A"
  },

  // Difficulty 10
  {
    difficulty: 10,
    prompt: "Which sorting algorithm has average O(n log n) but worst-case O(n²)?",
    choices: [
      { id: "A", text: "Merge Sort" },
      { id: "B", text: "Heap Sort" },
      { id: "C", text: "Quick Sort" },
      { id: "D", text: "Bubble Sort" }
    ],
    correct: "C"
  }
];

export async function seedQuestions() {
  try {
    for (const q of questions) {
      await pool.query(
        `
        INSERT INTO questions (id, difficulty, prompt, choices, correct_answer_hash)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
        `,
        [
          uuidv4(),
          q.difficulty,
          q.prompt,
          JSON.stringify(q.choices),
          hashAnswer(q.correct)
        ]
      );
    }

    console.log("✅ Questions seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding questions", error);
  }
}
