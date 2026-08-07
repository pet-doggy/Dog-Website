import React from 'react';

export default function PremiumIngredients({ ingredients }: { ingredients?: any[] }) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#F9F9F6]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Premium Human-Grade Ingredients</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We use only the finest ingredients, carefully selected to provide optimal nutrition for your pet. No fillers, no artificial preservatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden relative">
                {ingredient.image_url ? (
                  <img src={ingredient.image_url} alt={ingredient.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                    {ingredient.name}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{ingredient.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ingredient.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
