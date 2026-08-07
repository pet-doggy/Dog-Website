import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useShop } from '@/store/ShopContext';
import { Link } from 'wouter';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import CheckoutModal from '@/components/checkout/CheckoutModal';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const shipping = 99;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-serif mb-12">Your Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border border-dashed">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Begin building your companion's wellness regimen.</p>
              <Link href="/shop" className="inline-flex px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-primary transition-colors">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-8">
                <div className="hidden sm:grid grid-cols-12 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b border-border pb-4">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center py-6 border-b border-border/50 group">
                    <div className="col-span-1 sm:col-span-6 flex gap-4 sm:gap-6">
                      <div className="w-20 h-28 sm:w-24 sm:h-32 bg-card rounded-xl overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link href={`/product/${item.productId}`} className="font-serif text-base sm:text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">Size: {item.size}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] sm:text-xs font-medium text-muted-foreground hover:text-destructive flex items-center gap-1 w-fit uppercase tracking-wider"
                        >
                          <X size={12} /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-3 flex justify-start sm:justify-center mt-2 sm:mt-0">
                      <div className="flex items-center gap-3 border border-border rounded-full px-4 py-2 bg-background">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 sm:col-span-3 text-left sm:text-right font-medium text-base sm:text-lg mt-2 sm:mt-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-3xl p-8 border border-border sticky top-32">
                  <h3 className="font-serif text-2xl mb-6">Summary</h3>
                  
                  <div className="space-y-4 mb-6 text-sm text-muted-foreground font-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-foreground font-medium">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-foreground font-medium">
                        ₹99.00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax</span>
                      <span className="text-foreground font-medium">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-6 mb-8 flex justify-between items-end">
                    <span className="font-serif text-lg">Total</span>
                    <span className="text-2xl font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl shadow-primary/20 mb-4"
                  >
                    Secure Checkout <ArrowRight size={18} />
                  </button>
                  
                  <div className="text-center text-xs text-muted-foreground">
                    <p>Veterinary vetted. 30-day biological response guarantee.</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />

      {cart.length > 0 && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          product={{ id: cart[0].productId, name: cart[0].name }}
          variant={{ id: cart[0].variantId, weight: cart[0].size, price: cart[0].price, image: cart[0].image }}
          quantity={cart[0].quantity}
          totalPrice={cartTotal}
        />
      )}
    </div>
  );
}
