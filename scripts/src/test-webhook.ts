/**
 * Test script to trigger the Warecover Webhook locally.
 * Run using: pnpm run test-webhook (from within scripts directory)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const WEBHOOK_URL = process.env.WARECOVER_WEBHOOK_URL || "";
const AUTH_TOKEN = process.env.WARECOVER_AUTH_TOKEN || "";

const payload = {
  "event": "abandoned_cart",
  "customer": {
    "name": "Jane Doe",
    "phone": "919876543210",
    "email": "jane@example.com"
  },
  "order": {
    "order_id": "AEG-2026-001",
    "total_amount": "1499.00",
    "currency": "INR",
    "items": [
      {
        "name": "Artisanal Ghee",
        "quantity": 1,
        "price": "1499.00"
      }
    ]
  },
  "shipping_address": {
    "address": "123 Gourmet Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
};

async function testWebhook() {
  console.log("Sending payload to Warecover webhook...");
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log("✅ Webhook triggered successfully!");
      const data = await response.text();
      console.log("Response:", data);
    } else {
      console.error("❌ Failed to trigger webhook.");
      const errorData = await response.text();
      console.error("Error Response:", errorData);
    }
  } catch (error) {
    console.error("Error connecting to the webhook URL:", error);
  }
}

testWebhook();
