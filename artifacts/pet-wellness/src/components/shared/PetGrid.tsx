import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function PetGrid() {
  // Array of image paths, skipping duplicates
  const petImages = [1, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18].map(i => `/pet/${i}.png`);
  
  return (
    <section className="py-8 bg-[#F7F5F2] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mb-4">
        <h2 className="text-sm md:text-base font-bold tracking-widest uppercase text-foreground">WHAT PET'S DID GRID</h2>
      </div>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView="auto"
        loop={true}
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        className="swiper-continuous !overflow-visible"
      >
        {petImages.map((src, index) => (
          <SwiperSlide key={index} className="!w-[150px] md:!w-[200px] lg:!w-[220px]">
            <div className="rounded-xl overflow-hidden aspect-square border-2 border-[#1C1C1C]">
              <img src={src} alt={`Pet ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
