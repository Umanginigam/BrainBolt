"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001";

// ─── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');

  .lb-root {
    font-family: 'DM Mono', monospace;
    color: #e8e6f0;
    margin-top: 24px;
  }

  /* ── Header ── */
  .lb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .lb-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.4px;
    background: linear-gradient(90deg, #fff 40%, rgba(255,255,255,.45));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lb-live {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 4px 10px;
    border-radius: 50px;
    background: rgba(60,255,160,0.08);
    border: 1px solid rgba(60,255,160,0.2);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #3cffa0;
  }

  .lb-live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3cffa0;
    animation: livePulse 1.4s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(60,255,160,0.4); }
    50%       { opacity: 0.7; transform: scale(1.2); box-shadow: 0 0 0 5px rgba(60,255,160,0); }
  }

  /* ── Table ── */
  .lb-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 6px;
  }

  .lb-thead th {
    padding: 0 16px 8px;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    font-weight: 500;
    text-align: left;
  }
  .lb-thead th:last-child { text-align: right; }

  /* ── Rows ── */
  .lb-row {
    background: rgba(255,255,255,0.04);
    border-radius: 12px;
    transition: background 0.2s, transform 0.2s;
    animation: rowIn 0.4s cubic-bezier(.22,1,.36,1) both;
    cursor: default;
  }

  .lb-row:hover {
    background: rgba(108,63,255,0.1);
    transform: translateX(3px);
  }

  /* staggered entrance */
  .lb-row:nth-child(1)  { animation-delay: 0.04s; }
  .lb-row:nth-child(2)  { animation-delay: 0.08s; }
  .lb-row:nth-child(3)  { animation-delay: 0.12s; }
  .lb-row:nth-child(4)  { animation-delay: 0.16s; }
  .lb-row:nth-child(5)  { animation-delay: 0.20s; }
  .lb-row:nth-child(6)  { animation-delay: 0.24s; }
  .lb-row:nth-child(7)  { animation-delay: 0.28s; }
  .lb-row:nth-child(8)  { animation-delay: 0.32s; }
  .lb-row:nth-child(9)  { animation-delay: 0.36s; }
  .lb-row:nth-child(10) { animation-delay: 0.40s; }

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: none; }
  }

  /* "you" highlight */
  .lb-row.is-you {
    background: rgba(108,63,255,0.14);
    border: 1px solid rgba(108,63,255,0.3);
    box-shadow: 0 0 20px rgba(108,63,255,0.1);
  }
  .lb-row.is-you:hover {
    background: rgba(108,63,255,0.2);
  }

  .lb-row td {
    padding: 13px 16px;
  }
  .lb-row td:first-child { border-radius: 12px 0 0 12px; }
  .lb-row td:last-child  { border-radius: 0 12px 12px 0; text-align: right; }

  /* ── Rank cell ── */
  .rank-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rank-badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* Podium colours */
  .rank-1 { background: linear-gradient(135deg, #ffe45e, #ff9d00); color: #1a1000; box-shadow: 0 2px 12px rgba(255,200,0,0.4); }
  .rank-2 { background: linear-gradient(135deg, #d0d8e8, #8fa0b8); color: #0f141a; box-shadow: 0 2px 12px rgba(160,180,210,0.3); }
  .rank-3 { background: linear-gradient(135deg, #ff9a5e, #c4622a); color: #1a0800; box-shadow: 0 2px 12px rgba(255,130,60,0.35); }
  .rank-default { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.45); }

  /* ── User cell ── */
  .user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
    font-family: 'Syne', sans-serif;
  }

  .user-id {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
  }

  .you-tag {
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(108,63,255,0.25);
    color: #c4aeff;
    padding: 2px 7px;
    border-radius: 4px;
    border: 1px solid rgba(108,63,255,0.4);
  }

  /* ── Score cell ── */
  .score-value {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: #7cffd4;
    letter-spacing: -0.3px;
  }

  .lb-row.rank-1-row .score-value { color: #ffe45e; }
  .lb-row.rank-2-row .score-value { color: #d0d8e8; }
  .lb-row.rank-3-row .score-value { color: #ff9a5e; }

  /* ── Your rank footer ── */
  .lb-your-rank {
    margin-top: 16px;
    padding: 14px 18px;
    border-radius: 12px;
    background: rgba(108,63,255,0.1);
    border: 1px solid rgba(108,63,255,0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: rowIn 0.4s 0.44s cubic-bezier(.22,1,.36,1) both;
  }

  .lb-your-rank-label {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
  }

  .lb-your-rank-value {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #c4aeff;
  }

  .lb-your-rank-suffix {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    margin-left: 4px;
  }

  /* ── Divider ── */
  .lb-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    margin: 4px 0 10px;
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  ["#6c3fff","#c4aeff"], ["#ff3c8e","#ffaed4"], ["#3cffa0","#0f3326"],
  ["#ffb03c","#3d2600"], ["#3cd4ff","#002d3d"], ["#ff6b3c","#3d1800"],
];

function avatarStyle(uid: string) {
  const idx = uid.charCodeAt(0) % AVATAR_COLORS.length;
  const [bg, fg] = AVATAR_COLORS[idx];
  return { background: bg, color: fg };
}

function rankClass(rank: number) {
  if (rank === 1) return "rank-1";
  if (rank === 2) return "rank-2";
  if (rank === 3) return "rank-3";
  return "rank-default";
}

function rowExtraClass(rank: number) {
  if (rank === 1) return " rank-1-row";
  if (rank === 2) return " rank-2-row";
  if (rank === 3) return " rank-3-row";
  return "";
}

function ordinal(n: number) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function LeaderboardClient({ initialData }: any) {
  const [data, setData] = useState(initialData);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("brainbolt_user")
      : null;

  const fetchLeaderboard = async () => {
    if (!userId) return;
    const res = await axios.get(
      `${API_BASE}/v1/leaderboard/score?limit=10&userId=${userId}`
    );
    setData(res.data);
  };

  // Poll every 3 seconds
  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <div className="lb-root">

        {/* Header */}
        <div className="lb-header">
          <span className="lb-title">Leaderboard</span>
          <span className="lb-live">
            <span className="lb-live-dot" />
            Live
          </span>
        </div>

        <div className="lb-divider" />

        {/* Table */}
        <table className="lb-table">
          <thead className="lb-thead">
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboard.map((entry: any) => {
              const isYou = entry.userId === userId;
              return (
                <tr
                  key={entry.userId}
                  className={`lb-row${isYou ? " is-you" : ""}${rowExtraClass(entry.rank)}`}
                >
                  {/* Rank */}
                  <td>
                    <div className="rank-cell">
                      <div className={`rank-badge ${rankClass(entry.rank)}`}>
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                      </div>
                    </div>
                  </td>

                  {/* User */}
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={avatarStyle(entry.userId)}>
                        {entry.userId.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="user-id">{entry.userId.slice(0, 8)}…</span>
                      {isYou && <span className="you-tag">you</span>}
                    </div>
                  </td>

                  {/* Score */}
                  <td>
                    <span className="score-value">{entry.totalScore}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Your rank footer */}
        {data.currentUserRank && (
          <div className="lb-your-rank">
            <span className="lb-your-rank-label">Your global rank</span>
            <span>
              <span className="lb-your-rank-value">#{data.currentUserRank}</span>
              <span className="lb-your-rank-suffix">{ordinal(data.currentUserRank)} place</span>
            </span>
          </div>
        )}

      </div>
    </>
  );
}