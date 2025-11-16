import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Save token to localStorage on auth state change
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.access_token) {
    localStorage.setItem('supabase_token', session.access_token);
  } else {
    localStorage.removeItem('supabase_token');
  }
});
