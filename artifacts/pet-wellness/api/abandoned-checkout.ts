import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppMessage, notifyAdminWhatsApp } from './whatsapp-helper.js';

export default async function handler(req: any, res: any) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
    );

    // Support both application/json and text/plain (navigator.sendBeacon sends text/plain)
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch (e) {
        bodyData = {};
      }
    }

    const {
      customerName, phone, productId, variantId, quantity, productName, variantName
    } = bodyData;

    if (!customerName || !phone) {
      throw new Error("Missing required fields");
    }

    // 1. Save to database
    const { data: cartData, error: dbError } = await supabase
      .from('abandoned_carts')
      .insert({
        customer_name: customerName,
        phone: phone,
        product_id: productId,
        variant_id: variantId,
        quantity: quantity || 1,
        status: 'abandoned'
      })
      .select('id')
      .single();

    if (dbError) console.error("Error saving abandoned cart to DB:", dbError);

    const escapeHtml = (unsafe: any) => {
      if (!unsafe) return '';
      return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    // 2. Prepare Notifications
    const safeCustomerName = escapeHtml(customerName);
    const safePhone = escapeHtml(phone);
    const safeProductName = escapeHtml(productName || 'Unknown');
    const safeVariantName = variantName ? ` (${escapeHtml(variantName)})` : '';
    
    // Telegram Message
    const telegramMessage = `⚠️ <b>Abandoned Checkout</b>\n\n` +
      `👤 <b>Name:</b> ${safeCustomerName}\n` +
      `📞 <b>Phone:</b> ${safePhone}\n` +
      `📦 <b>Product:</b> ${safeProductName}${safeVariantName}\n` +
      `🔢 <b>Quantity:</b> ${quantity || 1}\n` +
      `⏱️ <b>Time:</b> ${new Date().toISOString()}`;

    // WhatsApp Messages
    const host = req.headers.host || process.env.VITE_APP_URL || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const resumeUrl = cartData?.id ? `${protocol}://${host}/checkout/resume/${cartData.id}` : '#';

    const customerWhatsAppMessage = `Hi ${customerName},\n\nYou were looking at ${productName || 'our product'}${variantName ? ` (${variantName})` : ''}.\n\nComplete your payment now and get a ₹50 discount! 🎉\n\nClick here to pay and complete your order: ${resumeUrl}`;
    const adminWhatsAppMessage = `⚠️ Abandoned Cart Alert\n\nName: ${customerName}\nPhone: ${phone}\nProduct: ${productName || 'Unknown'}\n\nA follow-up discount link has been sent.`;

    // 3. Send Notifications Concurrently
    const notificationPromises = [];

    // Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      notificationPromises.push(
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'HTML'
          })
        }).then(res => {
          if (!res.ok) console.error("Failed to send telegram notification");
        }).catch(err => console.error("Telegram error:", err))
      );
    }

    // WhatsApp
    notificationPromises.push(sendWhatsAppMessage(phone, customerWhatsAppMessage));
    notificationPromises.push(notifyAdminWhatsApp(adminWhatsAppMessage));

    await Promise.allSettled(notificationPromises);

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}
