-- Create waitlist_comments table in Supabase

CREATE TABLE waitlist_comments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  quote text NOT NULL,
  avatar text NOT NULL,
  approved boolean DEFAULT false NOT NULL
);

-- Create index for faster queries on approved comments
CREATE INDEX idx_waitlist_comments_approved ON waitlist_comments(approved, created_at DESC);

-- Add Row Level Security (RLS) policies
ALTER TABLE waitlist_comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert comments (for public submission)
CREATE POLICY "Anyone can submit comments" ON waitlist_comments
  FOR INSERT WITH CHECK (true);

-- Only show approved comments publicly
CREATE POLICY "Show approved comments" ON waitlist_comments
  FOR SELECT USING (approved = true);

-- Only service role can update approval status (admin only)
-- This is handled by server-side code using service role key
