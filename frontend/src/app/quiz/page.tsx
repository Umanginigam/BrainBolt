"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE = "http://localhost:3001";

// ─── Inline styles & keyframes via a global <style> tag ─────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #09090f;
    color: #e8e6f0;
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
  }

  .quiz-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  /* animated mesh background */
  .quiz-root::before {
    content: '';
    position: fixed;
    inset: -50%;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(100,60,255,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 80% 70%, rgba(255,60,140,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 60% 20%, rgba(60,220,255,0.10) 0%, transparent 55%);
    animation: bgDrift 16s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes bgDrift {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(2%, 3%) scale(1.04); }
    100% { transform: translate(-2%, -2%) scale(0.97); }
  }

  /* grid overlay */
  .quiz-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .quiz-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 680px;
    background: rgba(14, 12, 28, 0.82);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    backdrop-filter: blur(24px);
    box-shadow:
      0 0 0 1px rgba(100,60,255,0.12),
      0 32px 80px rgba(0,0,0,0.6),
      inset 0 1px 0 rgba(255,255,255,0.06);
    padding: 40px;
    animation: cardIn 0.5s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Header ── */
  .quiz-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .quiz-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .quiz-logo {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6c3fff 0%, #ff3c8e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 16px rgba(108,63,255,0.4);
  }

  .quiz-title {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #fff 40%, rgba(255,255,255,.5));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Stats pills ── */
  .quiz-stats {
    display: flex;
    gap: 10px;
  }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 50px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 13px;
    font-weight: 500;
  }

  .stat-icon { font-size: 15px; }
  .stat-label { color: rgba(255,255,255,0.4); font-size: 11px; margin-right: 2px; }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }

  .stat-pill.score .stat-value { color: #7cffd4; }
  .stat-pill.streak .stat-value { color: #ffb03c; }

  /* streak fire animation */
  .streak-fire { display: inline-block; }
  .stat-pill.streak.active .streak-fire {
    animation: firePulse 0.6s ease-in-out infinite alternate;
  }
  @keyframes firePulse {
    from { transform: scale(1) rotate(-5deg); }
    to   { transform: scale(1.25) rotate(5deg); }
  }

  /* ── Divider ── */
  .quiz-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    margin-bottom: 28px;
  }

  /* ── Difficulty badge ── */
  .difficulty-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .difficulty-badge.easy   { background: rgba(60,255,160,0.1); color: #3cffa0; border: 1px solid rgba(60,255,160,0.2); }
  .difficulty-badge.medium { background: rgba(255,176,60,0.1);  color: #ffb03c; border: 1px solid rgba(255,176,60,0.2); }
  .difficulty-badge.hard   { background: rgba(255,60,140,0.1);  color: #ff3c8e; border: 1px solid rgba(255,60,140,0.2); }

  /* ── Question ── */
  .question-text {
    font-family: 'Syne', sans-serif;
    font-size: clamp(18px, 3vw, 24px);
    font-weight: 700;
    line-height: 1.4;
    color: #f0eeff;
    margin-bottom: 28px;
    letter-spacing: -0.3px;
  }

  /* ── Choices ── */
  .choices-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .choice-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    cursor: pointer;
    text-align: left;
    color: #e2dff5;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    transition: background 0.18s, border-color 0.18s, transform 0.15s, box-shadow 0.18s;
    position: relative;
    overflow: hidden;
  }

  .choice-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(108,63,255,0) 0%, rgba(108,63,255,0.06) 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .choice-btn:hover {
    background: rgba(108,63,255,0.12);
    border-color: rgba(108,63,255,0.4);
    transform: translateX(4px);
    box-shadow: 0 4px 24px rgba(108,63,255,0.15);
  }
  .choice-btn:hover::before { opacity: 1; }

  .choice-btn:active {
    transform: translateX(4px) scale(0.98);
  }

  .choice-key {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    transition: background 0.18s, color 0.18s;
  }

  .choice-btn:hover .choice-key {
    background: rgba(108,63,255,0.3);
    color: #c4aeff;
    border-color: rgba(108,63,255,0.5);
  }

  .choice-text { flex: 1; line-height: 1.5; }

  /* ── Feedback banner ── */
  .feedback-banner {
    margin-top: 20px;
    padding: 14px 18px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    animation: feedbackIn 0.3s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes feedbackIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }

  .feedback-banner.correct {
    background: rgba(60,255,160,0.1);
    border: 1px solid rgba(60,255,160,0.25);
    color: #3cffa0;
  }
  .feedback-banner.wrong {
    background: rgba(255,60,140,0.1);
    border: 1px solid rgba(255,60,140,0.25);
    color: #ff3c8e;
  }

  /* ── Loading state ── */
  .loading-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #09090f;
    flex-direction: column;
    gap: 16px;
  }

  .loading-logo {
    font-size: 40px;
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.92); }
  }

  .loading-text {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  /* ── Q counter ── */
  .q-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .q-number {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────────
function getDifficultyClass(d: any): string {
  if (d === null || d === undefined) return "medium";
  const l = String(d).toLowerCase();
  if (l.includes("easy"))   return "easy";
  if (l.includes("hard"))   return "hard";
  return "medium";
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function QuizPage() {
  const [userId, setUserId]           = useState<string>("");
  const [question, setQuestion]       = useState<any>(null);
  const [stateVersion, setStateVersion] = useState<number>(1);
  const [score, setScore]             = useState<number>(0);
  const [streak, setStreak]           = useState<number>(0);
  const [loading, setLoading]         = useState<boolean>(true);
  const [feedback, setFeedback]       = useState<string>("");

  // Initialize userId once
  useEffect(() => {
    let id = localStorage.getItem("brainbolt_user");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("brainbolt_user", id);
    }
    setUserId(id);
  }, []);

  // Fetch next question
  const fetchNextQuestion = async (id: string) => {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/v1/quiz/next?userId=${id}`);
    setQuestion(res.data);
    setStateVersion(res.data.stateVersion);
    setScore(Number(res.data.currentScore));
    setStreak(Number(res.data.currentStreak));
    setLoading(false);
  };

  // When userId ready, load first question
  useEffect(() => {
    if (userId) fetchNextQuestion(userId);
  }, [userId]);

  // Submit answer
  const submitAnswer = async (choiceId: string) => {
    if (!question) return;
    const res = await axios.post(`${API_BASE}/v1/quiz/answer`, {
      userId,
      questionId: question.questionId,
      answer: choiceId,
      stateVersion,
      idempotencyKey: uuidv4(),
    });
    const data = res.data;
    setFeedback(data.correct ? "correct" : "wrong");
    setScore(Number(data.totalScore));
    setStreak(Number(data.newStreak));
    setStateVersion(data.stateVersion);
    setTimeout(() => {
      setFeedback("");
      fetchNextQuestion(userId);
    }, 1000);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="loading-wrap">
        <div className="loading-logo">🧠</div>
        <div className="loading-text">Loading question…</div>
      </div>
    </>
  );

  if (!question) return (
    <>
      <style>{STYLES}</style>
      <div className="loading-wrap">
        <div className="loading-logo">⚠️</div>
        <div className="loading-text">No question found</div>
      </div>
    </>
  );

  const diffClass = getDifficultyClass(question.difficulty);

  return (
    <>
      <style>{STYLES}</style>
      <div className="quiz-root">
        <div className="quiz-card">

          {/* ── Header ── */}
          <div className="quiz-header">
            <div className="quiz-brand">
              <div className="quiz-logo">🧠</div>
              <span className="quiz-title">BrainBolt</span>
            </div>
            <div className="quiz-stats">
              <div className="stat-pill score">
                <span className="stat-icon">⚡</span>
                <span className="stat-label">Score</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className={`stat-pill streak${streak > 0 ? " active" : ""}`}>
                <span className="stat-icon streak-fire">🔥</span>
                <span className="stat-label">Streak</span>
                <span className="stat-value">{streak}</span>
              </div>
            </div>
          </div>

          <div className="quiz-divider" />

          {/* ── Difficulty + question meta ── */}
          <div className="q-meta">
            <span className={`difficulty-badge ${diffClass}`}>
              {diffClass === "easy"   && "◆ Easy"}
              {diffClass === "medium" && "◆ Medium"}
              {diffClass === "hard"   && "◆ Hard"}
              {!["easy","medium","hard"].includes(diffClass) && `◆ ${question.difficulty}`}
            </span>
            <span className="q-number">{question.questionId?.slice(-6) ?? ""}</span>
          </div>

          {/* ── Question ── */}
          <p className="question-text">{question.prompt}</p>

          {/* ── Choices ── */}
          <div className="choices-grid">
            {question.choices.map((choice: any) => (
              <button
                key={choice.id}
                className="choice-btn"
                onClick={() => submitAnswer(choice.id)}
                disabled={!!feedback}
              >
                <span className="choice-key">{choice.id}</span>
                <span className="choice-text">{choice.text}</span>
              </button>
            ))}
          </div>

          {/* ── Feedback ── */}
          {feedback && (
            <div className={`feedback-banner ${feedback}`}>
              {feedback === "correct" ? "✦ Correct!" : "✕ Not quite — next one!"}
            </div>
          )}

        </div>
      </div>
    </>
  );
}