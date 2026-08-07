import React from 'react';

const PACKS = [
  { type: 'Small Dog', weight: 'Up to 10kg', pack: '1 Box / Month', color: 'bg-amber-100', text: 'text-amber-800' },
  { type: 'Medium Dog', weight: '10-25kg', pack: '2 Boxes / Month', color: 'bg-emerald-100', text: 'text-emerald-800' },
  { type: 'Large Dog', weight: '25kg+', pack: '3-4 Boxes / Month', color: 'bg-blue-100', text: 'text-blue-800' },
  { type: 'Cat', weight: 'All sizes', pack: '1 Box / Month', color: 'bg-purple-100', text: 'text-purple-800' },
];

export default function MonthlyFeedingPack() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Monthly Feeding Pack</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Recommended monthly quantities to keep your furry friend healthy and happy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKS.map((pack, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-150 ${pack.color}`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 w-fit ${pack.color} ${pack.text}`}>
                  {pack.weight}
                </span>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pack.type}</h3>
                <div className="flex-grow"></div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Recommended</p>
                  <p className="text-lg font-semibold text-primary">{pack.pack}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
