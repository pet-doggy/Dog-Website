import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function TermsConditions() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Terms & Conditions";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Terms and Conditions for Ancestral Essence."
      toc={[
        { id: 'terms-conditions', title: 'Terms & Conditions' }
      ]}
    >
      <section id="terms-conditions" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Terms & Conditions</h2>
        <p className="mb-4">
          Welcome to Ancestral Essence. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. Please take a moment to read them carefully before placing an order.
        </p>
        <p className="mb-6">
          We reserve the right to update, amend, or modify these terms at any time without prior notice. Your continued use of our services after any changes signifies your acceptance of the updated terms.
        </p>
        <ul className="space-y-4 mb-8">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Privacy & Safety:</strong> Your privacy is non-negotiable. At Ancestral Essence, we are committed to safeguarding your personal data with the highest standards of care. We collect only essential information required to fulfill your orders, process payments, and enhance our services. We do not sell or share your data with third parties. For more details, please refer to our full Privacy Policy.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Orders & Deliveries:</strong> All orders are subject to availability and price confirmation at the time of booking. Delivery timelines may vary based on your location and third-party logistics constraints. We strive to dispatch and deliver your orders promptly; however, we are not liable for delays that are outside our control (e.g., courier disruptions, extreme weather, acts of god).</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Transparent Pricing:</strong> All listed pricing is fully inclusive of GST. Shipping charges will apply unless otherwise explicitly stated.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Live Updates:</strong> Any official updates that affect your experience as a customer—such as product formulation changes or shipping schedules—will be communicated directly via WhatsApp. We reserve the right to change product availability, pricing, and presentation at any time.</span>
          </li>
        </ul>
        <p className="font-medium text-foreground/90 border-l-4 border-[#B89D5D] pl-4 py-2 mt-8 bg-[#B89D5D]/5 rounded-r-lg">
          <strong>Important Notice:</strong> By placing an order with Ancestral Essence, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
        </p>
      </section>
    </LegalLayout>
  );
}
