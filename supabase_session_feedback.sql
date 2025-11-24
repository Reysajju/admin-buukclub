-- Session feedback storage for both authors and readers

CREATE TABLE IF NOT EXISTS session_feedback (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  role text NOT NULL CHECK (role IN ('author', 'reader')),
  session_name text,
  author_display_name text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback_text text,
  enjoyment_level text,
  would_attend_again text,
  email text,
  opted_in boolean DEFAULT false,
  engagement_level text,
  highlight text,
  challenge text,
  wins text,
  support_needs text,
  payload jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_session_feedback_role_created ON session_feedback(role, created_at DESC);

ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert feedback" ON session_feedback
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only service role can select feedback" ON session_feedback
  FOR SELECT
  USING (auth.role() = 'service_role');
