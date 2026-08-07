import React from 'react';

export default function PremiumTrustStrip() {
  const trusts = [
    { title: 'Flat Shipping' },
    { title: 'Secured Payment' },
    { title: 'Prepared Fresh' },
  ];

  return (
    <section className="py-12 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {trusts.map((trust, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center p-2.5 overflow-hidden shrink-0">
                <img 
                  src={`/${trust.title}.png`} 
                  alt={trust.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-wide uppercase">{trust.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
