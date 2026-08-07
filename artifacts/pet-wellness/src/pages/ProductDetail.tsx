import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductHeroSkeleton from '@/components/product/ProductHeroSkeleton';
import { useShop } from '@/store/ShopContext';
import { useParams, Link } from 'wouter';
import { useState, useEffect, useMemo } from 'react';
import { useProductBySlug, useProducts } from '@/hooks/useProducts';
import { trackMetaEvent } from '@/lib/metaTracking';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Sections
import ProductHero from '@/components/product/ProductHero';
import FAQSection from '@/components/product/FAQSection';
import DoctorReviews from '@/components/shared/DoctorReviews';

// New Premium Sections
import PremiumIngredients from '@/components/product/PremiumIngredients';
import NutritionProfile from '@/components/product/NutritionProfile';
import PremiumTrustStrip from '@/components/product/PremiumTrustStrip';
import CompleteTheBowl from '@/components/product/CompleteTheBowl';

export default function ProductDetail() {
  const { id: slug } = useParams();
  
  const { data: supabaseProduct, isLoading } = useProductBySlug(slug || '');
  const { data: allProducts } = useProducts();
  
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useShop();
  
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});

  // Map Supabase product to expected UI structure
  const product = useMemo(() => {
    if (!supabaseProduct) return null;
    
    // Convert variants
    const variants = supabaseProduct.variants?.map((v: any) => ({
      id: v.id,
      size: v.weight,
      price: v.selling_price,
      mrp: v.mrp,
      duration_days: v.duration_days,
      label: v.label,
      badge: v.badge,
      savings: v.mrp > v.selling_price ? `${Math.round(((v.mrp - v.selling_price) / v.mrp) * 100)}%` : undefined,
    })) || [];

    // Map images
    const images = supabaseProduct.images
      ?.sort((a: any, b: any) => a.display_order - b.display_order)
      ?.map((img: any) => img.image_url) || [];

    return {
      id: supabaseProduct.id,
      name: supabaseProduct.name,
      slug: supabaseProduct.slug,
      brand: supabaseProduct.brand,
      category: supabaseProduct.category?.name,
      petType: 'Dog', // Assuming all are dogs for now or add to schema later
      price: (supabaseProduct.variants && supabaseProduct.variants.length > 0 && (supabaseProduct.variants.find((v: any) => v.sku === 'default')?.selling_price || variants[0]?.price)) || 0,
      mrp: (supabaseProduct.variants && supabaseProduct.variants.length > 0 && (supabaseProduct.variants.find((v: any) => v.sku === 'default')?.mrp || variants[0]?.mrp)) || 0,
      bundle2Price: supabaseProduct.variants?.find((v: any) => v.sku === 'bundle2')?.selling_price,
      bundle3Price: supabaseProduct.variants?.find((v: any) => v.sku === 'bundle3')?.selling_price,
      rating: supabaseProduct.overall_rating || 5.0, // Default or compute from reviews
      reviewCount: supabaseProduct.total_reviews_count || supabaseProduct.reviews?.length || 0,
      images,
      badges: supabaseProduct.badges || [],
      description: supabaseProduct.short_description || '',
      richDescription: supabaseProduct.rich_description || '',
      variants,
      ingredientsList: supabaseProduct.ingredients?.map((i: any) => ({
        id: i.id,
        name: i.name,
        description: i.description || '',
        image_url: i.image_url || ''
      })) || [],
      ingredients: {
        list: supabaseProduct.ingredients?.map((i: any) => i.name) || [],
        description: supabaseProduct.ingredients?.[0]?.description || ''
      },
      nutritionFacts: supabaseProduct.nutrition?.map((n: any) => ({
        name: n.nutrient,
        value: n.value
      })) || [],
      nutrition: supabaseProduct.nutrition || [],
      benefits: supabaseProduct.benefits?.map((b: any) => ({
        title: b.title,
        description: b.description || ''
      })) || [],
      feedingGuide: supabaseProduct.feeding_guides?.map((f: any) => ({
        weight: f.pet_weight,
        amount: f.daily_quantity
      })) || [],
      faqs: supabaseProduct.faqs?.map((f: any) => ({
        id: f.id || String(Math.random()),
        question: f.question,
        answer: f.answer
      })) || [],
      reviews: supabaseProduct.reviews || [],
      relatedProductIds: allProducts?.filter(p => p.category?.name === supabaseProduct.category?.name && p.id !== supabaseProduct.id).slice(0, 3).map(p => p.id) || []
    };
  }, [supabaseProduct, allProducts]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setSelectedVariant(product.variants[0]);
      window.scrollTo(0, 0);

      trackMetaEvent({
        eventName: 'ViewContent',
        customData: {
          content_ids: [product.id],
          content_type: 'product',
          content_name: product.name,
          value: product.price,
          currency: 'INR'
        }
      });
    }
  }, [product?.id]);
  
  // Memoize related products
  const related = useMemo(() => {
    if (!product || !product.relatedProductIds || !allProducts) return [];
    return product.relatedProductIds
      .map(relId => allProducts.find(p => p.id === relId))
      .filter((p): p is any => p !== undefined)
      .map(p => ({
        ...p,
        price: p.variants?.[0]?.selling_price || 0,
        mrp: p.variants?.[0]?.mrp || 0,
        image: p.images?.[0]?.image_url || ''
      }));
  }, [product, allProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow pt-20">
          <ProductHeroSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-4">Product Not Found</h1>
            <Link href="/shop" className="text-primary hover:underline underline-offset-4">Return to Collection</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant && product.variants.length > 0) return;
    
    let finalPrice = selectedVariant?.price || product.price;
    if (quantity === 2) finalPrice = finalPrice * 0.85;
    if (quantity >= 3) finalPrice = finalPrice * 0.75;

    addToCart({
      id: `${product.id}-${selectedVariant?.id || 'default'}`,
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      image: product.images[0] || '',
      price: finalPrice,
      quantity,
      size: selectedVariant?.size || 'Standard'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F2]">
      <Navbar />
      <CartDrawer />

      <main className="flex-grow pt-36 pb-0">

        <ProductHero 
          product={product as any} 
          selectedVariant={selectedVariant!} 
          quantity={quantity}
          onVariantChange={setSelectedVariant}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          isWishlisted={isInWishlist(product.id)}
          onToggleWishlist={() => toggleWishlist(product.id)}
          selectedAddOns={selectedAddOns}
          relatedProducts={related}
        />

        {/* --- NEW PRODUCT PAGE LAYOUT --- */}

        {/* 1. Ingredients */}
        <PremiumIngredients ingredients={product.ingredientsList} />

        {/* 2. FAQ */}
        <FAQSection faqs={product.faqs || []} />

        {/* 3. Nutrition Profile */}
        <NutritionProfile nutrition={product.nutrition} />

        {/* 4. Trust Section (Flat Shipping, etc) */}
        <PremiumTrustStrip />

        {/* 5. Complete the Bowl */}
        <CompleteTheBowl 
          products={related} 
          selectedItems={selectedAddOns}
          onUpdateItems={setSelectedAddOns}
        />
        
        {/* 5.5 Product Description Accordion */}
        {product.richDescription && (
          <section className="py-8 bg-[#F7F5F2]">
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
              <div className="border border-border/50 rounded-2xl overflow-hidden bg-white">
                <button
                  className="w-full flex items-center justify-center p-6 relative hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                >
                  <span className="font-medium text-lg">Product Description</span>
                  <div className="absolute right-6">
                    {isDescriptionOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isDescriptionOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white"
                    >
                      <div 
                        className="p-6 pt-0 text-gray-700 text-sm leading-relaxed prose prose-sm md:prose-base max-w-none text-left break-words overflow-wrap-anywhere whitespace-normal [&>h1]:text-2xl [&>h1]:font-serif [&>h1]:mb-4 [&>h1]:text-[#12333B] [&>h2]:text-xl [&>h2]:font-serif [&>h2]:mb-3 [&>h2]:mt-6 [&>h2]:text-[#12333B] [&>p]:mb-4 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-4"
                        dangerouslySetInnerHTML={{ __html: product.richDescription }} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>
        )}

        {/* 6. Customer Testimonials (Reused) */}
        <DoctorReviews />
        
      </main>
      <Footer />
    </div>
  );
}
