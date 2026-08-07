import React from 'react';
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
