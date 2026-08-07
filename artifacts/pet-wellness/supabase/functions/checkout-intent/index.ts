import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
const CASHFREE_ENVIRONMENT = "PRODUCTION"; // Using production as per keys
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

    const {
      customerName, phone, address, city, state, pinCode,
      productId, variantId, quantity, productName, variantName, amount
    } = await req.json();

    // 1. Create order record
    const orderNumber = 'ORD-' + Math.floor(Math.random() * 1000000);
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customerName,
        phone,
        address,
        city,
        state,
        pin_code: pinCode,
        total_amount: amount,
        payment_status: 'pending',
        order_status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw new Error(`Order creation failed: ${orderError.message}`);

    // Insert order item
    const { error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: productId,
        variant_id: variantId,
        quantity: quantity,
        price_at_time: amount / quantity
      });

    if (itemError) console.error("Item insert error:", itemError);

    // 2. Send Telegram Notification
    const message = `🚀 *Checkout Started*\n\n` +
      `👤 *Name:* ${customerName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📦 *Product:* ${productName} (${variantName})\n` +
      `🔢 *Quantity:* ${quantity}\n` +
      `🏠 *Address:* ${address}, ${city}, ${state} - ${pinCode}\n` +
      `💰 *Amount:* ₹${amount}\n` +
      `⏱️ *Time:* ${new Date().toISOString()}`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      }).catch(e => console.error("Telegram error:", e));
    }

    // 3. Call Cashfree API
    const baseUrl = CASHFREE_ENVIRONMENT === "PRODUCTION" 
      ? "https://api.cashfree.com/pg" 
      : "https://sandbox.cashfree.com/pg";

    const cashfreeRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID!,
        'x-client-secret': CASHFREE_SECRET_KEY!,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify({
        order_id: orderNumber,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: phone,
          customer_phone: phone,
          customer_name: customerName,
        }
      }),
    });

    const cashfreeData = await cashfreeRes.json();

    if (!cashfreeRes.ok) {
      throw new Error(cashfreeData.message || 'Failed to create Cashfree order');
    }

    // Update order with cashfree_order_id (which is orderNumber, but we can store it to be safe)
    await supabase.from('orders').update({ cashfree_order_id: orderNumber }).eq('id', order.id);

    // 4. Return session ID and payment link
    return new Response(
      JSON.stringify({
        payment_session_id: cashfreeData.payment_session_id,
        checkout_url: cashfreeData.payment_link || (cashfreeData.payment_methods && cashfreeData.payment_methods.app && cashfreeData.payment_methods.app.url) || `https://payments.cashfree.com/forms/${orderNumber}`, // Fallback structure might vary, ideally payment_link exists in PG API
        order_id: orderNumber
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
