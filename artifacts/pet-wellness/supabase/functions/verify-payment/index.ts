import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
const CASHFREE_ENVIRONMENT = "PRODUCTION"; // or SANDBOX
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { order_id } = await req.json();
    
    if (!order_id) {
       throw new Error("Missing order_id");
    }

    // 1. Verify with Cashfree
    const baseUrl = CASHFREE_ENVIRONMENT === "PRODUCTION" 
      ? "https://api.cashfree.com/pg" 
      : "https://sandbox.cashfree.com/pg";

    const cashfreeRes = await fetch(`${baseUrl}/orders/${order_id}`, {
      method: 'GET',
      headers: {
        'x-client-id': CASHFREE_APP_ID!,
        'x-client-secret': CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01',
      },
    });

    const cashfreeData = await cashfreeRes.json();

    if (!cashfreeRes.ok) {
      throw new Error(cashfreeData.message || 'Failed to fetch Cashfree order status');
    }

    const paymentStatus = cashfreeData.order_status; // Usually "PAID", "ACTIVE", etc.
    const isPaid = paymentStatus === 'PAID';

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

    // 3. Send Telegram Notification if successful
    let telegram_status = 'not_attempted';
    if (isPaid && updatedOrder && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      
      const escapeHtml = (unsafe: any) => {
        if (!unsafe) return '';
        return String(unsafe).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      };

      const itemsText = updatedOrder.order_items?.map((item: any) => 
        `- ${escapeHtml(item.products?.name)} (${escapeHtml(item.product_variants?.weight || item.product_variants?.size)}) x ${item.quantity}`
      ).join('\n') || 'Unknown Items';

      const message = `✅ <b>Successful Payment</b>\n\n` +
        `🆔 <b>Order ID:</b> ${escapeHtml(updatedOrder.order_number)}\n` +
        `👤 <b>Name:</b> ${escapeHtml(updatedOrder.customer_name)}\n` +
        `📞 <b>Phone:</b> ${escapeHtml(updatedOrder.phone)}\n` +
        `🏠 <b>Address:</b> ${escapeHtml(updatedOrder.address)}, ${escapeHtml(updatedOrder.city)}, ${escapeHtml(updatedOrder.state)} - ${escapeHtml(updatedOrder.pin_code)}\n` +
        `📦 <b>Products:</b>\n${itemsText}\n` +
        `💰 <b>Amount Paid:</b> ₹${updatedOrder.total_amount}\n` +
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

    return new Response(
      JSON.stringify({ success: true, payment_status: newStatus, order: updatedOrder, telegram_status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
