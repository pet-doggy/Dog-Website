import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function RefundReturnPolicy() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Returns & Refund Policy";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Returns and Refund Policy for Ancestral Essence."
      toc={[
        { id: 'returns-refunds', title: 'Returns & Refund Policy' }
      ]}
    >
      <section id="returns-refunds" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Returns & Refund Policy</h2>
        <p className="mb-6">
          Our products are made-to-order with love and intention. Because of this, we do not accept returns—but we do believe in fairness.
        </p>
        <ul className="space-y-4 mb-6">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Cancellation Within 24 Hours:</strong> You can cancel your order within 24 hours of placing it for a 50% refund.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Beyond 24 Hours:</strong> We won't be able to offer a refund once this window passes, as your pet's order has already begun its journey from preparation to perfection.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Damaged or Spoiled Items:</strong> If you receive a damaged or spoiled item, please contact your Pet Concierge within 24 hours of delivery with unboxing images and videos, and we’ll take care of it immediately.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Order Cancelled by Us:</strong> If, for any reason, we must cancel your order, you will receive a 100% full refund back to your source account.</span>
          </li>
        </ul>
        <p className="font-medium italic text-foreground/90 border-l-4 border-[#B89D5D] pl-4 py-2 mt-8 bg-[#B89D5D]/5 rounded-r-lg">
          <strong>A Note on Kindness:</strong> If life throws a curveball and a cancelled product still reaches you—don’t let it go to waste. Please pass it on to a hungry soul who needs it.
        </p>
      </section>
    </LegalLayout>
  );
}
