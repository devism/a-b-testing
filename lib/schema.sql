CREATE TABLE IF NOT EXISTS ab_events (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT        NOT NULL CHECK (event_type IN ('impression', 'conversion')),
  variant     TEXT        NOT NULL CHECK (variant IN ('control', 'treatment')),
  distinct_id TEXT        NOT NULL DEFAULT 'anonymous',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ab_events_variant_idx ON ab_events (variant);
CREATE INDEX IF NOT EXISTS ab_events_event_type_idx ON ab_events (event_type);
