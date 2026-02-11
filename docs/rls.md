# RLS / Multi-tenant instructions

Use these steps to make the app safe to share: each authenticated user will only see and modify their own rows.

## Overview
- Add `user_id` to per-user tables (`trades`, `accounts`).
- Ensure `profiles` exists and has `is_subscribed` boolean.
- Enable Row Level Security (RLS) on tables.
- Add policies using `auth.uid()` so users can only access rows they own.

## Apply
You can apply the prepared migration `migrations/enable-rls.sql` in the Supabase SQL editor or via the Supabase CLI.

## Testing
1. Open an incognito browser window.
2. Sign up with a new account and create a few trades.
3. Confirm those trades do not appear in another logged-in account.

## Notes
- Writing `is_subscribed` should be done server-side (Edge Function or server endpoint) using the Supabase service role key.
- If you have legacy rows without `user_id`, review them before attempting to backfill ownership.

If quiser, eu gero um passo-a-passo para usar a Supabase CLI para aplicar essa migration e deployar a Edge Function `supabase/functions/set-subscription`.
