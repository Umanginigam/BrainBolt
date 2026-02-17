<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>BrainBolt — README</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  /* ── Reset & Base ─────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #09090f;
    --surface:    rgba(14,12,28,0.85);
    --border:     rgba(255,255,255,0.07);
    --purple:     #6c3fff;
    --purple-glow:rgba(108,63,255,0.18);
    --pink:       #ff3c8e;
    --teal:       #3cffa0;
    --amber:      #ffb03c;
    --sky:        #3cd4ff;
    --text:       #e8e6f0;
    --muted:      rgba(255,255,255,0.35);
    --font-display: 'Syne', sans-serif;
    --font-mono:    'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.75;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Animated background ─────────────────────────────────────────────── */
  body::before {
    content: '';
    position: fixed;
    inset: -50%;
    background:
      radial-gradient(ellipse 55% 45% at 15% 25%, rgba(108,63,255,.16) 0%, transparent 60%),
      radial-gradient(ellipse 45% 55% at 85% 75%, rgba(255,60,142,.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 65% 15%, rgba(60,212,255,.09) 0%, transparent 55%);
    animation: bgDrift 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
    background-size: 52px 52px;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes bgDrift {
    0%   { transform: translate(0,0) scale(1); }
    50%  { transform: translate(3%,2%) scale(1.04); }
    100% { transform: translate(-2%,-3%) scale(.97); }
  }

  /* ── Layout ──────────────────────────────────────────────────────────── */
  .page {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    padding: 64px 32px 96px;
  }

  /* ── Hero ────────────────────────────────────────────────────────────── */
  .hero {
    text-align: center;
    margin-bottom: 72px;
    animation: fadeUp .7s cubic-bezier(.22,1,.36,1) both;
  }

  .hero-logo {
    font-size: 64px;
    display: block;
    margin-bottom: 20px;
    animation: logoBounce 2.8s ease-in-out infinite;
  }
  @keyframes logoBounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(38px, 6vw, 60px);
    font-weight: 800;
    letter-spacing: -1.5px;
    line-height: 1.05;
    background: linear-gradient(135deg, #fff 30%, rgba(200,180,255,.6) 70%, var(--pink) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }

  .hero-sub {
    font-size: 16px;
    color: var(--muted);
    max-width: 500px;
    margin: 0 auto 28px;
    line-height: 1.6;
  }

  .hero-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 13px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .04em;
    border: 1px solid var(--border);
    background: rgba(255,255,255,.04);
  }
  .badge.purple { color: #c4aeff; background: rgba(108,63,255,.12); border-color: rgba(108,63,255,.25); }
  .badge.teal   { color: var(--teal); background: rgba(60,255,160,.08); border-color: rgba(60,255,160,.2); }
  .badge.pink   { color: var(--pink); background: rgba(255,60,142,.08); border-color: rgba(255,60,142,.2); }
  .badge.amber  { color: var(--amber); background: rgba(255,176,60,.08); border-color: rgba(255,176,60,.2); }
  .badge.sky    { color: var(--sky); background: rgba(60,212,255,.08); border-color: rgba(60,212,255,.2); }

  /* ── Section ─────────────────────────────────────────────────────────── */
  .section {
    margin-bottom: 56px;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: none; }
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .section-label::before {
    content: '';
    display: block;
    width: 3px;
    height: 22px;
    border-radius: 2px;
    background: linear-gradient(180deg, var(--purple) 0%, var(--pink) 100%);
    flex-shrink: 0;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -.4px;
    color: #fff;
  }

  /* ── Card ────────────────────────────────────────────────────────────── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 28px 32px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(108,63,255,.07), 0 24px 60px rgba(0,0,0,.5);
  }

  p { color: rgba(255,255,255,.72); line-height: 1.8; }

  /* ── Architecture diagram ────────────────────────────────────────────── */
  .arch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 8px 0;
  }

  .arch-node {
    padding: 12px 32px;
    border-radius: 12px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14px;
    text-align: center;
    min-width: 240px;
  }

  .arch-node.frontend { background: rgba(108,63,255,.18); border: 1px solid rgba(108,63,255,.35); color: #c4aeff; }
  .arch-node.backend  { background: rgba(60,212,255,.12); border: 1px solid rgba(60,212,255,.3);  color: var(--sky); }
  .arch-node.db       { background: rgba(60,255,160,.1);  border: 1px solid rgba(60,255,160,.25); color: var(--teal); }
  .arch-node.cache    { background: rgba(255,60,142,.1);  border: 1px solid rgba(255,60,142,.25); color: var(--pink); }

  .arch-arrow {
    width: 2px;
    height: 28px;
    background: linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.03));
    position: relative;
    margin: 2px 0;
  }
  .arch-arrow::after {
    content: '▼';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    color: rgba(255,255,255,.2);
  }

  .arch-row {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  /* ── Algorithm boxes ─────────────────────────────────────────────────── */
  .algo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .algo-box {
    border-radius: 14px;
    padding: 20px;
    border: 1px solid;
  }

  .algo-box.correct {
    background: rgba(60,255,160,.07);
    border-color: rgba(60,255,160,.2);
  }
  .algo-box.wrong {
    background: rgba(255,60,142,.07);
    border-color: rgba(255,60,142,.2);
  }

  .algo-box-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .algo-box.correct .algo-box-title { color: var(--teal); }
  .algo-box.wrong   .algo-box-title { color: var(--pink); }

  .algo-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    color: rgba(255,255,255,.65);
  }
  .algo-item .dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 7px;
  }
  .algo-box.correct .dot { background: var(--teal); }
  .algo-box.wrong   .dot { background: var(--pink); }

  /* ── Code block ──────────────────────────────────────────────────────── */
  .code-block {
    background: rgba(0,0,0,.4);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 12px;
    padding: 20px 24px;
    margin: 16px 0;
    overflow-x: auto;
  }

  pre {
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    color: #c8c0f0;
    white-space: pre;
  }

  .kw  { color: var(--pink); }
  .val { color: var(--teal); }
  .cmt { color: rgba(255,255,255,.3); font-style: italic; }
  .str { color: var(--amber); }

  /* ── Score formula ───────────────────────────────────────────────────── */
  .formula-card {
    background: rgba(0,0,0,.35);
    border: 1px solid rgba(255,176,60,.15);
    border-radius: 14px;
    padding: 24px 28px;
  }

  .formula-line {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .formula-var {
    color: var(--sky);
    font-weight: 500;
    min-width: 120px;
    flex-shrink: 0;
  }

  .formula-eq { color: var(--muted); }
  .formula-expr { color: rgba(255,255,255,.8); }

  /* ── Kv cache table ──────────────────────────────────────────────────── */
  .kv-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 6px;
  }

  .kv-table th {
    font-size: 10px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    text-align: left;
    padding-bottom: 8px;
    padding-left: 14px;
  }

  .kv-row td {
    background: rgba(255,255,255,.04);
    padding: 11px 14px;
    font-size: 13px;
  }
  .kv-row td:first-child { border-radius: 9px 0 0 9px; color: var(--sky); }
  .kv-row td:last-child  { border-radius: 0 9px 9px 0; color: var(--muted); }

  /* ── Endpoints ───────────────────────────────────────────────────────── */
  .endpoint {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 10px;
  }

  .method {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 6px;
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .05em;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .method.get  { background: rgba(60,255,160,.15); color: var(--teal);  border: 1px solid rgba(60,255,160,.3); }
  .method.post { background: rgba(255,176,60,.15); color: var(--amber); border: 1px solid rgba(255,176,60,.3); }

  .endpoint-path { color: #c4aeff; font-size: 14px; }
  .endpoint-desc { color: var(--muted); font-size: 12px; margin-top: 2px; }

  /* ── Checklist ───────────────────────────────────────────────────────── */
  .checklist { display: flex; flex-direction: column; gap: 8px; }

  .check-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    border-radius: 10px;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.05);
    font-size: 13px;
    color: rgba(255,255,255,.7);
  }

  .check-icon {
    width: 22px; height: 22px;
    border-radius: 6px;
    background: rgba(60,255,160,.15);
    border: 1px solid rgba(60,255,160,.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
  }

  /* ── Access grid ─────────────────────────────────────────────────────── */
  .access-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .access-card {
    border-radius: 12px;
    padding: 16px 18px;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--border);
  }

  .access-label {
    font-size: 10px;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .access-url {
    font-size: 13px;
    color: var(--sky);
    word-break: break-all;
  }

  /* ── Divider ─────────────────────────────────────────────────────────── */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent);
    margin: 8px 0 28px;
  }

  /* ── Schema grid ─────────────────────────────────────────────────────── */
  .schema-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .schema-box {
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,.03);
    padding: 16px 18px;
  }

  .schema-box-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: #c4aeff;
    margin-bottom: 10px;
    letter-spacing: -.2px;
  }

  .schema-field {
    font-size: 12px;
    color: var(--muted);
    padding: 3px 0;
    border-bottom: 1px solid rgba(255,255,255,.04);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .schema-field:last-child { border-bottom: none; }
  .schema-field::before {
    content: '';
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--purple);
    flex-shrink: 0;
  }

  /* ── Author footer ────────────────────────────────────────────────────── */
  .footer {
    text-align: center;
    margin-top: 80px;
    color: var(--muted);
    font-size: 12px;
    letter-spacing: .06em;
  }
  .footer strong { color: rgba(255,255,255,.5); }

  /* ── Utility ─────────────────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .algo-grid, .schema-grid, .access-grid { grid-template-columns: 1fr; }
    .page { padding: 40px 20px 64px; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- ── Hero ── -->
  <header class="hero">
    <span class="hero-logo">🧠</span>
    <h1 class="hero-title">BrainBolt</h1>
    <p class="hero-sub">Adaptive infinite quiz platform — dynamically adjusts difficulty, tracks streaks, and runs live leaderboards in real time.</p>
    <div class="hero-badges">
      <span class="badge purple">⚡ Adaptive Algorithm</span>
      <span class="badge teal">✦ Real-time Leaderboards</span>
      <span class="badge pink">🔥 Streak Multiplier</span>
      <span class="badge amber">🐳 Dockerized</span>
      <span class="badge sky">🔐 Idempotent</span>
    </div>
  </header>

  <!-- ── Architecture ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Architecture</h2></div>
    <div class="card">
      <div class="arch">
        <div class="arch-node frontend">Frontend — Next.js + TypeScript</div>
        <div class="arch-arrow"></div>
        <div class="arch-node backend">Backend — Node.js + Express</div>
        <div class="arch-arrow"></div>
        <div class="arch-row">
          <div class="arch-node db">PostgreSQL — persistent data</div>
          <div class="arch-node cache">Redis — cache + leaderboards</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Adaptive Algorithm ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Adaptive Algorithm</h2></div>
    <div class="card">
      <p style="margin-bottom:20px;">Difficulty range: <strong style="color:#fff;">1–10</strong>. State transitions are governed by three signals to prevent ping-pong instability.</p>
      <div class="algo-grid">
        <div class="algo-box correct">
          <div class="algo-box-title">✦ On Correct</div>
          <div class="algo-item"><span class="dot"></span>streak++, momentum++, confidence += difficulty × 2</div>
          <div class="algo-item"><span class="dot"></span>Difficulty ↑ only if streak ≥ 2, momentum ≥ 2, confidence ≥ 10</div>
        </div>
        <div class="algo-box wrong">
          <div class="algo-box-title">✕ On Wrong</div>
          <div class="algo-item"><span class="dot"></span>streak = 0, momentum--, confidence -= difficulty</div>
          <div class="algo-item"><span class="dot"></span>Difficulty ↓ only if momentum ≤ −2 or confidence ≤ −10</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Scoring ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Scoring Model</h2></div>
    <div class="card">
      <div class="formula-card">
        <div class="formula-line">
          <span class="formula-var">base</span>
          <span class="formula-eq">=</span>
          <span class="formula-expr">difficulty × 10</span>
        </div>
        <div class="formula-line">
          <span class="formula-var">multiplier</span>
          <span class="formula-eq">=</span>
          <span class="formula-expr">min(1 + streak × 0.1,  2.0)</span>
        </div>
        <div class="formula-line" style="margin-bottom:0;border-top:1px solid rgba(255,255,255,.06);padding-top:12px;margin-top:4px;">
          <span class="formula-var" style="color:var(--amber);">scoreDelta</span>
          <span class="formula-eq">=</span>
          <span class="formula-expr" style="color:var(--amber);">base × multiplier</span>
        </div>
      </div>
      <p style="margin-top:14px;font-size:13px;">Streak multiplier is capped at <strong style="color:#fff;">2×</strong>. Score updates in real-time after every answer.</p>
    </div>
  </div>

  <!-- ── Leaderboards ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Leaderboards</h2></div>
    <div class="card">
      <p style="margin-bottom:18px;">Two Redis sorted sets, updated immediately after every answer.</p>
      <table class="kv-table">
        <thead><tr><th>Sorted Set Key</th><th>Ranks By</th></tr></thead>
        <tbody>
          <tr class="kv-row"><td>leaderboard:score</td><td>Total score (all-time)</td></tr>
          <tr class="kv-row"><td>leaderboard:streak</td><td>Max streak achieved</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── DB Schema ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Database Schema</h2></div>
    <div class="schema-grid">
      <div class="schema-box">
        <div class="schema-box-title">users</div>
        <div class="schema-field">Registered user records</div>
      </div>
      <div class="schema-box">
        <div class="schema-box-title">questions</div>
        <div class="schema-field">Seeded by difficulty band</div>
      </div>
      <div class="schema-box">
        <div class="schema-box-title">user_state</div>
        <div class="schema-field">currentDifficulty</div>
        <div class="schema-field">streak / maxStreak</div>
        <div class="schema-field">totalScore</div>
        <div class="schema-field">momentum / confidence</div>
        <div class="schema-field">stateVersion</div>
        <div class="schema-field">lastAnswerAt</div>
      </div>
      <div class="schema-box">
        <div class="schema-box-title">answer_log</div>
        <div class="schema-field">All answers (audit trail)</div>
        <div class="schema-box-title" style="margin-top:14px;">idempotency_keys</div>
        <div class="schema-field">Deduplication store</div>
      </div>
    </div>
  </div>

  <!-- ── Caching ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Caching Strategy</h2></div>
    <div class="card">
      <table class="kv-table">
        <thead><tr><th>Key</th><th>Purpose / TTL</th></tr></thead>
        <tbody>
          <tr class="kv-row"><td>user_state:{"{userId}"}</td><td>Cached user state — 1 hour TTL</td></tr>
          <tr class="kv-row"><td>leaderboard:score</td><td>Score sorted set — no TTL</td></tr>
          <tr class="kv-row"><td>leaderboard:streak</td><td>Streak sorted set — no TTL</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Consistency ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Consistency Guarantees</h2></div>
    <div class="card">
      <div class="checklist">
        <div class="check-item"><div class="check-icon">✓</div>SELECT … FOR UPDATE row locking</div>
        <div class="check-item"><div class="check-icon">✓</div>DB transactions on every answer</div>
        <div class="check-item"><div class="check-icon">✓</div>stateVersion conflict detection</div>
        <div class="check-item"><div class="check-icon">✓</div>Idempotency key deduplication</div>
        <div class="check-item"><div class="check-icon">✓</div>Stateless app servers</div>
      </div>
    </div>
  </div>

  <!-- ── API ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">API Endpoints</h2></div>
    <div class="card">
      <div class="endpoint">
        <span class="method get">GET</span>
        <div>
          <div class="endpoint-path">/v1/quiz/next?userId=…</div>
          <div class="endpoint-desc">Returns next adaptive question based on current difficulty</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <div>
          <div class="endpoint-path">/v1/quiz/answer</div>
          <div class="endpoint-desc">Processes answer with idempotency, transaction, difficulty + leaderboard update</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <div>
          <div class="endpoint-path">/v1/leaderboard/score</div>
          <div class="endpoint-desc">Top users by total score</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <div>
          <div class="endpoint-path">/v1/leaderboard/streak</div>
          <div class="endpoint-desc">Top users by max streak</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Running ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Running the Project</h2></div>
    <div class="card">
      <p style="margin-bottom:16px;">Requires <strong style="color:#fff;">Docker</strong> and <strong style="color:#fff;">Docker Compose</strong>. From project root:</p>
      <div class="code-block">
        <pre><span class="kw">docker-compose</span> up --build</pre>
      </div>
      <div class="access-grid" style="margin-top:20px;">
        <div class="access-card"><div class="access-label">Frontend</div><div class="access-url">http://localhost:3000</div></div>
        <div class="access-card"><div class="access-label">Backend</div><div class="access-url">http://localhost:3001</div></div>
        <div class="access-card"><div class="access-label">Quiz</div><div class="access-url">http://localhost:3000/quiz</div></div>
        <div class="access-card"><div class="access-label">Leaderboard</div><div class="access-url">http://localhost:3000/leaderboard</div></div>
      </div>
    </div>
  </div>

  <!-- ── Curl testing ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Testing via cURL</h2></div>
    <div class="card">
      <p style="margin-bottom:12px;font-size:12px;color:var(--muted);">GET question</p>
      <div class="code-block">
        <pre><span class="kw">curl</span> http://localhost:3001/v1/quiz/next</pre>
      </div>
      <p style="margin:16px 0 12px;font-size:12px;color:var(--muted);">POST answer</p>
      <div class="code-block"><pre><span class="kw">curl</span> -X POST http://localhost:3001/v1/quiz/answer \
  -H <span class="str">"Content-Type: application/json"</span> \
  -d <span class="str">'{
    "userId":        "USER_ID",
    "questionId":    "QUESTION_ID",
    "answer":        "A",
    "stateVersion":  1,
    "idempotencyKey":"unique-key"
  }'</span></pre></div>
    </div>
  </div>

  <!-- ── Checklist ── -->
  <div class="section">
    <div class="section-label"><h2 class="section-title">Assignment Compliance</h2></div>
    <div class="card">
      <div class="checklist">
        <div class="check-item"><div class="check-icon">✓</div>Adaptive algorithm</div>
        <div class="check-item"><div class="check-icon">✓</div>Ping-pong prevention</div>
        <div class="check-item"><div class="check-icon">✓</div>Streak multiplier scoring</div>
        <div class="check-item"><div class="check-icon">✓</div>Real-time leaderboards</div>
        <div class="check-item"><div class="check-icon">✓</div>Idempotency</div>
        <div class="check-item"><div class="check-icon">✓</div>Strong consistency (SELECT FOR UPDATE + transactions)</div>
        <div class="check-item"><div class="check-icon">✓</div>SSR page (Leaderboard)</div>
        <div class="check-item"><div class="check-icon">✓</div>CSR + live polling (Quiz)</div>
        <div class="check-item"><div class="check-icon">✓</div>Redis caching</div>
        <div class="check-item"><div class="check-icon">✓</div>Dockerized full stack</div>
      </div>
    </div>
  </div>

  <!-- ── Footer ── -->
  <footer class="footer">
    <p>BrainBolt Assignment Submission &nbsp;·&nbsp; <strong>2026</strong></p>
  </footer>

</div>
</body>
</html>
