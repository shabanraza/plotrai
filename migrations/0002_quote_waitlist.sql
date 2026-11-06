-- Early list for the client-quote tool (fake-door test). One row per contact per tool.
CREATE TABLE IF NOT EXISTS quote_waitlist (
  id TEXT PRIMARY KEY,
  contact TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  role TEXT NOT NULL,
  projects TEXT,
  would_pay TEXT NOT NULL,
  tool TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (contact, tool)
);

CREATE INDEX IF NOT EXISTS idx_quote_waitlist_created_at ON quote_waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_quote_waitlist_ip_hash ON quote_waitlist(ip_hash, created_at);
