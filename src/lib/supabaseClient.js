// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase env vars: set REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_ANON_KEY or VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

export default supabase;