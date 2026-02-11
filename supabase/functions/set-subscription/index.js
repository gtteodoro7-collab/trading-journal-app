/*
 Supabase Edge Function (node) - set-subscription

 Expects POST JSON: { userId: string, subscribed: boolean }
 Requires env:
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - WEBHOOK_SECRET  (shared secret to protect this endpoint)

 Deploy with supabase CLI and set the env vars in the function's config.
*/

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const secret = req.headers['x-webhook-secret'] || req.headers['x-secret'];
    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, subscribed } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return res.status(500).json({ error: 'Supabase service keys not configured' });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data, error } = await supabase
      .from('profiles')
      .update({ is_subscribed: !!subscribed })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (e) {
    console.error('set-subscription error', e);
    return res.status(500).json({ error: e.message || 'internal' });
  }
}
