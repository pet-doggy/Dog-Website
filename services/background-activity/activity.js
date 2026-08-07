import { config } from './config.js';
import { supabase } from './supabase.js';

// Helper for random delay between 2 and 8 seconds
const randomDelay = () => {
  const ms = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Reusable fetch with exponential backoff
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text(); // or buffer/json depending on need, we just need to hit it
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) throw error;
      const backoffMs = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
      console.log(`Retry ${attempt}/${maxRetries} for ${url} in ${Math.round(backoffMs)}ms...`);
      await new Promise(res => setTimeout(res, backoffMs));
    }
  }
};

export const performActivityCycle = async () => {
  console.log(`\n--- Starting Activity Cycle at ${new Date().toISOString()} ---`);
  
  try {
    // 1. Visit the website homepage
    console.log(`[1/4] Fetching homepage: ${config.homepageUrl}`);
    await fetchWithRetry(config.homepageUrl);
    console.log(`✓ Homepage fetched successfully.`);
    await randomDelay();

    // 2. Request public API endpoint
    console.log(`[2/4] Requesting API endpoint: ${config.apiEndpoint}`);
    await fetchWithRetry(config.apiEndpoint);
    console.log(`✓ API endpoint requested successfully.`);
    await randomDelay();

    // 3. Execute harmless SELECT query against Supabase
    console.log(`[3/4] Querying Supabase table: ${config.supabaseTable}`);
    const { data, error } = await supabase
      .from(config.supabaseTable)
      .select('*')
      .limit(1);
    
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    console.log(`✓ Supabase query successful.`);
    await randomDelay();

    // 4. Download static asset
    console.log(`[4/4] Downloading static asset: ${config.staticAsset}`);
    await fetchWithRetry(config.staticAsset);
    console.log(`✓ Static asset downloaded successfully.`);
    
  } catch (error) {
    console.error(`❌ Error during activity cycle:`, error.message);
    // We catch and log, but don't rethrow to ensure the loop continues running
  } finally {
    console.log(`--- Completed Activity Cycle at ${new Date().toISOString()} ---\n`);
  }
};
