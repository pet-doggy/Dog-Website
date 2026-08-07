import React from 'react';
import { Product } from '@/data/products';
import { Link } from 'wouter';

interface Props {
  products: Product[];
}

export default function RelatedProducts({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#F7F5F2]">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="group block bg-white p-4 rounded-2xl shadow-sm border border-border/10">
              <div className="bg-card rounded-xl aspect-[4/5] flex items-center justify-center mb-4 relative overflow-hidden">
                <img 
                  src={(p as any).image || (typeof p.images?.[0] === 'string' ? p.images[0] : (p.images?.[0] as any)?.image_url) || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80'} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <h3 className="font-serif text-lg mb-2 line-clamp-2 min-h-[3.5rem]">{p.name}</h3>
              <p className="text-sm font-medium">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

