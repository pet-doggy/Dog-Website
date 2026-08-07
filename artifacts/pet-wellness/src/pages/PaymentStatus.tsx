import React, { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'wouter';
import { trackMetaEvent } from '@/lib/metaTracking';

export default function PaymentStatus() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const orderId = searchParams.get('order_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'invalid'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!orderId) {
      setStatus('invalid');
      return;
    }

    const verifyOrder = async () => {
      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ order_id: orderId })
        });
        const data = await res.json();
        
        if (res.ok && data.success && (data.payment_status === 'paid' || data.paymentStatus === 'PAID')) {
          setStatus('success');
          
          // Fire Meta Purchase Event
          // Fetch order amount from backend or somewhere, since PaymentStatus doesn't have it directly. 
          // If amount is missing in data, we just send a generic value or 0, but backend should return order details.
          trackMetaEvent({
            eventName: 'Purchase',
            customData: {
              value: data.orderAmount || 0, // Fallback if backend doesn't return amount
              currency: 'INR',
              order_id: orderId,
            }
          });
        } else {
          setStatus('failed');
          setErrorMsg(data.error || 'Payment could not be verified or was not successful.');
        }
      } catch (err: any) {
        setStatus('failed');
        setErrorMsg(err.message || 'Network error while verifying payment.');
      }
    };

    verifyOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-[140px] pb-24 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center">
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h1 className="text-2xl font-display font-medium text-foreground mb-2">Verifying Payment</h1>
              <p className="text-muted-foreground">Please wait while we confirm your order with the bank...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-display font-medium text-foreground mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-8">Thank you for your purchase. Your order ({orderId}) has been confirmed and is being processed.</p>
              
              <Link href="/">
                <button className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-full hover:bg-primary/90 transition-colors w-full">
                  Return to Home
                </button>
              </Link>
            </div>
          )}

          {status === 'failed' && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-display font-medium text-foreground mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-2">Unfortunately, your payment could not be processed.</p>
              <p className="text-sm text-red-600/80 mb-8 max-w-sm">{errorMsg}</p>
              
              <Link href="/shop">
                <button className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-full hover:bg-primary/90 transition-colors w-full mb-3">
                  Try Again
                </button>
              </Link>
            </div>
          )}

          {status === 'invalid' && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <h1 className="text-2xl font-display font-medium text-foreground mb-2">Invalid Request</h1>
              <p className="text-muted-foreground mb-8">No order ID was found in the request.</p>
              <Link href="/">
                <button className="bg-primary text-primary-foreground font-medium px-8 py-3 rounded-full hover:bg-primary/90 transition-colors w-full">
                  Return to Home
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
