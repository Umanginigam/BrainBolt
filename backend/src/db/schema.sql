CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
  prompt TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct_answer_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_difficulty
ON questions(difficulty);

CREATE TABLE IF NOT EXISTS user_state (
  user_id UUID PRIMARY KEY REFERENCES users(id),

  current_difficulty INT DEFAULT 1 CHECK (current_difficulty BETWEEN 1 AND 10),

  streak INT DEFAULT 0,
  max_streak INT DEFAULT 0,

  total_score BIGINT DEFAULT 0,

  momentum INT DEFAULT 0,
  confidence INT DEFAULT 0,

  state_version INT DEFAULT 1,

  last_answer_at TIMESTAMP DEFAULT NOW(),

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answer_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  question_id UUID REFERENCES questions(id),

  difficulty INT NOT NULL,
  answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  score_delta INT NOT NULL,

  streak_at_answer INT NOT NULL,

  answered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answer_user
ON answer_log(user_id);

CREATE INDEX IF NOT EXISTS idx_answer_question
ON answer_log(question_id);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  response JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
