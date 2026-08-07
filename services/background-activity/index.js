import { performActivityCycle } from './activity.js';

// 15 minutes in milliseconds
const INTERVAL_MS = 15 * 60 * 1000;

const startService = async () => {
  console.log(`🚀 Starting Background Activity Service...`);
  console.log(`Cycle interval: ${INTERVAL_MS / 1000 / 60} minutes.`);

  // Run the first cycle immediately
  await performActivityCycle();

  // Schedule subsequent cycles indefinitely
  setInterval(async () => {
    await performActivityCycle();
  }, INTERVAL_MS);
};

// Catch unhandled rejections to prevent the process from crashing
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

startService();
