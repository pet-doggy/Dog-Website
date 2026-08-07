import dotenv from 'dotenv';
dotenv.config();

export const config = {
  supabaseUrl: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-key',
  supabaseTable: process.env.TARGET_SUPABASE_TABLE || 'profiles',
};

if (config.supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ WARNING: Using placeholder Supabase URL. Please copy .env.example to .env and configure your variables.');
}
