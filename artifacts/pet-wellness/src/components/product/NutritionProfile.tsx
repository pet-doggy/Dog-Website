import React from 'react';
import { Check } from 'lucide-react';

export default function NutritionProfile({ nutrition }: { nutrition?: any[] }) {
  if (!nutrition || nutrition.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Nutrition Profile</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our premium formula is designed to exceed standard nutritional requirements, providing optimal health for your pet.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-12 bg-gray-50 py-4 px-6 border-b border-gray-200">
            <div className="col-span-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Nutrient</div>
            <div className="col-span-3 text-center font-bold text-primary text-sm uppercase tracking-wider">Our Brand</div>
            <div className="col-span-3 text-center font-semibold text-gray-500 text-sm uppercase tracking-wider">Average</div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {nutrition.map((item, index) => (
              <div key={index} className="grid grid-cols-12 py-4 px-6 items-center hover:bg-gray-50/50 transition-colors">
                <div className="col-span-6 font-medium text-gray-900">{item.nutrient}</div>
                <div className="col-span-3 text-center font-bold text-primary flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> {item.our_value}
                </div>
                <div className="col-span-3 text-center text-gray-500">{item.avg_value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
