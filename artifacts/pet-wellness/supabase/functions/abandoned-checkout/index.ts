import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
      customerName, phone, productId, variantId, quantity, productName, variantName
    } = await req.json();

    if (!customerName || !phone) {
      throw new Error("Missing required fields");
    }

    // 1. Save to database
    const { error: dbError } = await supabase
      .from('abandoned_carts')
      .insert({
        customer_name: customerName,
        phone: phone,
        product_id: productId,
        variant_id: variantId,
        quantity: quantity || 1,
        status: 'abandoned'
      });

    if (dbError) console.error("Error saving abandoned cart to DB:", dbError);

    // 2. Send Telegram Notification
    const message = `⚠️ *Abandoned Checkout*\n\n` +
      `👤 *Name:* ${customerName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📦 *Product:* ${productName || 'Unknown'} (${variantName || 'N/A'})\n` +
      `🔢 *Quantity:* ${quantity || 1}\n` +
      `⏱️ *Time:* ${new Date().toISOString()}`;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      
      if (!tgRes.ok) {
         console.error("Failed to send telegram notification", await tgRes.text());
      }
    }

    // 3. Send Warecover Webhook
    try {
      const warecoverPayload = {
        event: "abandoned_cart",
        customer: {
          name: customerName || "",
          phone: phone || "",
          email: ""
        },
        order: {
          order_id: "", // Usually no order ID yet for abandoned checkout
          total_amount: "0",
          currency: "INR",
          items: [
            {
              name: productName || "Unknown Product",
              quantity: quantity || 1,
              price: "0"
            }
          ]
        },
        shipping_address: {
          address: "",
          city: "",
          state: "",
          pincode: ""
        }
      };

      const warecoverRes = await fetch(Deno.env.get("WARECOVER_WEBHOOK_URL")!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("WARECOVER_AUTH_TOKEN")!}`
        },
        body: JSON.stringify(warecoverPayload)
      });

      if (!warecoverRes.ok) {
        console.error("Warecover API Error:", await warecoverRes.text());
      }
    } catch (e) {
      console.error("Warecover notification error:", e);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
