import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import DoctorReviews from '@/components/shared/DoctorReviews';
import CustomerReviews from '@/components/shared/CustomerReviews';
import PetGrid from '@/components/shared/PetGrid';

export default function Home() {
  const { data: products, isLoading } = useProducts();
  
  // Ensure we have enough items for a continuous loop (at least 8 items)
  // If there's only 1 product, it repeats it 8 times.
  const marqueeProducts = products && products.length > 0 
    ? (products.length < 8 ? Array(Math.ceil(8 / products.length)).fill(products).flat() : products)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartDrawer />

      <main className="flex-grow pt-[140px] pb-12 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        {/* 1. Hero Banner Slider */}
        <section className="relative w-full rounded-[32px] overflow-hidden shadow-xl">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="w-full"
          >
            {[1, 2, 3].map((num) => (
              <SwiperSlide key={`main-banner-${num}`}>
                <img 
                  src={`/main-banner/${num}.png`} 
                  alt={`Hero Banner ${num}`} 
                  className="w-full h-auto block"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 2. Brand Statement */}
        <section className="py-8 md:py-12 mt-8">
          <div className="max-w-4xl mx-auto text-center border-y border-border/50 py-10 bg-[#EFECE5] rounded-xl px-6 flex flex-col justify-center items-center gap-3">
            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground">
              Indian Origin
            </p>
            <img 
              src="/tricolor-heart.png" 
              alt="Tricolor heart"
              className="w-6 h-6 object-contain"
            />
          </div>
        </section>



        <DoctorReviews />

        {/* Stats Image */}
        <section className="py-8 md:py-16 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <img 
              src="/stats.png" 
              alt="Ancestral Essence Stats" 
              className="w-full max-w-7xl mx-auto h-auto object-contain"
            />
          </div>
        </section>

        {/* All Products Infinite Marquee */}
        <section className="py-12 mb-8 overflow-hidden bg-background">
          <div className="max-w-7xl mx-auto px-4 mb-8 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">Explore Our Products</h2>
          </div>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView="auto"
            loop={true}
            speed={5000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="swiper-continuous !overflow-visible px-4"
          >
            {marqueeProducts.length > 0 ? marqueeProducts.map((product: any, index: number) => (
              <SwiperSlide key={`marquee-${product.id}-${index}`} className="!w-[260px] md:!w-[300px]">
                <ProductCard
                  id={product.id}
                  name={product.name || ''}
                  slug={product.slug || ''}
                  category={product.category?.name || ''}
                  price={product.variants?.[0]?.selling_price || 0}
                  mrp={product.variants?.[0]?.mrp || 0}
                  rating={product.overall_rating || 5}
                  reviewsCount={product.total_reviews_count || product.reviews?.length || 0}
                  image={product.images?.[0]?.image_url || ''}
                  badges={product.badges || []}
                />
              </SwiperSlide>
            )) : [1, 2, 3, 4, 5].map(i => (
              <SwiperSlide key={`marquee-ph-${i}`} className="!w-[260px] md:!w-[300px]">
                 <div className="bg-border/20 rounded-2xl animate-pulse aspect-[4/5] w-full"></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>





        {/* 5. Info Cards Slider */}
        <section className="mb-16">
          <div className="bg-[#12333B] rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
             <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 text-white/50 hover:text-white cursor-pointer swiper-prev-btn transition-colors">
               <ChevronLeft size={32} strokeWidth={1} />
             </div>
             <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 text-white/50 hover:text-white cursor-pointer swiper-next-btn transition-colors">
               <ChevronRight size={32} strokeWidth={1} />
             </div>
             
             <Swiper
                modules={[Navigation]}
                navigation={{ prevEl: '.swiper-prev-btn', nextEl: '.swiper-next-btn' }}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="w-full px-8"
              >
                <SwiperSlide>
                  <div className="rounded-2xl overflow-hidden bg-[#F7F5F2] shadow-lg border border-border/10">
                    <img src="/small-banner/1.png" alt="Volumetric Rehydration" className="w-full h-auto object-contain mix-blend-multiply" />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="rounded-2xl overflow-hidden bg-[#F7F5F2] shadow-lg border border-border/10">
                    <img src="/small-banner/3.png" alt="Fresh Sourcing Timeline" className="w-full h-auto object-contain mix-blend-multiply" />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="rounded-2xl overflow-hidden bg-[#F7F5F2] shadow-lg border border-border/10">
                    <img src="/small-banner/2.png" alt="Competitive Analysis" className="w-full h-auto object-contain mix-blend-multiply" />
                  </div>
                </SwiperSlide>
              </Swiper>
          </div>
        </section>

        <PetGrid />

        <CustomerReviews />
      </main>

      <Footer />
    </div>
  );
}

