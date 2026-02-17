import { createClient } from "redis";

const url = process.env.REDIS_URL;
export const redis = createClient({ url });

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  // log once per minute to avoid spam
  if (!((redis as any)._lastErrorAt) || Date.now() - (redis as any)._lastErrorAt > 60_000) {
    (redis as any)._lastErrorAt = Date.now();
    console.error("❌ Redis error", err);
  }
});

async function connectWithRetry(retries = 5, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await redis.connect();
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
      delayMs *= 2; // exponential backoff
    }
  }
}

if (url) {
  connectWithRetry().catch((err) => {
    console.error("❌ Failed to connect to Redis after retries:", err.message || err);
  });
} else {
  console.warn("⚠️ REDIS_URL not set. Skipping Redis connection.");
}
// ...existing code...