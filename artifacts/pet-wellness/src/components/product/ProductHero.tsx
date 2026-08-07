import React, { useState } from 'react';
import { Product, ProductVariant } from '@/data/products';
import { Star, ShieldCheck, Truck, Plus, Minus, Heart, ChevronUp, ChevronDown } from 'lucide-react';
import CheckoutModal from '../checkout/CheckoutModal';
import PremiumPricing from './PremiumPricing';
import { supabase } from '@/lib/supabase';
import { useProductCalculator } from '@/hooks/useProductCalculator';
import { PRODUCT_REGISTRY } from '@/lib/productRegistry';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  onVariantChange: (variant: ProductVariant) => void;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  selectedAddOns?: Record<string, number>;
  relatedProducts?: any[];
}

export default function ProductHero({ product, selectedVariant, quantity, onVariantChange, onQuantityChange, onAddToCart, isWishlisted, onToggleWishlist, selectedAddOns = {}, relatedProducts = [] }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomState, setZoomState] = useState({ isZooming: false, x: 0, y: 0 });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTier, setActiveTier] = useState('');
  const [timeLeft, setTimeLeft] = React.useState({ minutes: 25, seconds: 30 });
  const [quantityOptions, setQuantityOptions] = useState<any[]>([
    { label: 'Small', subLabel: 'Up to 10kg', packs: 1 },
    { label: 'Medium', subLabel: '10-25kg', packs: 2 },
    { label: 'Large', subLabel: '25kg+', packs: 3, recommended: true }
  ]);

  React.useEffect(() => {
    const fetchQuantities = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', [`product_quantities_${product.id}`, 'product_quantities']);
        
        if (data && data.length > 0) {
          // Priority to product specific setting, then global
          const productSpecific = data.find(d => d.key === `product_quantities_${product.id}`);
          const globalSpecific = data.find(d => d.key === 'product_quantities');
          
          const selectedData = productSpecific || globalSpecific;
          if (selectedData?.value && Array.isArray(selectedData.value) && selectedData.value.length > 0) {
            setQuantityOptions(selectedData.value);
          }
        }
      } catch (err) {
        console.error('Failed to fetch quantity options:', err);
      }
    };
    fetchQuantities();
  }, [product.id]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomState({ isZooming: true, x, y });
  };

  const handleMouseLeave = () => {
    setZoomState({ isZooming: false, x: 0, y: 0 });
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const basePrice = selectedVariant?.price || product.price;

  const PRODUCT_ID_MAP: Record<string, string> = {
    "meal-base": "mealBase",
    "meal base": "mealBase",
    "harmony": "harmony",
    "gut-sense": "gutSense",
    "gut sense": "gutSense",
    "chicken-crispies": "chickenCrispies",
    "chicken crispies": "chickenCrispies",
    "sour-loops": "sourLoops",
    "sour loops": "sourLoops",
    "chicken crispies companion pack": "chickenCrispies",
    "gutsense gi support topper": "gutSense",
  };
  
  const getMappedId = (slug?: string, name?: string) => {
    if (slug && PRODUCT_ID_MAP[slug.toLowerCase()]) return PRODUCT_ID_MAP[slug.toLowerCase()];
    if (name && PRODUCT_ID_MAP[name.toLowerCase()]) return PRODUCT_ID_MAP[name.toLowerCase()];
    return null; // Let the hook fail safely
  };

  const currentProductId = getMappedId(product.slug, product.name) || product.id;
  
  const mainProduct = PRODUCT_REGISTRY[currentProductId];

  const mappedAddOnIds = Object.keys(selectedAddOns)
    .filter(id => selectedAddOns[id] > 0)
    .map(id => {
      const related = relatedProducts.find(p => p.id === id);
      const searchName = related ? related.name : id === '1' ? 'Chicken Crispies Companion Pack' : id === '2' ? 'Gutsense GI Support Topper' : id;
      return getMappedId(undefined, searchName) || id;
    });

  const calculator = useProductCalculator(currentProductId, activeTier, mappedAddOnIds, quantity);

  const discountedTotalPrice = calculator ? calculator.baseMonthlyCost : Math.round(basePrice * quantity);
  const addOnsTotal = calculator ? calculator.addOnBreakdown.reduce((sum: number, item: any) => sum + item.monthlyCost, 0) : 0;
  const finalCheckoutPrice = calculator ? calculator.grandTotalMonthly : discountedTotalPrice + addOnsTotal;


  return (
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 relative">
        {/* Left: Images */}
        <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto lg:max-w-none">
          <div className="flex gap-4 w-full">
            {/* Vertical Thumbnails */}
            {product.images.length > 1 && (
              <div className="hidden md:flex flex-col items-center gap-3 w-20 flex-shrink-0">
                <button onClick={prevImage} className="w-8 h-8 flex items-center justify-center bg-[#F7F5F2] hover:bg-[#EFECE5] rounded-full transition-colors">
                  <ChevronUp size={16} className="text-foreground/70" />
                </button>
                <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-3 py-1">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button onClick={nextImage} className="w-8 h-8 flex items-center justify-center bg-[#F7F5F2] hover:bg-[#EFECE5] rounded-full transition-colors">
                  <ChevronDown size={16} className="text-foreground/70" />
                </button>
              </div>
            )}

            {/* Main Image */}
            <div 
              className="flex-1 aspect-square rounded-[32px] overflow-hidden flex items-center justify-center relative cursor-crosshair bg-transparent"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseMove}
            >
              <img 
                src={product.images[activeImage] || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80'} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-opacity duration-200 ${zoomState.isZooming ? 'opacity-0' : 'opacity-100'}`}
              />
              {/* Zoom Overlay */}
              {zoomState.isZooming && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.images[activeImage] || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80'})`,
                    backgroundPosition: `${zoomState.x}% ${zoomState.y}%`,
                    backgroundSize: '200%',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Mobile Horizontal Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 py-2 w-full">
              {product.images.map((img, idx) => (
                <button 
                  key={`mob-thumb-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-20 snap-center rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Recommended Protocol */}
          <div className="mt-2 md:mt-4">
            <div className="flex items-center gap-1.5 mb-3">
              <label className="text-[13px] md:text-sm font-semibold text-foreground/90">
                Recommended monthly protocol
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
              {mainProduct && Object.entries(mainProduct.tiers)
                .filter(([key]) => key !== 'xlarge')
                .sort(([a], [b]) => a === 'cat' ? 1 : b === 'cat' ? -1 : 0)
                .map(([key, tier]: [string, any]) => {
                const isSelected = activeTier === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTier(key)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all relative ${
                      isSelected 
                        ? 'bg-[#4A4A4A] border-[#4A4A4A] text-white shadow-md' 
                        : 'bg-white border-border/50 text-foreground/80 hover:border-[#4A4A4A]/30'
                    }`}
                  >
                    <span className={`text-[11px] md:text-sm font-medium leading-tight mb-1 ${isSelected ? 'text-white/90' : 'text-foreground/80'}`}>
                      {tier.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="relative">
          <div className="lg:sticky lg:top-[120px] lg:pb-24 pt-4 lg:pt-0">
            {/* 1. Product Name */}
            <h1 className="text-3xl md:text-[40px] font-serif mb-4 leading-tight text-foreground/90">{product.name}</h1>
            
            {/* 2. Rating + Reviews */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-[#EFA717]">
                <Star size={16} fill="currentColor" strokeWidth={1} />
                <span className="text-foreground font-semibold ml-1.5 text-sm">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground underline underline-offset-2 cursor-pointer">
                {product.reviewCount} Reviews
              </span>
            </div>






            {/* 5. Countdown Timer */}
            <div className="mb-6">
              <div className="bg-[#EFECE5] text-[#12333B] rounded-xl p-3 flex flex-col items-center justify-center shadow-sm border border-border/50">
                <div className="font-semibold text-sm md:text-base mb-0.5 flex items-center gap-1.5">
                  <span role="img" aria-label="fire">🔥</span> Hurry up! <span role="img" aria-label="fire">🔥</span>
                </div>
                <div className="text-[9px] md:text-[10px] text-[#12333B]/70 mb-2 uppercase tracking-widest font-semibold">Sale ends in:</div>
                <div className="flex items-start gap-2 md:gap-4 text-2xl md:text-3xl font-bold tracking-widest" style={{ fontFamily: 'system-ui, monospace' }}>
                  <div className="flex flex-col items-center">
                    <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[9px] uppercase font-sans tracking-widest text-[#12333B]/60 mt-1 font-bold">Mins</span>
                  </div>
                  <span className="text-[#12333B]/40 -mt-0.5">:</span>
                  <div className="flex flex-col items-center">
                    <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[8px] md:text-[9px] uppercase font-sans tracking-widest text-[#12333B]/60 mt-1 font-bold">Secs</span>
                  </div>
                </div>
              </div>
            </div>



            {/* Quantity Selector */}
            <div className="mb-8 text-center flex flex-col items-center justify-center">
              <label className="block text-[13px] md:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Quantity
              </label>
              <div className="relative inline-block">
                <select 
                  value={quantity}
                  onChange={(e) => onQuantityChange(Number(e.target.value))}
                  className="appearance-none bg-white border border-[#12333B]/20 rounded-full pl-6 pr-12 py-2.5 text-base md:text-lg font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#12333B]/30 focus:border-[#12333B]/50 transition-all cursor-pointer shadow-sm min-w-[140px] text-center"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
              </div>
            </div>

            {/* Premium Pricing Breakdown */}
            <PremiumPricing 
              quantity={calculator ? calculator.basePacksRequired : quantity}
              finalPayablePrice={discountedTotalPrice}
              baseMrp={selectedVariant?.mrp || Math.round(basePrice * 1.4)}
              orderSummaryItems={product.order_summary_items || []}
              daysPerUnit={selectedVariant?.duration_days || 30}
              badgeText={selectedVariant?.badge}
              calculator={calculator}
            />

            {calculator && mainProduct && (
              <div className="bg-white border border-border/60 rounded-2xl p-5 mb-8 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{mainProduct.name} ({mainProduct.tiers[activeTier].label})</h3>
                <p className="text-foreground/80 text-sm mb-1">
                  Mix {calculator.baseDailyGrams}g of {mainProduct.name} with {' '}
                  {calculator.baseDailyGrams * mainProduct.bloomRatio}ml water to make {' '}
                  {calculator.baseRehydratedMl}g prepared food.
                </p>
                <small className="text-muted-foreground text-xs">
                  For every 1g of {mainProduct.name}, add {mainProduct.bloomRatio}ml water.
                </small>

                {calculator.addOnBreakdown.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <h4 className="font-semibold text-sm mb-2">Selected Add-ons</h4>
                    <div className="space-y-3">
                      {calculator.addOnBreakdown.map((item: any) => {
                        const addOnConfig = PRODUCT_REGISTRY[item.id];
                        const addOnTierData = addOnConfig.tiers[activeTier];
                        const addOnRehydratedGrams =
                          addOnTierData.dailyGrams * (1 + addOnConfig.bloomRatio);

                        return (
                          <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                            <strong className="block text-sm text-foreground">{item.name}</strong>
                            <p className="text-foreground/80 text-xs mt-1">
                              Mix {addOnTierData.dailyGrams}g of {item.name} with {' '}
                              {addOnTierData.dailyGrams * addOnConfig.bloomRatio}ml water to make {' '}
                              {addOnRehydratedGrams}g prepared food.
                            </p>
                            <small className="text-muted-foreground text-[10px]">
                              For every 1g of {item.name}, add {addOnConfig.bloomRatio}ml water.
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="font-semibold text-sm mb-1">Total Daily Preparation</h4>
                  <p className="text-[#12333B] font-medium text-sm">
                    Total daily prep: {
                      calculator.baseDailyGrams +
                      calculator.addOnBreakdown.reduce(
                        (sum: number, item: any) => sum + PRODUCT_REGISTRY[item.id].tiers[activeTier].dailyGrams,
                        0
                      )
                    }g product + {' '}
                    {
                      (calculator.baseDailyGrams * mainProduct.bloomRatio) +
                      calculator.addOnBreakdown.reduce(
                        (sum: number, item: any) =>
                          sum +
                          (PRODUCT_REGISTRY[item.id].tiers[activeTier].dailyGrams *
                            PRODUCT_REGISTRY[item.id].bloomRatio),
                        0
                      )
                    }ml water = {calculator.combinedBowlVolumeMl}g prepared food.
                  </p>
                </div>
              </div>
            )}




            {/* 7. Desktop CTAs (Buy Now) */}
            <div className="hidden lg:flex gap-3 mb-3">
              <button 
                onClick={() => {
                  if (!activeTier && mainProduct) {
                    toast('Please select a Recommended Monthly Protocol before proceeding.', {
                      icon: '🐾',
                      style: {
                        borderRadius: '12px',
                        background: '#12333B',
                        color: '#fff',
                        fontWeight: '500'
                      },
                    });
                    return;
                  }
                  setIsCheckoutOpen(true);
                }}
                className="flex-1 bg-[#E38B2C] text-white h-14 rounded-full font-medium text-lg hover:bg-[#C77722] transition-colors shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* 9. Trust Badges */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="flex items-center text-sm font-medium text-foreground/80">
                <img src="/Secure Checkout.png" alt="Secure Checkout" className="w-[18px] h-[18px] mr-2 object-contain" /> Secure Checkout
              </div>
            </div>

            {/* Removed Tags section as requested */}

          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border/50 z-50 lg:hidden flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => {
            if (!activeTier && mainProduct) {
              toast('Please select a Recommended Monthly Protocol before proceeding.', {
                icon: '🐾',
                style: {
                  borderRadius: '12px',
                  background: '#12333B',
                  color: '#fff',
                  fontWeight: '500'
                },
              });
              return;
            }
            setIsCheckoutOpen(true);
          }}
          className="flex-1 bg-[#E38B2C] text-white h-12 rounded-full font-medium"
        >
          Buy Now
        </button>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={product} 
        variant={selectedVariant} 
        quantity={calculator ? calculator.basePacksRequired : quantity} 
        totalPrice={finalCheckoutPrice}
        selectedAddOns={selectedAddOns}
        relatedProducts={relatedProducts}
        protocolTier={activeTier && mainProduct ? mainProduct.tiers[activeTier].label : undefined}
      />
    </div>
  );
}
