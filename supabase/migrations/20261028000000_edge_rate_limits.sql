-- Shared rate-limit log for all public edge functions (chat, leads, contact form)
CREATE TABLE IF NOT EXISTS edge_rate_limits (
  id BIGSERIAL PRIMARY KEY,
  scope TEXT NOT NULL,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS edge_rate_limits_scope_created_at_idx ON edge_rate_limits (scope, created_at);
CREATE INDEX IF NOT EXISTS edge_rate_limits_scope_ip_created_at_idx ON edge_rate_limits (scope, ip, created_at);

-- RLS with no policies: only the service role key (edge functions) can access it
ALTER TABLE edge_rate_limits ENABLE ROW LEVEL SECURITY;

-- Replaced by edge_rate_limits (scope = 'contact'); it only held short-lived rate-limit rows
DROP TABLE IF EXISTS contact_rate_limits;
