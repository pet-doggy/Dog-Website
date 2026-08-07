import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { config } from './config.js';

export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  realtime: {
    transport: WebSocket
  }
});
