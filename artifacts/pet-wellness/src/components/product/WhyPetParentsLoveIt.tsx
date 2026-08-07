import React from 'react';
import { Benefit } from '@/data/products';

interface Props {
  benefits?: Benefit[];
}

export default function WhyPetParentsLoveIt({ benefits }: Props) {
  // Use CMS data if provided, otherwise fallback to empty for now
  const cards = benefits && benefits.length > 0 ? benefits : [
    { id: '1', title: "Better Digestion", description: "Formulated with prebiotics to build gut resilience." },
    { id: '2', title: "Healthy Skin & Coat", description: "Rich in Omega-3s for a luminous coat." },
    { id: '3', title: "Strong Immunity", description: "Antioxidants support cellular health." },
    { id: '4', title: "High Protein", description: "85% animal protein content." },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F7F5F2]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Why Pet Parents Love It</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {cards.map((card, i) => (
            <div key={card.id || i} className="bg-white px-6 py-10 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-border/5 flex flex-col items-center text-center w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(16.666%-20px)] min-w-[200px]">
              <img 
                src={`/mini-logos/${card.title}.png`} 
                alt={card.title} 
                className="max-h-16 w-auto mb-6 object-scale-down" 
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                }} 
              />
              <h3 className="font-serif text-[17px] mb-3 text-foreground/90">{card.title}</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed px-2">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
