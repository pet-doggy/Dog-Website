import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cartId } = req.query;

  if (!cartId) {
    return res.status(400).json({ error: 'Missing cartId' });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
    );

    const { data: cart, error } = await supabase
      .from('abandoned_carts')
      .select('*, products(*), product_variants(*)')
      .eq('id', cartId)
      .single();

    if (error) {
      console.error("Error fetching abandoned cart:", error);
      return res.status(404).json({ error: 'Cart not found' });
    }

    return res.status(200).json({ cart });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
