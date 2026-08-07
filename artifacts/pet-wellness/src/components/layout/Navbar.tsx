import { Link, useLocation } from 'wouter';
import { useShop } from '@/store/ShopContext';
import { ShoppingBag, Heart, Search, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { trackMetaEvent } from '@/lib/metaTracking';
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, setIsCartDrawerOpen } = useShop();
  const [location, setLocation] = useLocation();
  const { data: products } = useProducts();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[80px] flex items-center ${
          isScrolled || location !== '/' 
            ? 'bg-background border-b border-border/50 shadow-sm' 
            : 'bg-background border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Left Side (Logo + Nav) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Ancestral Essence" className="w-[100px] lg:w-[120px] 2xl:w-[140px] h-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-foreground/80">
              <Link href="/shop" className="hover:text-foreground transition-colors relative group">
                Shop
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/shop" className="hover:text-foreground transition-colors relative group">
                Category
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>

          {/* Icons - Right */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
            <button 
              className="text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Removed Account icon as requested */}
            <button 
              className="text-foreground/80 hover:text-foreground transition-colors relative"
              onClick={() => setIsCartDrawerOpen(true)}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[60] flex flex-col items-center pt-32 px-4"
          >
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-muted-foreground hover:text-foreground"
            >
              <X size={32} strokeWidth={1} />
            </button>
            <div className="w-full max-w-2xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchOpen(false);
                  
                  trackMetaEvent({
                    eventName: 'Search',
                    customData: { search_string: searchQuery }
                  });
                  
                  setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
                }}
                className="relative"
              >
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-foreground/20 text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-serif py-4 focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground/30"
                  autoFocus
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground hover:text-primary transition-colors">
                  <Search size={32} strokeWidth={1.5} />
                </button>
              </form>
              <div className="mt-12 text-center">
                <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Recommendations</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {products?.slice(0, 5).map(product => (
                    <button 
                      key={product.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setLocation(`/product/${product.slug}`);
                      }}
                      className="px-6 py-2 rounded-full border border-border hover:border-foreground transition-colors text-sm"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-background z-[70] p-6 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <img src="/logo.png" alt="Ancestral Essence" className="w-[80px] h-auto object-contain" />
                <button onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-6 text-xl font-serif">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Category</Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
