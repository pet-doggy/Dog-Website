import crypto from 'crypto';

/**
 * Standardize and hash PII fields per Meta's requirements.
 * Strings must be lowercase, trimmed, and hashed with SHA-256.
 */
function hashData(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  
  // Clean and normalize
  const normalized = value.trim().toLowerCase();
  
  // If already hashed (looks like 64-char hex), return as is
  if (/^[a-f0-9]{64}$/.test(normalized)) {
    return normalized;
  }
  
  // Hash using SHA-256
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalizes phone numbers (remove symbols, leading zeros, etc.)
 */
function hashPhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  let normalized = phone.replace(/[^\d]/g, '');
  // Quick sanity check for country codes, assuming no '+' since it's stripped
  // If already 64 chars, it's hashed
  if (/^[a-f0-9]{64}$/.test(phone.toLowerCase())) {
    return phone.toLowerCase();
  }
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

const META_API_VERSION = 'v19.0';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
  const META_PIXEL_ID = process.env.VITE_META_PIXEL_ID;

  if (!META_ACCESS_TOKEN) {
    console.error('META_ACCESS_TOKEN is missing in environment variables.');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const body = req.body;
    
    // Extract req data
    const { event_name, event_id, event_source_url, custom_data, user_data } = body;
    
    // Auto-detect IP and User-Agent
    const client_ip_address = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const client_user_agent = req.headers['user-agent'] || '';

    // Process and Hash User Data
    const processedUserData: any = {
      client_ip_address,
      client_user_agent,
    };

    if (user_data) {
      if (user_data.fbp) processedUserData.fbp = user_data.fbp;
      if (user_data.fbc) processedUserData.fbc = user_data.fbc;
      if (user_data.email) processedUserData.em = [hashData(user_data.email)];
      if (user_data.phone) processedUserData.ph = [hashPhone(user_data.phone)];
      if (user_data.firstName) processedUserData.fn = [hashData(user_data.firstName)];
      if (user_data.lastName) processedUserData.ln = [hashData(user_data.lastName)];
      if (user_data.city) processedUserData.ct = [hashData(user_data.city)];
      if (user_data.state) processedUserData.st = [hashData(user_data.state)];
      if (user_data.zipCode) processedUserData.zp = [hashData(user_data.zipCode)];
      if (user_data.country) processedUserData.country = [hashData(user_data.country)];
      if (user_data.externalId) processedUserData.external_id = [hashData(user_data.externalId)];
      if (user_data.gender) processedUserData.ge = [hashData(user_data.gender)];
      if (user_data.dateOfBirth) processedUserData.db = [hashData(user_data.dateOfBirth)];
    }

    // Build the data payload
    const eventPayload: any = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url,
      event_id,
      user_data: processedUserData,
      custom_data: custom_data || {},
    };

    const capiBody = {
      data: [eventPayload],
      ...(META_TEST_EVENT_CODE ? { test_event_code: META_TEST_EVENT_CODE } : {})
    };

    // Retry logic
    const MAX_RETRIES = 3;
    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < MAX_RETRIES && !success) {
      try {
        const response = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(capiBody),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`Meta API Error: ${JSON.stringify(data)}`);
        }

        success = true;
      } catch (err) {
        attempt++;
        lastError = err;
        console.error(`Meta CAPI Attempt ${attempt} failed:`, err);
        if (attempt < MAX_RETRIES) {
          await new Promise(res => setTimeout(res, 500 * Math.pow(2, attempt - 1)));
        }
      }
    }

    if (!success) {
      console.error('Failed to send event to Meta after retries', lastError);
      return res.status(500).json({ error: 'Failed to send event to Meta' });
    }

    return res.status(200).json({ success: true, event_id });

  } catch (err: any) {
    console.error('Meta CAPI route error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
