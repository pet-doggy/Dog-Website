import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const reviews = [
  {
    id: 1,
    reviewer: "Rohan S.",
    location: "Bangalore",
    pet: "Bruno (Labrador)",
    issue: "Terrible gas and loose stools every time we tried training treats.",
    body: "I honestly didn’t think a treat could fix digestive issues, but the Sour Loops changed our routine. Since they are made with 48-hour fermented kefir dough, they actually sit well with Bruno's stomach. We use them in his snuffle mat, and he’s obsessed with the crunch. No more gas, and he’s actually excited to learn tricks now.",
    product: "Sour Loops",
    headline: '"No more gas..."'
  },
  {
    id: 2,
    reviewer: "Meera K.",
    location: "Pune",
    pet: "Zoe (Shih Tzu)",
    issue: "Frequent stomach gurgling and unpredictable stool consistency.",
    body: "We’ve been using the Gutsense topper for a few weeks to manage Zoe’s sensitive gut. It’s been a game-changer for firming up her stools during flare-ups. I love that it’s free of synthetic binders and relies on that fermented R5 complex. It feels like real, clinical-grade support, not just another supplement.",
    product: "Gutsense Topper",
    headline: '"A game-changer for her gut..."'
  },
  {
    id: 3,
    reviewer: "Anjali R.",
    location: "Bangalore",
    pet: "Coco (Indie)",
    issue: "Boredom during crate time and chronic bloating.",
    body: "Finding treats that are actually healthy and good for enrichment toys is hard. Coco loves these Sour Loops because of the crispy texture, and I love that the post-biotics are actually stable enough to help her gut lining. She stopped the constant paw licking after we switched to these—the gut-skin connection is real.",
    product: "Sour Loops",
    headline: '"The gut-skin connection is real..."'
  },
  {
    id: 4,
    reviewer: "Vikram D.",
    location: "Mumbai",
    pet: "Tyson (Bulldog)",
    issue: "Constant shedding and dry, flaky skin.",
    body: "Tyson’s coat used to be so brittle. We switched to Chicken Crispies because they use coconut and banana instead of those cheap grain fillers. It took a few weeks, but the flakes are basically gone, and his coat looks way more hydrated. It’s a relief to find a treat that actually does something for his skin.",
    product: "Chicken Crispies",
    headline: '"Flakes are basically gone..."'
  },
  {
    id: 5,
    reviewer: "Karthik P.",
    location: "Bangalore",
    pet: "Simba (Golden Retriever)",
    issue: "Severe seasonal itching and dull, rough fur.",
    body: "We wanted something strictly marine-based to help with Simba's scratching. The Coastal Catch treats are incredible. Using real Bombil fish meant he got that Omega-3 boost immediately. His coat is much softer now, and he seems way more comfortable in his own skin since we stopped using those treats with artificial fats.",
    product: "Coastal Catch",
    headline: '"Coat is much softer now..."'
  },
  {
    id: 6,
    reviewer: "Sunita V.",
    location: "Bangalore",
    pet: "Milo (Frenchie)",
    issue: "Persistent food allergies and reactions to chicken/beef.",
    body: "It’s so hard to find novel protein treats in India. Milo has a super sensitive system, so the Ocean Whitefish treats (Tilapia and Shrimp) were a lifesaver. He finally stopped the constant ear scratching, and I don’t have to worry about cross-contamination with other meats.",
    product: "Ocean Whitefish",
    headline: '"A lifesaver for sensitive systems..."'
  },
  {
    id: 7,
    reviewer: "Riya M.",
    location: "Delhi",
    pet: "Luna (Indie)",
    issue: "Picky eating and brittle fur.",
    body: "Luna turns her nose up at everything, but she goes crazy for these Chicken Crispies. I think it’s the umami flavor. It’s great that it's just real chicken heart and liver—she’s finally getting the B-complex vitamins she needed, and her shedding has dropped significantly.",
    product: "Chicken Crispies",
    headline: '"Shedding has dropped significantly..."'
  },
  {
    id: 8,
    reviewer: "Arjun N.",
    location: "Bangalore",
    pet: "Cleo (Cat)",
    issue: "Cat shedding everywhere and very dry skin.",
    body: "Most cat treats are just empty fillers. Coastal Catch is one of the few things Cleo will eat that is actually full of marine collagen and Omegas. Her shedding has reduced, and she doesn't have that \"dandruff\" look on her dark coat anymore. Highly recommend for any cat owner dealing with coat issues.",
    product: "Coastal Catch",
    headline: '"Reduced shedding and dandruff..."'
  },
  {
    id: 9,
    reviewer: "Sarah T.",
    location: "Kochi",
    pet: "Rex (German Shepherd)",
    issue: "Digestive upset and skin inflammation.",
    body: "We needed an elimination diet treat. The Ocean Whitefish is clean—no grains, no weird fillers. It helped calm down Rex's skin inflammation almost immediately. It’s the first time in a year his stomach hasn't been gurgling after a reward.",
    product: "Ocean Whitefish",
    headline: '"Calmed down skin inflammation..."'
  },
  {
    id: 10,
    reviewer: "David J.",
    location: "Mumbai",
    pet: "Tuffy (Indie)",
    issue: "Lethargy and not trusting commercial kibble anymore.",
    body: "I wanted to move away from processed food without doing the whole raw-food prep headache myself. The Base Meal foundation is perfect. It’s filler-free and has that fermented R5 complex, so Tuffy’s energy levels are through the roof. He’s finally acting like a puppy again.",
    product: "Base Meal",
    headline: '"Energy levels are through the roof..."'
  },
  {
    id: 11,
    reviewer: "Pirya L.",
    location: "Bangalore",
    pet: "Maniram (Cat)",
    issue: "Total boredom with daily wet food.",
    body: "Maniram is the pickiest cat alive. I started crumbling the Harmony topper over his usual food, and he finishes his bowl every single time now. It’s got a strong umami smell that gets him interested immediately, and his coat has become so silky.",
    product: "Harmony Topper",
    headline: '"Finishes his bowl every time..."'
  },
  {
    id: 12,
    reviewer: "Sanjay H.",
    location: "Bangalore",
    pet: "Rocky (Boxer)",
    issue: "Muscle wasting and lack of interest in meals.",
    body: "Rocky was looking a bit lean and skipping meals. The Harmony Multi-Source protein topper helped him put on good weight. The tilapia and chicken heart blend is high-quality stuff. It’s transformed his mealtime into a real, high-value experience.",
    product: "Harmony Topper",
    headline: '"Transformed his mealtime..."'
  },
  {
    id: 13,
    reviewer: "Neha B.",
    location: "Hyderabad",
    pet: "Bella (Pug)",
    issue: "Chronic low energy and sluggishness.",
    body: "The Organ Blend is like a super-vitamin in treat form. Since it’s mostly chicken heart, liver, and gizzard, Bella’s stamina on our walks has improved a ton. She was so sluggish before, but now she’s back to her usual, energetic self. A must-have for aging dogs.",
    product: "Organ Blend",
    headline: '"Like a super-vitamin..."'
  },
  {
    id: 14,
    reviewer: "Amit S.",
    location: "Chennai",
    pet: "Simba (Golden Retriever)",
    issue: "Muscle weakness during recovery.",
    body: "Simba needed extra protein after an injury, but he has a sensitive stomach. These Egg Crispies were perfect because they use whole eggs and psyllium husk, so they didn't upset his digestion at all. He’s recovering well and loves the taste.",
    product: "Egg Crispies",
    headline: '"Perfect for his sensitive stomach..."'
  },
  {
    id: 15,
    reviewer: "Kiran W.",
    location: "Pune",
    pet: "Goldie (Indie)",
    issue: "Picky eating and poor coat health.",
    body: "Goldie wouldn't touch her kibble, but adding the Organ Blend turned everything around. The natural taurine and B-vitamins have made her so much more active. It’s species-appropriate nutrition, not just marketing fluff.",
    product: "Organ Blend",
    headline: '"Species-appropriate nutrition..."'
  }
];

export default function CustomerReviews() {
  return (
    <section className="mb-16 overflow-hidden bg-background">
      <div className="max-w-[1600px] mx-auto px-4 mb-8 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground">What Pet Parents Say</h2>
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
        {reviews.map((item, index) => (
          <SwiperSlide key={`customer-review-${index}`} className="!w-[340px] md:!w-[420px] !h-auto">
            <div className="group bg-[#FAFAFA] rounded-[32px] p-6 md:p-8 shadow-sm border border-border/40 h-full w-full flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 text-[#B89D5D] text-lg mb-4">
                ★★★★★
              </div>
              <h3 className="text-[17px] font-serif font-semibold text-[#12333B] mb-6 line-clamp-2 leading-snug">
                {item.headline}
              </h3>

              <div className="space-y-2 mb-6">
                <p className="text-[13px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Pet: <span className="text-foreground capitalize">{item.pet}</span> | Location: <span className="text-foreground">{item.location}</span>
                </p>
                <p className="text-[13px] text-muted-foreground bg-[#12333B]/5 px-3 py-2 rounded-lg border border-[#12333B]/10">
                  <span className="font-semibold text-[#12333B]">Issue:</span> {item.issue}
                </p>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <p className="text-[15px] leading-relaxed text-foreground/90 font-light italic">
                  {item.body}
                </p>
              </div>

              <div className="mt-auto pt-6 border-t border-border/40">
                <p className="text-sm font-medium text-[#B89D5D]">
                  Product Verified: <span className="font-bold underline decoration-1 underline-offset-4">{item.product}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                  — {item.reviewer}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
