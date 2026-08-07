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

    const {
      customerName, phone, address, city, state, pinCode,
      productId, variantId, quantity, productName, variantName, amount, addOnsText, protocolTier
    } = req.body;

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
       throw new Error('Cashfree credentials are not configured on the server.');
    }

    // 1. Create order record
    const orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    
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
        price_at_time: Math.max(0, Math.round((amount - 99) / quantity))
      });

    if (itemError) console.error("Item insert error:", itemError);

    // 3. Call Cashfree API
    const baseUrl = CASHFREE_ENVIRONMENT === "PRODUCTION" 
      ? "https://api.cashfree.com/pg" 
      : "https://sandbox.cashfree.com/pg";

    const cashfreeRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CASHFREE_APP_ID || '',
        'x-client-secret': CASHFREE_SECRET_KEY || '',
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
        },
        order_meta: {
          return_url: `${(req.headers.origin || 'https://localhost:5173').replace('http://', 'https://')}/payment-status?order_id={order_id}`
        },
        order_tags: {
          addons: (addOnsText || "None").substring(0, 250),
          protocol: (protocolTier || "None").substring(0, 250)
        }
      }),
    });

    const cashfreeData = await cashfreeRes.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Cashfree Order Response:", JSON.stringify(cashfreeData, null, 2));
    }

    if (!cashfreeRes.ok) {
      throw new Error(`Cashfree Error: ${cashfreeData.message || 'Failed to create order'}`);
    }

    if (!cashfreeData.payment_session_id) {
      throw new Error("Cashfree did not return a payment_session_id");
    }

    // Update order with cashfree_order_id
    await supabase.from('orders').update({ cashfree_order_id: orderNumber }).eq('id', order.id);

    // 4. Return session ID directly (NO checkout_url generated manually)
    return res.status(200).json({
      payment_session_id: cashfreeData.payment_session_id,
      cf_order_id: cashfreeData.cf_order_id,
      order_id: cashfreeData.order_id
    });
  } catch (err: any) {
    console.error('Checkout Intent Error:', err);
    return res.status(400).json({ error: err.message });
  }
}
