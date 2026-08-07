import React from 'react';
import { TrustBadge } from '@/data/products';

interface Props {
  badges: TrustBadge[];
}

export default function TrustSection({ badges }: Props) {
  // Use CMS data if provided, otherwise fallback to empty for now
  const trustBadges = badges && badges.length > 0 ? badges : [
    { id: '1', title: "Made in India" },
    { id: '2', title: "Vet Approved" },
    { id: '3', title: "Premium Ingredients" },
    { id: '4', title: "Fast Shipping" },
    { id: '5', title: "Secure Payments" }
  ];

  return (
    <section className="py-16 md:py-24 border-t border-border/40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {trustBadges.map((badge, i) => (
            <div key={badge.id || i} className="flex items-center gap-3">
              <img 
                src={`/mini-logos/${badge.title}.png`} 
                alt={badge.title} 
                className="max-h-10 w-auto object-scale-down" 
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                }} 
              />
              <span className="text-sm font-medium tracking-wide uppercase">{badge.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
