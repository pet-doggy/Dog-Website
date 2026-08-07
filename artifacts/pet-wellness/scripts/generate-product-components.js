const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'product');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const components = {
  'ProductHero.tsx': `import React, { useState } from 'react';
import { Product, ProductVariant } from '@/data/products';
import { Star, ShieldCheck, Truck, Plus, Minus, Heart, ChevronDown } from 'lucide-react';

interface Props {
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
  onVariantChange: (variant: ProductVariant) => void;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export default function ProductHero({ product, selectedVariant, quantity, onVariantChange, onQuantityChange, onAddToCart, isWishlisted, onToggleWishlist }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 relative">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="bg-card rounded-3xl aspect-[4/5] overflow-hidden flex items-center justify-center p-8 relative group cursor-zoom-in">
            <img 
              src={product.images[activeImage] || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80'} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={\`flex-none w-20 h-24 rounded-xl overflow-hidden border-2 transition-all \${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70'}\`}
                >
                  <img src={img} alt={\`Thumbnail \${idx}\`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="relative">
          <div className="lg:sticky lg:top-[120px] lg:pb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-[#EFA717]">
                <Star size={16} fill="currentColor" strokeWidth={1} />
                <span className="text-foreground font-medium ml-1.5 text-sm">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground underline underline-offset-2 cursor-pointer">
                {product.reviewCount} Reviews
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif mb-4 leading-tight">{product.name}</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed font-light">{product.description}</p>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-3xl font-medium tracking-tight">₹{selectedVariant?.price || product.price}</span>
              {(product.originalPrice || product.discount) && (
                <>
                  <span className="text-lg text-muted-foreground line-through mb-1">
                    ₹{product.originalPrice || Math.floor((selectedVariant?.price || product.price) * 1.2)}
                  </span>
                  <span className="bg-[#EFECE5] text-primary text-xs font-semibold px-2 py-1 rounded-sm mb-1.5 uppercase tracking-wider">
                    {product.discount || 15}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Select Weight</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => onVariantChange(v)}
                    className={\`py-3 rounded-xl border transition-all \${
                      selectedVariant?.id === v.id 
                        ? 'border-primary bg-primary/5 text-foreground' 
                        : 'border-border/50 text-muted-foreground hover:border-foreground/30'
                    }\`}
                  >
                    <span className="block text-sm font-medium">{v.size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex gap-4 mb-8">
              <div className="flex items-center border border-border rounded-full h-14 bg-background">
                <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => onQuantityChange(quantity + 1)} className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={onAddToCart}
                className="flex-1 bg-primary text-primary-foreground h-14 rounded-full font-medium text-lg hover:bg-primary/90 transition-colors"
              >
                Add to Cart
              </button>
              <button 
                className="flex-1 bg-foreground text-background h-14 rounded-full font-medium text-lg hover:bg-foreground/90 transition-colors"
              >
                Buy Now
              </button>
              <button 
                onClick={onToggleWishlist}
                className="w-14 h-14 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors"
              >
                <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-6 border-t border-border/50">
              <div className="flex items-center text-sm text-muted-foreground">
                <ShieldCheck size={16} className="mr-2 opacity-70" /> Secured Checkout
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck size={16} className="mr-2 opacity-70" /> Ships within 24hrs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border z-50 lg:hidden flex gap-3">
        <button 
          onClick={onAddToCart}
          className="flex-1 bg-primary text-primary-foreground h-12 rounded-full font-medium"
        >
          Add to Cart
        </button>
        <button 
          className="flex-1 bg-foreground text-background h-12 rounded-full font-medium"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
`,
  'WhyPetParentsLoveIt.tsx': `import React from 'react';

export default function WhyPetParentsLoveIt() {
  const cards = [
    { title: "Better Digestion", desc: "Formulated with prebiotics to build gut resilience." },
    { title: "Healthy Skin & Coat", desc: "Rich in Omega-3s for a luminous coat." },
    { title: "Strong Immunity", desc: "Antioxidants support cellular health." },
    { title: "High Protein", desc: "85% animal protein content." },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F0]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Why Pet Parents Love It</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border/10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border border-border/30 mb-6 flex items-center justify-center bg-background/50">
                {/* Icon Placeholder */}
              </div>
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'Ingredients.tsx': `import React from 'react';
import { Ingredient } from '@/data/products';

interface Props {
  ingredients: Ingredient[];
}

export default function Ingredients({ ingredients }: Props) {
  if (!ingredients || ingredients.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Premium Ingredients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ingredients.map((ing) => (
            <div key={ing.id} className="group">
              <div className="aspect-[4/3] bg-card rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
                {ing.image ? (
                  <img src={ing.image} alt={ing.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-border/20" />
                )}
              </div>
              <h3 className="font-serif text-xl mb-2">{ing.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{ing.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'NutritionalInformation.tsx': `import React from 'react';
import { NutritionItem } from '@/data/products';

interface Props {
  nutrition: NutritionItem[];
}

export default function NutritionalInformation({ nutrition }: Props) {
  if (!nutrition || nutrition.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#EFECE5]">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Nutritional Information</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <ul className="divide-y divide-border/30">
            {nutrition.map((item, i) => (
              <li key={i} className="flex justify-between py-4">
                <span className="font-medium text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
`,
  'FeedingGuide.tsx': `import React from 'react';
import { FeedingGuideItem } from '@/data/products';

interface Props {
  feedingGuide: FeedingGuideItem[];
}

export default function FeedingGuide({ feedingGuide }: Props) {
  if (!feedingGuide || feedingGuide.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Feeding Guide</h2>
        <div className="border border-border/30 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F5F5F0]">
              <tr>
                <th className="py-4 px-6 font-medium text-muted-foreground">Pet Weight</th>
                <th className="py-4 px-6 font-medium text-muted-foreground">Daily Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {feedingGuide.map((item, i) => (
                <tr key={i} className="hover:bg-card/50 transition-colors">
                  <td className="py-4 px-6">{item.weight}</td>
                  <td className="py-4 px-6 font-semibold">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
`,
  'ProductDescription.tsx': `import React from 'react';

interface Props {
  richDescription?: string;
  description: string;
}

export default function ProductDescription({ richDescription, description }: Props) {
  return (
    <section className="py-16 md:py-24 bg-[#F5F5F0]">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl prose prose-lg prose-headings:font-serif">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center not-prose">Protocol Details</h2>
        
        {richDescription ? (
          <div dangerouslySetInnerHTML={{ __html: richDescription }} />
        ) : (
          <p>{description}</p>
        )}
      </div>
    </section>
  );
}
`,
  'BenefitsSection.tsx': `import React from 'react';
import { Benefit } from '@/data/products';

interface Props {
  benefits: Benefit[];
}

export default function BenefitsSection({ benefits }: Props) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        {benefits.map((benefit, i) => (
          <div key={benefit.id} className={\`flex flex-col md:flex-row items-center gap-12 mb-24 \${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}\`}>
            <div className="w-full md:w-1/2 aspect-square bg-card rounded-[32px] overflow-hidden flex items-center justify-center shadow-lg">
              {benefit.image ? (
                <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-border/20" />
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="w-16 h-16 rounded-full border border-border mb-6 flex items-center justify-center">
                {/* Icon Placeholder */}
              </div>
              <h3 className="text-3xl font-serif mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
  'CustomerReviews.tsx': `import React from 'react';
import { Review } from '@/data/products';
import { Star } from 'lucide-react';

interface Props {
  reviews: Review[];
}

export default function CustomerReviews({ reviews }: Props) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#EFECE5]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Case Validations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-border/10">
              <div className="flex text-[#EFA717] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                ))}
              </div>
              <h4 className="font-semibold mb-2">{review.customerName}</h4>
              {review.petName && <p className="text-xs text-muted-foreground mb-4">Pet: {review.petName}</p>}
              <p className="text-sm leading-relaxed text-foreground/80 mb-4">{review.reviewText}</p>
              <div className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'FAQSection.tsx': `import React, { useState } from 'react';
import { FAQ } from '@/data/products';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-serif mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Everything you need to know about this protocol.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-border/50 rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openId === faq.id && (
                  <div className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
`,
  'RelatedProducts.tsx': `import React from 'react';
import { Product } from '@/data/products';
import { Link } from 'wouter';

interface Props {
  products: Product[];
}

export default function RelatedProducts({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F0]">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Related Protocols</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((p) => (
            <Link key={p.id} href={\`/product/\${p.slug}\`} className="group">
              <div className="bg-card rounded-2xl aspect-[4/5] p-6 flex items-center justify-center mb-4 border border-border/10 relative overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="font-serif text-lg mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'RecentlyViewed.tsx': `import React from 'react';
import { Product } from '@/data/products';
import { Link } from 'wouter';

interface Props {
  products: Product[];
}

export default function RecentlyViewed({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-serif mb-8">Recently Viewed</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {products.map((p) => (
            <Link key={p.id} href={\`/product/\${p.slug}\`} className="flex-none w-[200px] group snap-start">
              <div className="bg-card rounded-xl aspect-[4/5] p-4 flex items-center justify-center mb-3 border border-border/10 overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 className="text-sm font-medium line-clamp-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
`,
  'TrustSection.tsx': `import React from 'react';
import { TrustBadge } from '@/data/products';

interface Props {
  badges: TrustBadge[];
}

export default function TrustSection({ badges }: Props) {
  if (!badges || badges.length === 0) return null;

  return (
    <section className="py-12 bg-[#111111] text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {badges.map((badge) => (
            <div key={badge.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                {/* Icon Placeholder */}
              </div>
              <span className="text-sm font-medium tracking-wide uppercase">{badge.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(dir, filename), content);
  console.log(\`Created \${filename}\`);
}
