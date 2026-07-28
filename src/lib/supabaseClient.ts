import { createClient } from '@supabase/supabase-js';

// Environment variables or local dev fallback defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-kalai.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
