import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mockStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: any = null;

if (supabaseUrl && supabaseAnonKey && typeof supabaseUrl === 'string' && supabaseUrl.startsWith('http')) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    });
  } catch (err) {
    console.warn('[AI Studio] Fallback to mock store due to Supabase init error:', err);
    client = mockSupabase;
  }
} else {
  // Graceful fallback to persistent localStorage mock store with seed plushies
  client = mockSupabase;
}

export const supabase = client;
