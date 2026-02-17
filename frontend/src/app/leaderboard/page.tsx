import LeaderboardClient from "./LeaderboardClient";

const API_BASE = "http://localhost:3001";

async function getLeaderboard() {
  const res = await fetch(
    `${API_BASE}/v1/leaderboard/score?limit=10`,
    { cache: "no-store" } // ensures fresh SSR
  );

  return res.json();
}

export default async function LeaderboardPage() {
  const data = await getLeaderboard();

  return (
    <div style={{ padding: 40 }}>
      <h1>🏆 Leaderboard</h1>
      <LeaderboardClient initialData={data} />
    </div>
  );
}
