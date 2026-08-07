import { useShop } from '@/store/ShopContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useState } from 'react';

export default function CartDrawer() {
  const { isCartDrawerOpen, setIsCartDrawerOpen, cart, updateQuantity, removeFromCart, cartTotal } = useShop();

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartDrawerOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[80]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-[90] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-card">
              <h2 className="text-xl font-serif font-medium flex items-center gap-2">
                <ShoppingBag size={20} />
                Your Cart ({cart.length})
              </h2>
              <button 
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-muted-foreground">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                    <ShoppingBag size={32} className="opacity-50" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-foreground">Your cart is empty</p>
                    <p className="text-sm max-w-[250px]">Begin building your companion's wellness regimen.</p>
                  </div>
                  <button 
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-primary transition-colors"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden shrink-0 relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover mix-blend-multiply"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/a1a1aa?text=Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-medium text-sm leading-tight text-foreground pr-4">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1 bg-background">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-card border-t border-border space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>₹99.00</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-serif pt-2 border-t border-border">
                    <span>Estimated Total</span>
                    <span>₹{(cartTotal + 99).toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/cart" onClick={() => setIsCartDrawerOpen(false)}>
                  <div className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30">
                    Secure Checkout
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

