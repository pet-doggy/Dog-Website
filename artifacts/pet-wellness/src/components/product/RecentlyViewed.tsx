import React from 'react';
import { Product } from '@/data/products';
import { Link } from 'wouter';

interface Props {
  products: Product[];
}

export default function RecentlyViewed({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-serif mb-8">Recently Viewed</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="flex-none w-[200px] group snap-start">
              <div className="bg-card rounded-xl aspect-[4/5] flex items-center justify-center mb-3 border border-border/10 overflow-hidden">
                <img 
                  src={p.images[0] || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80'} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <h3 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">₹{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
