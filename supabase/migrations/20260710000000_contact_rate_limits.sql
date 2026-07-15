-- Create contact_rate_limits table
CREATE TABLE IF NOT EXISTS contact_rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for optimized rate-limit queries
CREATE INDEX IF NOT EXISTS contact_rate_limits_ip_created_at_idx ON contact_rate_limits (ip, created_at);

-- Enable RLS
ALTER TABLE contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- Note: Since RLS is enabled and no policies are defined, only the service role key (used by our Edge Function) can read or write to this table.
