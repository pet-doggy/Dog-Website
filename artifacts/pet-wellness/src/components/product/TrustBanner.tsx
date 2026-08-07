import React from 'react';
import { Award, Heart, Leaf, ShieldCheck } from 'lucide-react';

export default function TrustBanner() {
  const stats = [
    { icon: <img src="/mini-logos/Happy Pet Parents.png" alt="Happy Pet Parents" className="max-h-12 w-auto object-scale-down" />, value: "10,000+", label: "Happy Pet Parents" },
    { icon: <img src="/mini-logos/Cats Loved the Taste.png" alt="Pets Loved the Taste" className="max-h-12 w-auto object-scale-down" />, value: "95%", label: "Pets Loved the Taste" },
    { icon: <img src="/mini-logos/Real Ingredients.png" alt="Real Ingredients" className="max-h-12 w-auto object-scale-down" />, value: "Real Ingredients", label: "Real Results" },
    { icon: <img src="/mini-logos/Veterinarian.png" alt="Veterinarian" className="max-h-12 w-auto object-scale-down" />, value: "Veterinarian", label: "Formulated" },
  ];

  return (
    <div className="py-12 mt-12 border-y border-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 divide-x divide-border/20">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center justify-center gap-4 px-4 text-center md:text-left">
              <div className="flex-shrink-0 opacity-90">
                {stat.icon}
              </div>
              <div>
                <div className="font-serif text-lg md:text-xl font-medium tracking-wide">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground font-light">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
