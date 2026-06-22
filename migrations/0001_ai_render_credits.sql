CREATE TABLE IF NOT EXISTS ai_render_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  session_token TEXT NOT NULL UNIQUE,
  credits_remaining INTEGER NOT NULL DEFAULT 3,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anonymous_render_usage (
  ip_hash TEXT NOT NULL,
  usage_date TEXT NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ip_hash, usage_date)
);

CREATE TABLE IF NOT EXISTS ai_render_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  ip_hash TEXT,
  tool TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES ai_render_users(id)
);

CREATE INDEX IF NOT EXISTS idx_ai_render_users_email ON ai_render_users(email);
CREATE INDEX IF NOT EXISTS idx_ai_render_users_session_token ON ai_render_users(session_token);
CREATE INDEX IF NOT EXISTS idx_ai_render_events_created_at ON ai_render_events(created_at);
