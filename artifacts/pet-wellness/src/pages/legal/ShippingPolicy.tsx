import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function ShippingPolicy() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Shipping & Delivery";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Shipping and Delivery policy for Ancestral Essence."
      toc={[
        { id: 'shipping-delivery', title: 'Shipping & Delivery' }
      ]}
    >
      <section id="shipping-delivery" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Shipping & Delivery</h2>
        <p className="mb-6">
          To guarantee absolute freshness, Ancestral Essence operates on a boutique, handcrafted, pre-booking model with two fresh batches prepared and dispatched weekly.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Batch 1 (Dispatched Thursday):</strong> Booking windows open Monday at 3:00 PM and close Wednesday at 6:00 PM (or until sold out). Orders are dispatched Thursday before 2:00 PM.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Batch 2 (Dispatched Monday):</strong> Booking windows open Thursday at 3:00 PM and close Saturday at 6:00 PM (or until sold out). Orders are dispatched Monday before 2:00 PM.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Missed the Window?</strong> If a batch fills up or closes, you can effortlessly join our Priority Waitlist to secure your place in the very next fresh batch.</span>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
