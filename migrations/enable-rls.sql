-- migrations/enable-rls.sql

-- 1) Add user_id columns if missing
ALTER TABLE IF EXISTS trades
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE IF EXISTS accounts
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2) Ensure profiles exists and add is_subscribed flag if missing
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_subscribed boolean DEFAULT false;

-- 3) Enable RLS
ALTER TABLE IF EXISTS trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- 4) Policies: users can manage only their own rows
-- trades
CREATE POLICY IF NOT EXISTS "Users can manage their trades" ON trades
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- accounts
CREATE POLICY IF NOT EXISTS "Users can manage their accounts" ON accounts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- profiles: view/update own profile
CREATE POLICY IF NOT EXISTS "Users can view their profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- allow inserts for new profiles (signup flow)
CREATE POLICY IF NOT EXISTS "Allow profile insert for authenticated" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
