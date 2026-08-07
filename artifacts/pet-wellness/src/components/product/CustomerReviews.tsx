import React from 'react';
import { Review } from '@/data/products';
import { Star } from 'lucide-react';

interface Props {
  reviews: Review[];
}

export default function CustomerReviews({ reviews }: Props) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center">Case Validations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-border/10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg">{review.customerName}</h4>
                  {review.petName && <p className="text-xs text-muted-foreground">Pet: {review.petName}</p>}
                </div>
                <div className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</div>
              </div>
              <div className="flex text-[#EFA717] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                ))}
              </div>
              
              {/* CMS Rich Text Placeholder rendering */}
              <div 
                className="text-sm leading-relaxed text-foreground/80 mb-6 flex-grow prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: review.reviewText }}
              />
              
              {review.image && (
                <div className="w-full h-32 rounded-xl overflow-hidden mt-auto">
                  <img src={review.image} alt="Review" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
