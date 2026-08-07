import { createClient } from '@supabase/supabase-js';

const CASHFREE_ENVIRONMENT = "PRODUCTION";

export default async function handler(req: any, res: any) {
  const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
  const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
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

    const { order_id } = req.body;
    
    if (!order_id) {
       throw new Error("Missing order_id");
    }

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
       throw new Error('Cashfree credentials are not configured on the server.');
    }

    // 1. Verify with Cashfree
    const baseUrl = CASHFREE_ENVIRONMENT === "PRODUCTION" 
      ? "https://api.cashfree.com/pg" 
      : "https://sandbox.cashfree.com/pg";

    const cashfreeRes = await fetch(`${baseUrl}/orders/${order_id}`, {
      method: 'GET',
      headers: {
        'x-client-id': CASHFREE_APP_ID || '',
        'x-client-secret': CASHFREE_SECRET_KEY || '',
        'x-api-version': '2023-08-01',
      },
    });

    const cashfreeData = await cashfreeRes.json();

    if (!cashfreeRes.ok) {
      throw new Error(cashfreeData.message || 'Failed to fetch Cashfree order status');
    }

    const paymentStatus = cashfreeData.order_status; // Usually "PAID", "ACTIVE", etc.
    const isPaid = paymentStatus === 'PAID';
    const cashfreeAddons = cashfreeData.order_tags?.addons;
    const protocolTier = cashfreeData.order_tags?.protocol;

    // 2. Update database
    const newStatus = isPaid ? 'paid' : 'failed';
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ payment_status: newStatus })
      .eq('order_number', order_id)
      .select(`
        *,
        order_items (
          quantity,
          products ( name ),
          product_variants ( weight, size )
        )
      `)
      .single();

    if (updateError) {
      console.error("Error updating order:", updateError);
    }

    // 3. Send Telegram Notification
    let telegram_status = 'not_attempted';
    if (updatedOrder && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      
      const escapeHtml = (unsafe: any) => {
        if (!unsafe) return '';
        return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      };

      const itemsText = updatedOrder.order_items?.map((item: any) => 
        `- ${escapeHtml(item.products?.name)} (${escapeHtml(item.product_variants?.weight || item.product_variants?.size)}) x ${item.quantity}`
      ).join('\n') || 'Unknown Items';

      const addonsLine = cashfreeAddons && cashfreeAddons !== "None" 
        ? `\n➕ <b>Add-ons:</b> ${escapeHtml(cashfreeAddons)}` 
        : "";

      const protocolLine = protocolTier && protocolTier !== "None"
        ? `\n🐾 <b>Protocol:</b> ${escapeHtml(protocolTier)}`
        : "";

      const title = isPaid ? `✅ <b>Successful Payment</b>` : `❌ <b>Payment Failed/Cancelled</b>`;

      const message = `${title}\n\n` +
        `🆔 <b>Order ID:</b> ${escapeHtml(updatedOrder.order_number)}\n` +
        `👤 <b>Name:</b> ${escapeHtml(updatedOrder.customer_name)}\n` +
        `📞 <b>Phone:</b> ${escapeHtml(updatedOrder.phone)}\n` +
        `🏠 <b>Address:</b> ${escapeHtml(updatedOrder.address)}, ${escapeHtml(updatedOrder.city)}, ${escapeHtml(updatedOrder.state)} - ${escapeHtml(updatedOrder.pin_code)}\n` +
        `📦 <b>Products:</b>\n${itemsText}${addonsLine}${protocolLine}\n` +
        `💰 <b>Amount:</b> ₹${updatedOrder.total_amount}\n` +
        `💳 <b>Status:</b> ${escapeHtml(paymentStatus)}\n` +
        `⏱️ <b>Time:</b> ${new Date().toISOString()}`;

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        if (!tgRes.ok) {
          console.error("Telegram API Error:", await tgRes.text());
          telegram_status = 'failed';
        } else {
          telegram_status = 'success';
        }
      } catch (e) {
        console.error("Telegram notification error:", e);
        telegram_status = 'error';
      }
    }

    return res.status(200).json({ success: true, payment_status: newStatus, order: updatedOrder, telegram_status });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
}
