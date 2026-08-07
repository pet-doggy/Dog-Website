import React from 'react';
import { FeedingGuideItem } from '@/data/products';

interface Props {
  feedingGuide: FeedingGuideItem[];
}

export default function FeedingGuide({ feedingGuide }: Props) {
  if (!feedingGuide || feedingGuide.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Feeding Guide</h2>
        <div className="border border-border/30 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F7F5F2]">
              <tr>
                <th className="py-4 px-6 font-medium text-muted-foreground">Pet Weight</th>
                <th className="py-4 px-6 font-medium text-muted-foreground">Daily Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {feedingGuide.map((item, i) => (
                <tr key={i} className="hover:bg-card/50 transition-colors">
                  <td className="py-4 px-6">{item.weight}</td>
                  <td className="py-4 px-6 font-semibold">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
