import React, { useState } from 'react';
import { Ingredient, NutritionItem } from '@/data/products';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  ingredients: Ingredient[];
  nutrition: NutritionItem[];
  description?: string;
  richDescription?: string;
}

export default function IngredientsAndNutrition({ ingredients, nutrition, description, richDescription }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="border-t border-border/30">
          
          {/* Product Description */}
          {(description || richDescription) && (
            <div className="border-b border-border/30">
              <button 
                className="w-full flex items-center justify-between py-6 text-left hover:text-[#E38B2C] transition-colors"
                onClick={() => toggleSection('description')}
              >
                <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Product Description</h2>
                {openSection === 'description' ? <ChevronUp size={24} className="text-muted-foreground" /> : <ChevronDown size={24} className="text-muted-foreground" />}
              </button>
              
              {openSection === 'description' && (
                <div className="pb-8 pt-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="prose prose-sm prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
                    {richDescription ? (
                      <div dangerouslySetInnerHTML={{ __html: richDescription }} />
                    ) : (
                      <p>{description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Ingredients */}
          <div className="border-b border-border/30">
            <button 
              className="w-full flex items-center justify-between py-6 text-left hover:text-[#E38B2C] transition-colors"
              onClick={() => toggleSection('ingredients')}
            >
              <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Key Ingredients</h2>
              {openSection === 'ingredients' ? <ChevronUp size={24} className="text-muted-foreground" /> : <ChevronDown size={24} className="text-muted-foreground" />}
            </button>
            
            {openSection === 'ingredients' && (
              <div className="pb-8 pt-4 animate-in slide-in-from-top-2 duration-200">
                <p className="text-muted-foreground text-sm mb-8">Carefully selected. Purposefully included.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {(ingredients || []).slice(0, 4).map((ing, i) => (
                    <div key={ing.id || i} className="text-center">
                      <div className="aspect-square bg-border/20 rounded-full mb-4 flex items-center justify-center p-4 mx-auto w-24 h-24">
                        {ing.image ? (
                          <img src={ing.image} alt={ing.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-12 h-12 rounded-full border border-border/30" />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-2">{ing.name}</h3>
                      <div 
                        className="text-muted-foreground/80 text-xs leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: ing.description }}
                      />
                    </div>
                  ))}
                </div>
                

              </div>
            )}
          </div>

          {/* Nutritional Information */}
          <div className="border-b border-border/30">
            <button 
              className="w-full flex items-center justify-between py-6 text-left hover:text-[#E38B2C] transition-colors"
              onClick={() => toggleSection('nutrition')}
            >
              <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Nutritional Information</h2>
              {openSection === 'nutrition' ? <ChevronUp size={24} className="text-muted-foreground" /> : <ChevronDown size={24} className="text-muted-foreground" />}
            </button>
            
            {openSection === 'nutrition' && (
              <div className="pb-8 pt-4 animate-in slide-in-from-top-2 duration-200">
                <p className="text-muted-foreground text-sm mb-8">Every ingredient. Every percentage. Nothing hidden.</p>
                
                <div className="overflow-x-auto mb-8">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                    {/* Column 1 header */}
                    <div className="grid grid-cols-2 border-b border-border/30 pb-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider">Nutrient</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-right">As Fed Basis</span>
                    </div>
                    {/* Column 2 header */}
                    <div className="hidden md:grid grid-cols-2 border-b border-border/30 pb-3 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider">Nutrient</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-right">As Fed Basis</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                    {(nutrition || []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-border/20">
                        <span className="text-muted-foreground text-sm">{item.name}</span>
                        <span className="font-semibold text-sm">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
