-- Migration: Add education_level column to sessions table
-- Run this migration in your Supabase SQL Editor

ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS education_level TEXT DEFAULT 'master'
CHECK (education_level IN ('bachelor', 'master'));

-- Optional: Add comment for documentation
COMMENT ON COLUMN sessions.education_level IS 'Education level for the session: bachelor (~2h, 6 groups) or master (~3h, 8 groups)';
