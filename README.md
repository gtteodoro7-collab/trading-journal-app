````markdown
**Welcome to your Supabase project**

**About**

This project uses Supabase as the backend. The repo contains everything you need to run the app locally.

**Edit the code in your local development environment**

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file in the project root and set the following environment variables (do not commit this file):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

Example (do NOT use real keys in the repo):

```
VITE_SUPABASE_URL=https://trcqonhkqtejkshylusj.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key-example
```

Run the app: `npm run dev`

**Deploy / Publish**

See Supabase docs for deployment guidance: https://supabase.com/docs

---

## Subscriptions (quick setup)

This project stores a simple subscription flag on the user's `profiles` row (`is_subscribed` boolean).

1. Add the column in your Supabase SQL editor:

```sql
alter table profiles
add column if not exists is_subscribed boolean default false;
```

2. When you integrate a payment provider (Stripe, Paddle, etc.) create a server-side webhook or Supabase Function
	that calls the `setSubscriptionStatus(userId, true)` helper (see `src/lib/subscription.js`) using the Supabase
	service role key. Do NOT call the write helper from untrusted client-side code.

3. The frontend `AuthContext` now reads `is_subscribed` automatically and exposes `isSubscribed` and
	`refreshSubscription()` via `useAuth()` so you can gate UI/routes.

Example server-side action (Node):

```js
// pseudo-code, run on server with SUPABASE_SERVICE_ROLE_KEY
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

await supabase.from('profiles').update({ is_subscribed: true }).eq('id', userId);
```

If you prefer I can scaffold a Supabase Edge Function or a minimal serverless endpoint to handle subscription events.
I created an example Edge Function at `supabase/functions/set-subscription/index.js` which expects a POST
with `{ userId, subscribed }` and a `X-Webhook-Secret` header. Deploy it with the Supabase CLI and set
`SUPABASE_SERVICE_ROLE_KEY` + `WEBHOOK_SECRET` in the function's env. The function updates the `profiles` row.

There is an admin page at `/admin/subscriptions` (`src/pages/admin/SubcriptionsAdmin.jsx`) where you can
list profiles and toggle `is_subscribed` for testing. In production you should update `is_subscribed`
only from a trusted server-side webhook or function (see Edge Function example above).

````
