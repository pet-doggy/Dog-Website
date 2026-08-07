export default async function handler(req: any, res: any) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, message, type } = req.body;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn("Telegram credentials not configured in environment.");
      return res.status(500).json({ error: 'Telegram not configured' });
    }

    const escapeHtml = (unsafe: any) => {
      if (!unsafe) return '';
      return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    let text = `🔔 <b>New Notification</b>\n\n`;
    if (type === 'newsletter') {
      text = `✉️ <b>New Newsletter Subscriber!</b>\n<b>Email:</b> ${safeEmail}`;
    } else if (message) {
      text = `📝 <b>New Message:</b>\n${safeMessage}`;
    } else if (email) {
      text += `<b>Email:</b> ${safeEmail}`;
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API responded with ${response.status}`);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending Telegram notification:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
