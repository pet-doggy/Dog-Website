import React from 'react';
import { FeedingGuideItem } from '@/data/products';
import { ShieldCheck, Leaf, Heart, Award } from 'lucide-react';

interface Props {
  feedingGuide: FeedingGuideItem[];
  description: string;
  richDescription?: string;
}

export default function FeedingAndDescription({ feedingGuide, description, richDescription }: Props) {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
          {/* Product description was moved to IngredientsAndNutrition as an accordion */}

        {/* Bottom Trust Strip */}
        <div className="mt-20 pt-10 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <img src="/mini-logos/Real Ingredients.png" alt="Real Ingredients" className="max-h-8 w-auto object-scale-down" />
            <div>
              <div className="font-semibold text-sm">Real Ingredients</div>
              <div className="text-xs text-muted-foreground">No fillers. No by-products.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src="/mini-logos/Ethically Sourced.png" alt="Ethically Sourced" className="max-h-8 w-auto object-scale-down" />
            <div>
              <div className="font-semibold text-sm">Ethically Sourced</div>
              <div className="text-xs text-muted-foreground">Responsibly sourced ingredients.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src="/mini-logos/Vet Formulated.png" alt="Vet Formulated" className="max-h-8 w-auto object-scale-down" />
            <div>
              <div className="font-semibold text-sm">Vet Formulated</div>
              <div className="text-xs text-muted-foreground">Backed by science & expertise.</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <img src="/mini-logos/Made in India.png" alt="Made in India" className="max-h-8 w-auto object-scale-down" />
            <div>
              <div className="font-semibold text-sm">Made in India</div>
              <div className="text-xs text-muted-foreground">Crafted in our own facility.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
