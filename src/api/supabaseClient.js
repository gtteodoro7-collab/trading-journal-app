import { createClient } from '@supabase/supabase-js';

// Use environment variables set in .env.local (Vite exposes them as import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	// In development, it's useful to log a friendly warning rather than crash.
	// Ensure you create a `.env.local` file with the variables below.
	// Do NOT commit your real keys to source control.
	// Example variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
	// For CI / production, set real env vars in your deployment platform.
	// eslint-disable-next-line no-console
	console.warn('Supabase: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env.local');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
