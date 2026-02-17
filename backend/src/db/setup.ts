import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./index.js";

// ...existing code...
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupDatabase() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = readFileSync(schemaPath, "utf8");
  await pool.query(sql);


  try {
    await pool.query(sql);
    console.log("✅ Database tables created");
  } catch (error) {
    console.error("❌ Error creating tables", error);
  }
}
