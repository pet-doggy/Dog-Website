import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
// @ts-ignore
import { load } from '@cashfreepayments/cashfree-js';
import { trackMetaEvent } from '@/lib/metaTracking';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  variant: any;
  quantity: number;
  totalPrice?: number;
  selectedAddOns?: Record<string, number>;
  relatedProducts?: any[];
  protocolTier?: string;
}

export default function CheckoutModal({ isOpen, onClose, product, variant, quantity, totalPrice, selectedAddOns = {}, relatedProducts = [], protocolTier }: CheckoutModalProps) {
  const calculatedTotal = totalPrice !== undefined ? totalPrice : (variant?.price || 0) * quantity;
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('ancestral_checkout_data');
      return saved ? JSON.parse(saved) : {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
      };
    } catch {
      return {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
      };
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showExitWarning, setShowExitWarning] = useState(false);
  const showExitWarningRef = useRef(showExitWarning);
  const cashfreeRef = useRef<any>(null);
  
  useEffect(() => {
    showExitWarningRef.current = showExitWarning;
  }, [showExitWarning]);
  
  useEffect(() => {
    // Preload Cashfree SDK
    if (isOpen && !cashfreeRef.current) {
      load({ mode: 'production' }).then((cf: any) => {
        cashfreeRef.current = cf;
      }).catch(console.error);
    }
  }, [isOpen]);
  
  const hasTrackedAbandonment = useRef(false);

  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
    localStorage.setItem('ancestral_checkout_data', JSON.stringify(formData));
  }, [formData]);


  // Track abandonment
  useEffect(() => {
    if (isOpen) {
      // Fire InitiateCheckout Event
      trackMetaEvent({
        eventName: 'InitiateCheckout',
        customData: {
          content_ids: product ? [product.id] : [],
          content_name: product?.name,
          value: calculatedTotal,
          currency: 'INR'
        }
      });
      
      setShowExitWarning(false);
      hasTrackedAbandonment.current = false;
      
      const handlePopState = () => {
        const currentData = formDataRef.current;
        if (currentData.fullName.trim() && currentData.phone.length >= 10 && !hasTrackedAbandonment.current) {
          trackAbandonedCheckout(currentData);
        }
        
        if (!showExitWarningRef.current) {
          setShowExitWarning(true);
          window.history.pushState({ checkoutModalOpen: true }, ''); // Push state again to stay in modal
        } else {
          onClose();
        }
      };
      
      window.addEventListener('popstate', handlePopState);
      window.history.pushState({ checkoutModalOpen: true }, '');

      return () => {
        window.removeEventListener('popstate', handlePopState);
        const currentData = formDataRef.current;
        if (!hasTrackedAbandonment.current && currentData.fullName.trim() && currentData.phone.length >= 10) {
          trackAbandonedCheckout(currentData);
        }
      };
    }
    
    return () => {};
  }, [isOpen]);

  const handleClose = () => {
    const currentData = formDataRef.current;
    if (currentData.fullName.trim() && currentData.phone.length >= 10 && !hasTrackedAbandonment.current) {
      trackAbandonedCheckout(currentData);
    }
    
    if (!showExitWarningRef.current) {
      setShowExitWarning(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    hasTrackedAbandonment.current = true;
    setShowExitWarning(false);
    onClose();
  };

  const trackAbandonedCheckout = async (data = formDataRef.current) => {
    try {
      hasTrackedAbandonment.current = true; // Prevent multiple triggers
      
      const addOnsList = Object.entries(selectedAddOns)
        .filter(([_, qty]) => (qty as number) > 0)
        .map(([id, qty]) => {
          const related = relatedProducts.find(p => p.id === id);
          let name = related?.name;
          if (!name) {
            if (id === '1' || id === 'Chicken Crispies Companion Pack') name = 'Chicken Crispies Companion Pack';
            else if (id === '2' || id === 'Gutsense GI Support Topper') name = 'Gutsense GI Support Topper';
            else if (id === '3' || id === 'Omega Boost') name = 'Omega Boost';
          }
          return `${name} x ${qty}`;
        });

      const combinedProductName = addOnsList.length > 0 
        ? `${product?.name} (+ ${addOnsList.join(', ')})`
        : product?.name;
        
      const payload = {
        customerName: data.fullName,
        phone: data.phone,
        productId: product?.id,
        variantId: variant?.id,
        quantity: quantity,
        productName: combinedProductName,
        variantName: variant?.weight,
      };

      // Use sendBeacon for more reliable delivery during page unload/navigation
      const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
      navigator.sendBeacon('/api/abandoned-checkout', blob);
      
    } catch (err) {
      // Silently catch network errors so it doesn't crash the dev server overlay
      console.error("Network error tracking abandoned checkout:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatting validation
    if (name === 'phone' && value && !/^\d*$/.test(value)) return;
    if (name === 'pinCode' && value && !/^\d*$/.test(value)) return;
    if (name === 'phone' && value.length > 10) return;
    if (name === 'pinCode' && value.length > 6) return;

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length !== 10) return 'Valid 10-digit Phone Number is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state.trim()) return 'State is required';
    if (!formData.pinCode.trim() || formData.pinCode.length !== 6) return 'Valid 6-digit PIN Code is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    hasTrackedAbandonment.current = true; // Prevent abandonment tracking

    try {
      const addOnsList = Object.entries(selectedAddOns)
        .filter(([_, qty]) => (qty as number) > 0)
        .map(([id, qty]) => {
          const related = relatedProducts.find(p => p.id === id);
          let name = related?.name;
          if (!name) {
            if (id === '1' || id === 'Chicken Crispies Companion Pack') name = 'Chicken Crispies Companion Pack';
            else if (id === '2' || id === 'Gutsense GI Support Topper') name = 'Gutsense GI Support Topper';
            else if (id === '3' || id === 'Omega Boost') name = 'Omega Boost';
          }
          return `${name} x ${qty}`;
        });

      const combinedProductName = addOnsList.length > 0 
        ? `${product?.name} (+ ${addOnsList.join(', ')})`
        : product?.name;

      // Create checkout intent
      const response = await fetch('/api/checkout-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          productId: product?.id,
          variantId: variant?.id,
          quantity: quantity,
          productName: combinedProductName,
          variantName: variant?.weight,
          amount: calculatedTotal + 99,
          addOnsText: addOnsList.join(', '),
          protocolTier: protocolTier
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initialize checkout');
      
      if (data?.payment_session_id) {
        // Use preloaded SDK if available, otherwise load it
        const cashfree = cashfreeRef.current || await load({ mode: 'production' });

        const checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: '_modal'
        };

        cashfree.checkout(checkoutOptions).then((result: any) => {
          if (result.error) {
            console.error("Cashfree Error:", result.error);
            setError("Payment was cancelled or failed. Please try again.");
          }
          if (result.redirect) {
            // Payment will be redirected
          }
          if (result.paymentDetails) {
            // Payment completed (success or failure)
            window.location.href = `/payment-status?order_id=${data.order_id}`;
          }
        });
      } else {
        throw new Error('Invalid response from payment gateway');
      }

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout. Please try again.');
      hasTrackedAbandonment.current = false; // reset in case they try again
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-[500px] bg-[#F7F5F2] sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {showExitWarning ? (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center bg-white min-h-[400px]">
            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2A3B2C] mb-3">Wait! Don't leave just yet</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You're just one step away from getting your <strong>{product?.name}</strong>. Are you sure you want to cancel your order?
            </p>
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={() => setShowExitWarning(false)} 
                className="w-full bg-[#C69C6D] text-white py-4 rounded-xl font-medium hover:bg-[#b0885c] transition-colors"
              >
                Complete My Order
              </button>
              <button 
                onClick={handleConfirmExit} 
                className="w-full bg-transparent text-gray-500 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/30 flex justify-between items-center bg-white">
              <h2 className="font-serif text-xl text-[#2A3B2C]">Secure Checkout</h2>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-white/50 border-b border-border/20 flex flex-col gap-3">
          <div className="flex gap-4 items-center">
            {variant?.image && (
              <div className="w-16 h-16 rounded bg-white p-1 border border-border/30 shrink-0">
                <img src={variant.image} alt={product?.name} className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium text-sm text-foreground/90">{product?.name}</h3>
              <p className="text-xs text-muted-foreground">{variant?.weight} × {quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground/90">₹{(variant?.price || 0) * quantity}</p>
            </div>
          </div>

          {Object.entries(selectedAddOns).map(([id, qty]) => {
            const related = relatedProducts.find(p => p.id === id);
            let name = related?.name;
            let price = related?.price;
            
            if (!name) {
              if (id === '1' || id === 'Chicken Crispies Companion Pack') { name = 'Chicken Crispies Companion Pack'; price = 399; }
              else if (id === '2' || id === 'Gutsense GI Support Topper') { name = 'Gutsense GI Support Topper'; price = 1450; }
              else if (id === '3' || id === 'Omega Boost') { name = 'Omega Boost'; price = 660; }
            }
            
            if (!name || !price || qty === 0) return null;
            
            return (
              <div key={id} className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded bg-white p-1 border border-border/30 shrink-0 flex items-center justify-center">
                  {related?.image ? (
                    <img src={related.image} alt={name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-muted-foreground text-center">Add-on</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-foreground/90">{name}</h3>
                  <p className="text-xs text-muted-foreground">Qty: {qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground/90">₹{price * qty}</p>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-between items-center text-sm pt-2 border-t border-border/10">
            <span className="text-muted-foreground">Per Day Cost</span>
            <span className="font-medium text-muted-foreground">₹{Math.round(calculatedTotal / (quantity * 30))}/day</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-1">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-foreground">₹99</span>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold pt-1">
            <span>Total</span>
            <span>₹{calculatedTotal + 99}</span>
          </div>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-6">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name *</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E38B2C]/50 transition-all text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9999999999"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E38B2C]/50 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Address *</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Flat No., Building Name, Street"
                className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E38B2C]/50 transition-all text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">City *</label>
                <input 
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E38B2C]/50 transition-all text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PIN Code *</label>
                <input 
                  type="text" 
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E38B2C]/50 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">State *</label>
              <select 
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E38B2C]/50 transition-all text-sm appearance-none"
                required
              >
                <option value="" disabled>Select State</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-border/30">
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full bg-[#E38B2C] hover:bg-[#b58c36] text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#B89D5D]/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${calculatedTotal}`
            )}
          </button>
          <p className="text-center text-[11px] text-muted-foreground mt-4 flex items-center justify-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            100% Secure Payments by Cashfree
          </p>
        </div>

          </>
        )}
      </div>
    </div>
  );
}
