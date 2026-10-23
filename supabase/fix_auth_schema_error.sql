-- ==============================================================================
-- IEEE Education Society SRMIST Kattankulathur
-- Database Fix Script for Supabase SQL Editor
--
-- TARGET ERROR: "Database error querying schema" (HTTP 500 from Supabase Auth)
--
-- HOW TO USE:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project (dpvxtpsefrfrlokjvbas)
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New query", paste this script, and click "Run" (Cmd+Enter / Ctrl+Enter)
-- 5. Return to the admin login page and sign in with your officer credentials
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

-- Verify the result safely without exposing sensitive token values
SELECT 
  count(*) AS total_users,
  count(*) FILTER (WHERE confirmation_token IS NULL OR recovery_token IS NULL OR email_change IS NULL) AS remaining_null_token_users
FROM auth.users;

