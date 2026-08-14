export async function sendWhatsAppMessage(phone: string, text: string) {
  const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;
  const WHATSAPP_AUTH_TOKEN = process.env.WHATSAPP_AUTH_TOKEN;

  if (!WHATSAPP_WEBHOOK_URL) {
    console.warn("WhatsApp Webhook URL not configured. Skipping WhatsApp message.");
    return false;
  }

  // Generic payload format, the user will specify exact mapping later
  const payload = {
    phone: phone,
    message: text,
  };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // If an auth token is provided, add it to headers (user will specify exact header later)
    if (WHATSAPP_AUTH_TOKEN) {
      headers['Authorization'] = `Bearer ${WHATSAPP_AUTH_TOKEN}`;
      headers['x-api-key'] = WHATSAPP_AUTH_TOKEN; // Fallback typical header
    }

    const response = await fetch(WHATSAPP_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`WhatsApp API responded with ${response.status}:`, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

export async function notifyAdminWhatsApp(text: string) {
  const WHATSAPP_ADMIN_NUMBER = process.env.WHATSAPP_ADMIN_NUMBER;
  
  if (!WHATSAPP_ADMIN_NUMBER) {
    console.warn("Admin WhatsApp number not configured. Skipping Admin notification.");
    return false;
  }

  return sendWhatsAppMessage(WHATSAPP_ADMIN_NUMBER, text);
}
