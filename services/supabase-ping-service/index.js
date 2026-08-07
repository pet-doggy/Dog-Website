import { config } from './config.js';
import { supabase } from './supabase.js';

// 15 minutes in milliseconds
const INTERVAL_MS = 15 * 60 * 1000;

// Reusable function to perform a Supabase query with exponential backoff
const pingSupabaseWithRetry = async (maxRetries = 3) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const { data, error } = await supabase
        .from(config.supabaseTable)
        .select('*')
        .limit(1);

      if (error) {
        throw new Error(`Supabase query failed: ${error.message}`);
      }
      return data; // Success
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error; // Max retries reached, throw the error
      }
      const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      console.log(`[${new Date().toISOString()}] Retry ${attempt}/${maxRetries} for Supabase ping in ${Math.round(backoffMs)}ms...`);
      await new Promise(res => setTimeout(res, backoffMs));
    }
  }
};

const performPingCycle = async () => {
  console.log(`\n--- Starting Supabase Ping Cycle at ${new Date().toISOString()} ---`);
  
  try {
    console.log(`Pinging table: ${config.supabaseTable}`);
    await pingSupabaseWithRetry();
    console.log(`[${new Date().toISOString()}] ✓ Supabase ping successful.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error during Supabase ping:`, error.message);
  } finally {
    console.log(`--- Completed Supabase Ping Cycle ---\n`);
  }
};

const startService = async () => {
  console.log(`🚀 Starting Lightweight Supabase Ping Service...`);
  console.log(`Cycle interval: ${INTERVAL_MS / 1000 / 60} minutes.`);

  // Run the first ping immediately
  await performPingCycle();

  // Schedule subsequent pings indefinitely
  setInterval(async () => {
    await performPingCycle();
  }, INTERVAL_MS);
};

// Catch unhandled rejections to prevent the process from crashing
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, err);
});

startService();
