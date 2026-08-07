import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const DOCTOR_IMAGES: Record<string, string> = {
  "Dr. Deepak": "/doctors/Dr. Deepak.png",
  "Dr. Omkar Kodange": "/doctors/Dr. Omkar Kodange.png",
  "Dr. Satish Putluru": "/doctors/Dr. Satish Putluru.png",
  "Dr. Shubham Bibekar": "/doctors/Dr. Shubham Bibekar.png"
};

export default function DoctorReviews() {
  return (
    <section className="mb-16 overflow-hidden bg-background">
      <div className="max-w-[1600px] mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground">What Vets Had To Say</h2>
      </div>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView="auto"
        loop={true}
        speed={6000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="swiper-continuous !overflow-visible"
      >
        {[
          { 
            id: 1, 
            title: "What Gut-Microbiome specialist have to say?",
            name: "Dr. Omkar Kodange", 
            credentials: "M.V.Sc (Gynaecology and Obstetrics), N.A.V.C Certified micro-biome specialist",
            review: "Most treats just sit in the gut. Chicken Crispies work with it , the Active Gut-Correction Matrix is real, and so is the protein quality. That matters.", 
            rating: 5,
            product: "Chicken Crispies"
          },
          { 
            id: 2, 
            title: "What Clinician have to say",
            name: "Dr. Shubham Bibekar", 
            credentials: "M.V.Sc (Gynaecology and Obstetrics), Narayani Veterinary Clinic, Maharashtra",
            review: "I've seen it firsthand. The better coat, no tummy troubles, and pets that actually finish their bowl. Harmony is the kind of topper I feel good recommending it.", 
            rating: 5,
            product: "Harmony Topper"
          },
          { 
            id: 3, 
            title: "What Clinical Nutritionists have to say",
            name: "Dr. Satish Putluru", 
            credentials: "M.V.Sc (Nutrition), Alltech, Hyderabad",
            review: "I've seen a lot of toppers that look good on the label and stop there. Gut Sense doesn't — fermented microgreens, moringa, coconut butter, the ingredient logic actually holds up. That kind of intentional formulation is rarer than it should be.", 
            rating: 5,
            product: "Gut Sense"
          },
          { 
            id: 4, 
            title: "What Clinical have to say",
            name: "Dr. Deepak", 
            credentials: "M.V.Sc (Gynaecology and Obstetrics), Curative Veterinary Hospital, Bengaluru",
            review: "Gut health is often the first thing I look at when a pet isn't doing well. Gut Sense has ingredients that genuinely support that, I have noticed the difference so have my clients. It's a suggestion I'm comfortable making.", 
            rating: 5,
            product: "Gut Sense"
          },
          { 
            id: 5, 
            title: "What Gut-Microbiome specialist have to say?",
            name: "Dr. Omkar Kodange", 
            credentials: "M.V.Sc (Gynaecology and Obstetrics), N.A.V.C Certified micro-biome specialist",
            review: "Most treats just sit in the gut. Chicken Crispies work with it , the Active Gut-Correction Matrix is real, and so is the protein quality. That matters.", 
            rating: 5,
            product: "Chicken Crispies"
          },
          { 
            id: 6, 
            title: "What Clinician have to say",
            name: "Dr. Shubham Bibekar", 
            credentials: "M.V.Sc (Gynaecology and Obstetrics), Narayani Veterinary Clinic, Maharashtra",
            review: "I've seen it firsthand. The better coat, no tummy troubles, and pets that actually finish their bowl. Harmony is the kind of topper I feel good recommending it.", 
            rating: 5,
            product: "Harmony Topper"
          },
          { 
            id: 7, 
            title: "What Clinical Nutritionists have to say",
            name: "Dr. Satish Putluru", 
            credentials: "M.V.Sc (Nutrition), Alltech, Hyderabad",
            review: "I've seen a lot of toppers that look good on the label and stop there. Gut Sense doesn't — fermented microgreens, moringa, coconut butter, the ingredient logic actually holds up. That kind of intentional formulation is rarer than it should be.", 
            rating: 5,
            product: "Gut Sense"
          },
          { 
            id: 8, 
            title: "What Clinical have to say",
            name: "Dr. Deepak", 
            credentials: "M.V.Sc (Gynaecology and Obstetrics), Curative Veterinary Hospital, Bengaluru",
            review: "Gut health is often the first thing I look at when a pet isn't doing well. Gut Sense has ingredients that genuinely support that, I have noticed the difference so have my clients. It's a suggestion I'm comfortable making.", 
            rating: 5,
            product: "Gut Sense"
          }
        ].map((item, index) => (
          <SwiperSlide key={`vet-review-${index}`} className="!w-[320px] md:!w-[380px] !h-auto">
            <div className="group bg-card rounded-2xl p-6 md:p-8 shadow-sm border border-border/20 h-full w-full flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-[15px] leading-relaxed text-foreground/90 font-medium italic">"{item.review}"</p>
              </div>
              <div className="mt-6 pt-6 border-t border-border/40 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <img 
                      src={DOCTOR_IMAGES[item.name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.credentials}</p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
