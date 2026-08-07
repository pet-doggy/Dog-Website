import React from 'react';
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
          <div key={benefit.id} className={`flex flex-col md:flex-row items-center gap-12 mb-24 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/2 aspect-square bg-card rounded-[32px] overflow-hidden flex items-center justify-center shadow-lg">
              {benefit.image ? (
                <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-border/20 flex items-center justify-center text-xs text-muted-foreground text-center">CMS Image<br/>Placeholder</div>
              )}
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="w-16 h-16 rounded-full border border-border/30 bg-background/50 mb-6 flex items-center justify-center">
                {/* CMS Icon Placeholder */}
              </div>
              <h3 className="text-3xl font-serif mb-4">{benefit.title}</h3>
              {/* CMS Rich Text Placeholder rendering */}
              <div 
                className="text-muted-foreground text-lg leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: benefit.description }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
