import { createClient } from '@supabase/supabase-js';

// The URL and Key will be provided by Vite's environment variables
// Make sure to add these to your Vercel project environment settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vfepttvmpzexadgohurh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
