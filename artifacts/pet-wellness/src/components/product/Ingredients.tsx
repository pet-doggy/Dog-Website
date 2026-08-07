import React from 'react';
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
                  <div className="w-24 h-24 rounded-full bg-border/20 flex items-center justify-center text-xs text-muted-foreground text-center">CMS Image<br/>Placeholder</div>
                )}
              </div>
              <h3 className="font-serif text-xl mb-2">{ing.name}</h3>
              {/* CMS Rich Text Placeholder rendering */}
              <div 
                className="text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: ing.description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
