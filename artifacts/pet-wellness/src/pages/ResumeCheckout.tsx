import { useParams } from 'wouter';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { Loader2 } from 'lucide-react';

export default function ResumeCheckout() {
  const { cartId } = useParams();
  const [cartData, setCartData] = useState<any>(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetch(`/api/get-abandoned-cart?cartId=${cartId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          setError(d.error);
        } else {
          setCartData(d.cart);
          
          // Pre-fill local storage so CheckoutModal sees it
          try {
            const saved = localStorage.getItem('ancestral_checkout_data');
            const parsed = saved ? JSON.parse(saved) : {};
            parsed.fullName = d.cart.customer_name || parsed.fullName || '';
            parsed.phone = d.cart.phone || parsed.phone || '';
            localStorage.setItem('ancestral_checkout_data', JSON.stringify(parsed));
          } catch(e) {}
        }
      })
      .catch(e => setError("Failed to fetch cart."));
  }, [cartId]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center px-4 pt-32">
           <div className="bg-red-50 text-red-600 p-6 rounded-xl">
             <h2 className="text-xl font-bold mb-2">Checkout Error</h2>
             <p>{error}</p>
           </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cartData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32">
          <Loader2 className="animate-spin text-primary w-12 h-12" />
        </div>
      </div>
    );
  }

  // Determine base price and apply 50 rs discount
  const basePrice = cartData.product_variants?.selling_price || 0;
  const discountedPrice = Math.max(0, basePrice - 50);
  const totalDiscountedPrice = discountedPrice * (cartData.quantity || 1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow pt-32 relative">
         <div className="text-center px-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-serif mb-4">Complete Your Order</h1>
            <p className="text-muted-foreground mb-8">
               We've applied a special <b>₹50 discount</b> to your order of {cartData.products?.name}! 
               Please provide your delivery address to proceed.
            </p>
         </div>

         <div className="pointer-events-none opacity-50 absolute inset-0 z-0 bg-black/5" />
         
         {/* We keep isOpen=true so it displays immediately */}
         <CheckoutModal 
            isOpen={true} 
            onClose={() => window.location.href = '/shop'} 
            product={cartData.products || { id: cartData.product_id, name: 'Product' }}
            variant={cartData.product_variants || { id: cartData.variant_id, price: basePrice }}
            quantity={cartData.quantity || 1}
            totalPrice={totalDiscountedPrice} 
         />
      </div>
    </div>
  );
}
