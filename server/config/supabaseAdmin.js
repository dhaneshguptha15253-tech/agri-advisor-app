import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseServiceKey &&
  supabaseServiceKey !== 'your_supabase_service_role_key'
);

if (!isConfigured) {
  console.warn('⚠️ [AgriAdvisor Server] WARNING: Supabase credentials not fully configured.');
  console.warn('Using in-memory/fallback database mode until valid Supabase credentials are provided in server/.env.\n');
}

export const supabaseAdmin = isConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const isSupabaseConfigured = () => isConfigured;
