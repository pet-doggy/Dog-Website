export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  mrp?: number;
  duration_days?: number;
  label?: string;
  badge?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface NutritionItem {
  name: string;
  value: string;
}

export interface FeedingGuideItem {
  weight: string;
  quantity: string;
  ageGroup?: string;
  notes?: string;
}

export interface TrustBadge {
  id: string;
  title: string;
  icon?: string;
}

export interface Review {
  id: string;
  customerName: string;
  petName?: string;
  rating: number;
  reviewText: string;
  date: string;
  image?: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  petType: 'Dog' | 'Cat';
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  bundle2Price?: number;
  bundle3Price?: number;
  description: string;
  richDescription?: string;
  
  benefitsList: Benefit[];
  ingredientsList: Ingredient[];
  nutrition: NutritionItem[];
  feedingGuide: FeedingGuideItem[];
  faqs: FAQ[];
  reviews: Review[];
  trustBadges: TrustBadge[];
  relatedProductIds: string[];

  images: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  variants: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "p1",
    name: "The Ancestral Canine Product",
    slug: "ancestral-canine-product",
    category: "Nutrition",
    petType: "Dog",
    price: 4999,
    originalPrice: 5999,
    discount: 16,
    rating: 4.9,
    reviewCount: 342,
    description: "A scientifically validated, heritage-soil sourced formula designed to recalibrate your dog's gut biome. Cold-pressed to retain 98% of native micronutrients.",
    richDescription: "<h3>The Ultimate Biological Appropriate Diet</h3><p>Our formulation respects the evolutionary requirements of the canine digestive system...</p><ul><li>Cold-pressed to preserve structural integrity of enzymes</li><li>Sourced directly from heritage Indian farms</li></ul>",
    benefitsList: [
      { id: "b1", title: "Better Digestion", description: "Formulated with prebiotics to build gut resilience." },
      { id: "b2", title: "Healthy Skin & Coat", description: "Rich in Omega-3s for a luminous coat." },
      { id: "b3", title: "Strong Immunity", description: "Antioxidants support cellular health." },
      { id: "b4", title: "High Protein", description: "85% animal protein content." }
    ],
    ingredientsList: [
      { id: "i1", name: "Free-Range Himalayan Yak", description: "Lean protein packed with essential amino acids." },
      { id: "i2", name: "Organic Ashwagandha", description: "Adaptogen to manage stress." },
      { id: "i3", name: "Turmeric Root Extract", description: "Natural anti-inflammatory compound." }
    ],
    nutrition: [
      { name: "Crude Protein (Min)", value: "38%" },
      { name: "Crude Fat (Min)", value: "18%" },
      { name: "Crude Fiber (Max)", value: "4%" },
      { name: "Moisture (Max)", value: "10%" },
      { name: "Calories", value: "3,800 kcal/kg" }
    ],
    feedingGuide: [
      { weight: "1 - 5 kg", quantity: "30 - 90 g" },
      { weight: "5 - 10 kg", quantity: "90 - 150 g" },
      { weight: "10 - 20 kg", quantity: "150 - 250 g" },
      { weight: "20 - 30 kg", quantity: "250 - 340 g" },
      { weight: "30+ kg", quantity: "340+ g" }
    ],
    faqs: [
      { id: "faq1", question: "Is this suitable for all breeds?", answer: "Yes, our product is designed to meet the nutritional levels established for all life stages and breeds." },
      { id: "faq2", question: "How do I transition my dog?", answer: "We recommend a 7-day transition period, gradually mixing our product with their current food." }
    ],
    reviews: [
      { id: "r1", customerName: "Aarav S.", petName: "Max", rating: 5, reviewText: "Incredible change in Max's energy levels within 2 weeks.", date: "2026-05-12" },
      { id: "r2", customerName: "Priya K.", petName: "Luna", rating: 5, reviewText: "Finally a food that my fussy eater loves! Coat is so shiny now.", date: "2026-04-28" }
    ],
    trustBadges: [
      { id: "t1", title: "Made in India" },
      { id: "t2", title: "Vet Approved" },
      { id: "t3", title: "Premium Ingredients" },
      { id: "t4", title: "Fast Shipping" }
    ],
    relatedProductIds: ["p3", "p4", "p5"],
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80"],
    inStock: true,
    isBestSeller: true,
    variants: [
      { id: "v1", size: "2 kg", price: 4999 },
      { id: "v2", size: "5 kg", price: 9999 },
      { id: "v3", size: "10 kg", price: 17999 }
    ]
  },
  {
    id: "p2",
    name: "Feline Microbiome Catalyst",
    slug: "feline-microbiome-catalyst",
    category: "Nutrition",
    petType: "Cat",
    price: 3499,
    rating: 4.8,
    reviewCount: 218,
    description: "Precise nutritional intervention for obligate carnivores. Engineered with ethically sourced marine proteins and wild-foraged botanicals.",
    benefitsList: [], ingredientsList: [], nutrition: [], feedingGuide: [], faqs: [], reviews: [], trustBadges: [], relatedProductIds: [],
    images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80"],
    inStock: true,
    isNew: true,
    variants: [
      { id: "v4", size: "1.5 kg", price: 3499 },
      { id: "v5", size: "4 kg", price: 7999 }
    ]
  },
  {
    id: "p3",
    name: "Longevity Elixir",
    slug: "longevity-elixir",
    category: "Supplements",
    petType: "Dog",
    price: 2499,
    rating: 5.0,
    reviewCount: 189,
    description: "A potent daily tincture combining adaptogenic herbs from the subcontinent. Designed to manage cellular oxidative stress and support joint articulation.",
    benefitsList: [], ingredientsList: [], nutrition: [], feedingGuide: [], faqs: [], reviews: [], trustBadges: [], relatedProductIds: [],
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"],
    inStock: true,
    isBestSeller: true,
    variants: [
      { id: "v6", size: "50 ml", price: 2499 },
      { id: "v7", size: "100 ml", price: 4299 }
    ]
  },
  {
    id: "p4",
    name: "Air-Dried Bison Product",
    slug: "air-dried-bison-product",
    category: "Treats",
    petType: "Dog",
    price: 1499,
    rating: 4.7,
    reviewCount: 156,
    description: "Single-ingredient reward system. Gently air-dried over 72 hours to preserve enzymatic structure and create an irresistible high-value texture.",
    benefitsList: [], ingredientsList: [], nutrition: [], feedingGuide: [], faqs: [], reviews: [], trustBadges: [], relatedProductIds: [],
    images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80"],
    inStock: true,
    variants: [
      { id: "v8", size: "150 g", price: 1499 }
    ]
  },
  {
    id: "p5",
    name: "Vitality Bone Broth Powder",
    slug: "vitality-bone-broth",
    category: "Wellness",
    petType: "Dog",
    price: 1899,
    originalPrice: 2299,
    discount: 15,
    rating: 4.9,
    reviewCount: 204,
    description: "Dehydrated nutritional powerhouse. A rich source of naturally occurring collagen and minerals to fortify the mucosal barrier of the gut.",
    benefitsList: [], ingredientsList: [], nutrition: [], feedingGuide: [], faqs: [], reviews: [], trustBadges: [], relatedProductIds: [],
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80"],
    inStock: true,
    variants: [
      { id: "v9", size: "200 g", price: 1899 }
    ]
  },
  {
    id: "p6",
    name: "Feline Clarity Botanical Drops",
    slug: "feline-clarity-drops",
    category: "Supplements",
    petType: "Cat",
    price: 1999,
    rating: 4.6,
    reviewCount: 92,
    description: "Nervous system recalibration for the modern feline. Uses gentle floral distillates to ease environmental stress.",
    benefitsList: [], ingredientsList: [], nutrition: [], feedingGuide: [], faqs: [], reviews: [], trustBadges: [], relatedProductIds: [],
    images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80"],
    inStock: true,
    isNew: true,
    variants: [
      { id: "v10", size: "30 ml", price: 1999 }
    ]
  }
];

