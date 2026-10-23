-- ==============================================================================
-- IEEE Education Society Student Chapter (SRMIST Kattankulathur)
-- Migration: Fix "Database error querying schema" (GoTrue auth.users NULL tokens)
-- ==============================================================================
--
-- CAUSE & DIAGNOSIS:
-- In Supabase Auth (GoTrue), the internal Pop ORM queries `auth.users` when an
-- officer or admin attempts to sign in. If a user record was inserted or updated
-- directly via SQL (e.g., initial migration scripts, database seeds, or AI tools)
-- instead of through the GoTrue Auth API, token columns like `confirmation_token`,
-- `recovery_token`, `email_change`, `email_change_token_new`, or `reauthentication_token`
-- are left as NULL.
--
-- Because GoTrue's internal Go struct declares these as non-nullable strings,
-- the Go database/sql scanner throws: "converting NULL to string is unsupported".
-- GoTrue catches this and returns HTTP 500: "Database error querying schema".
--
-- REMEDIATION:
-- 1. Replace NULL string values in `auth.users` with empty strings ('').
-- 2. Set default constraints on these columns so future records are never NULL.
-- ==============================================================================

UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
WHERE 
  confirmation_token IS NULL 
  OR recovery_token IS NULL 
  OR email_change IS NULL 
  OR email_change_token_new IS NULL
  OR email_change_token_current IS NULL
  OR reauthentication_token IS NULL;

-- Ensure default constraints to prevent recurrence
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'confirmation_token'
  ) THEN
    ALTER TABLE auth.users ALTER COLUMN confirmation_token SET DEFAULT '';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'recovery_token'
  ) THEN
    ALTER TABLE auth.users ALTER COLUMN recovery_token SET DEFAULT '';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'email_change'
  ) THEN
    ALTER TABLE auth.users ALTER COLUMN email_change SET DEFAULT '';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'email_change_token_new'
  ) THEN
    ALTER TABLE auth.users ALTER COLUMN email_change_token_new SET DEFAULT '';
  END IF;
END $$;
