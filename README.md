<div align="center">

# 🧠 BrainBolt

### Adaptive Infinite Quiz Platform

*Dynamically adjusts difficulty · Tracks streaks · Runs live leaderboards*

---

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-TypeScript-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Persistent-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

</div>

---

## 📖 Overview

BrainBolt is an adaptive infinite quiz platform that dynamically adjusts question difficulty based on user performance. The system serves **one question at a time**, updates difficulty in real-time, tracks streaks and scores, and maintains live leaderboards.

> Serves exactly one question per request · Updates difficulty in real time · Tracks streaks & scores · Live leaderboards · Idempotent submissions

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│       Frontend  (Next.js + TS)      │
│   SSR Leaderboard · CSR Quiz Page   │
└──────────────────┬──────────────────┘
                   │  HTTP
┌──────────────────▼──────────────────┐
│      Backend  (Node.js + Express)   │
│    Adaptive Engine · REST API       │
└──────────┬───────────────┬──────────┘
           │               │
┌──────────▼───────┐ ┌─────▼──────────┐
│   PostgreSQL     │ │     Redis       │
│  Persistent data │ │ Cache · Boards  │
└──────────────────┘ └────────────────┘
```

---

## 🧠 Adaptive Algorithm

**Difficulty range:** `1 – 10`

### ✅ On Correct Answer
| Signal | Change |
|--------|--------|
| `streak` | `+1` |
| `momentum` | `+1` |
| `confidence` | `+= difficulty × 2` |

**Difficulty increases** only when **all three** conditions are met:
- `streak ≥ 2`
- `momentum ≥ 2`
- `confidence ≥ 10`

### ❌ On Wrong Answer
| Signal | Change |
|--------|--------|
| `streak` | `= 0` |
| `momentum` | `−1` |
| `confidence` | `-= difficulty` |

**Difficulty decreases** if:
- `momentum ≤ −2`  **OR**
- `confidence ≤ −10`

> **Ping-pong prevention** — triple-signal guard stops rapid difficulty oscillation.

---

## 🔥 Scoring Model

```
base       = difficulty × 10
multiplier = min(1 + streak × 0.1,  2.0)
scoreDelta = base × multiplier
```

| Factor | Effect |
|--------|--------|
| Difficulty | Harder questions = bigger base score |
| Streak multiplier | Up to **2× bonus** at 10-answer streak |
| Wrong answer | Streak resets → multiplier drops to 1× |

---

## 🏆 Leaderboards

Two Redis sorted sets updated **immediately** after every answer:

| Sorted Set | Ranks By |
|------------|----------|
| `leaderboard:score` | Total score (all-time) |
| `leaderboard:streak` | Max streak achieved |

**Endpoints:**
```
GET /v1/leaderboard/score
GET /v1/leaderboard/streak
```

---

## 🗄️ Database Schema

<details>
<summary><strong>users</strong></summary>

Stores registered users.

</details>

<details>
<summary><strong>questions</strong></summary>

Static seeded questions grouped by difficulty band (1–10).

</details>

<details>
<summary><strong>user_state</strong></summary>

| Column | Description |
|--------|-------------|
| `currentDifficulty` | Active difficulty level |
| `streak` | Current answer streak |
| `maxStreak` | All-time best streak |
| `totalScore` | Cumulative score |
| `momentum` | Trend signal |
| `confidence` | Stability signal |
| `stateVersion` | Optimistic lock |
| `lastAnswerAt` | Inactivity tracking |

</details>

<details>
<summary><strong>answer_log</strong></summary>

Stores all answers for metrics and audit trail.

</details>

<details>
<summary><strong>idempotency_keys</strong></summary>

Prevents duplicate submissions from retries or double-clicks.

</details>

---

## ⚡ Caching Strategy

| Key | Purpose | TTL |
|-----|---------|-----|
| `user_state:{userId}` | Cached user state | 1 hour |
| `leaderboard:score` | Score sorted set | No TTL |
| `leaderboard:streak` | Streak sorted set | No TTL |

---

## 🔐 Consistency Guarantees

- `SELECT ... FOR UPDATE` row locking
- Full DB transactions on every answer
- `stateVersion` conflict detection (optimistic locking)
- Idempotency key deduplication
- Stateless app servers (horizontally scalable)

---

## 🌐 API Reference

### `GET /v1/quiz/next`
Returns the next adaptive question for a user.

```
GET /v1/quiz/next?userId=<userId>
```

**Response:** question prompt, choices, current score, streak, stateVersion

---

### `POST /v1/quiz/answer`
Processes an answer with full consistency guarantees.

```json
{
  "userId":         "USER_ID",
  "questionId":     "QUESTION_ID",
  "answer":         "A",
  "stateVersion":   1,
  "idempotencyKey": "unique-uuid"
}
```

**Response:** correct/wrong, scoreDelta, newStreak, totalScore, stateVersion

---

### `GET /v1/leaderboard/score`
Returns top users ranked by total score.

### `GET /v1/leaderboard/streak`
Returns top users ranked by max streak.

---

## 🎨 Frontend

| Feature | Implementation |
|---------|---------------|
| Framework | Next.js App Router + TypeScript |
| Leaderboard page | **SSR** — fast initial load |
| Quiz page | **CSR** — live interaction |
| Live updates | Polling every 3 seconds |

---

## 🐳 Running the Project

### Prerequisites
- [Docker](https://docker.com)
- [Docker Compose](https://docs.docker.com/compose/)

### Start everything

```bash
docker-compose up --build
```

### Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| Quiz | http://localhost:3000/quiz |
| Leaderboard | http://localhost:3000/leaderboard |

---

## 🧪 Testing via cURL

**Get next question:**
```bash
curl http://localhost:3001/v1/quiz/next
```

**Submit an answer:**
```bash
curl -X POST http://localhost:3001/v1/quiz/answer \
  -H "Content-Type: application/json" \
  -d '{
    "userId":         "USER_ID",
    "questionId":     "QUESTION_ID",
    "answer":         "A",
    "stateVersion":   1,
    "idempotencyKey": "unique-key"
  }'
```

---

## 🛡️ Edge Cases Handled

- Ping-pong difficulty instability
- Duplicate / double-click submissions
- Concurrent tab conflicts
- Difficulty bounds clamped to `[1, 10]`
- Streak reset on wrong answer
- Streak decay after inactivity
- State version mismatch (conflict rejection)
- Leaderboard ties

---

## 📈 Performance

- Redis `O(log n)` sorted set operations for leaderboards
- Indexed PostgreSQL queries
- SSR for fast leaderboard initial load
- Minimal re-renders on quiz page

---

## ✅ Assignment Compliance

| Requirement | Status |
|-------------|--------|
| Adaptive difficulty algorithm | ✅ |
| Ping-pong prevention | ✅ |
| Streak multiplier scoring | ✅ |
| Real-time leaderboards | ✅ |
| Idempotent answer submission | ✅ |
| Strong consistency (SELECT FOR UPDATE) | ✅ |
| SSR page | ✅ |
| CSR + live polling | ✅ |
| Redis caching | ✅ |
| Dockerized full stack | ✅ |

---

## 🎥 Demo

Demo video included in project root: **`demo.mp4`**

Covers: adaptive difficulty in action · score & streak updates · leaderboard live refresh · backend walkthrough

---

<div align="center">

Made with ⚡ — BrainBolt Assignment Submission · 2026

</div>
