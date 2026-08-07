import dotenv from 'dotenv';
dotenv.config();

export const config = {
  supabaseUrl: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'placeholder-key',
  homepageUrl: process.env.TARGET_HOMEPAGE_URL || 'https://example.com',
  apiEndpoint: process.env.TARGET_API_ENDPOINT || 'https://example.com/api/ping',
  staticAsset: process.env.TARGET_STATIC_ASSET || 'https://example.com/favicon.ico',
  supabaseTable: process.env.TARGET_SUPABASE_TABLE || 'profiles',
};

// Log a warning if default placeholders are being used
if (config.supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ WARNING: Using placeholder Supabase URL. Please copy .env.example to .env and configure your variables.');
}
