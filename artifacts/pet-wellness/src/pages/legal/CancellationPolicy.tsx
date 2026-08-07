import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function CancellationPolicy() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Payment & Cancellation Policy";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Payment and Cancellation Policy for Ancestral Essence."
      toc={[
        { id: 'payment-cancellation', title: 'Payment & Cancellation' }
      ]}
    >
      <section id="payment-cancellation" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Payment & Cancellation Policy</h2>
        <p className="mb-6">
          To secure your handcrafted order, payment—including any applicable shipping fees—must be fully completed within your designated booking window. Because each batch is custom-made fresh to your pre-booking selection, unpaid requests are automatically cancelled once the booking window closes.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Missed the Payment Window?</strong> If your payment is processed after the deadline has passed, your order will automatically step forward to be freshly prepared and dispatched with the very next upcoming batch.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Need to Make Changes?</strong> Connect with your Pet Concierge instantly via WhatsApp during support hours to adjust or update your order before the batch lock-in.</span>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
