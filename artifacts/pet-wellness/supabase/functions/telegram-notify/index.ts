import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    const { type, payload } = await req.json();

    let text = '';
    
    if (type === 'abandoned_cart') {
      text = `🚨 *Abandoned Cart Alert* 🚨\n\n*Name:* ${payload.name}\n*Phone:* ${payload.phone}\n*Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
    } else if (type === 'new_order') {
      text = `🛒 *New Order Received!* 🛒\n\n*Order ID:* ${payload.orderId}\n*Name:* ${payload.name}\n*Phone:* ${payload.phone}\n*City:* ${payload.city}\n*Amount:* ₹${payload.amount}\n*Payment:* ${payload.paymentStatus}`;
    }

    if (!text) {
      throw new Error('Invalid notification type');
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.description);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
