import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function PrivacyPolicy() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Privacy Policy & Updates";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Privacy Policy and Policy Updates for Ancestral Essence."
      toc={[
        { id: 'privacy-policy', title: 'Privacy Policy' },
        { id: 'policy-updates', title: 'Policy Updates' }
      ]}
    >
      <section id="privacy-policy" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Privacy Policy</h2>
        <p className="mb-6">
          At Ancestral Essence, your privacy isn't just protected—it's respected. We are fully committed to safeguarding your personal data with the highest standards of care.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>What We Collect:</strong> We collect only essential information required to fulfill your orders, process secure payments, and enhance your personalized nutrition experience (including your name, contact details, pet details, and WhatsApp communication history).</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Data Integrity:</strong> We do not use your data for unsolicited marketing, and we never sell, lease, or share your information with third parties. Everything is handled strictly to serve you and your pet better.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Secure Transactions:</strong> All payments are processed through secure, third-party payment gateways. We never store your credit/debit card numbers or UPI credentials on our servers.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Your Rights:</strong> You maintain full control over your data. You have the right to access, correct, or request the complete deletion of your personal information at any time simply by contacting your Pet Concierge via WhatsApp.</span>
          </li>
        </ul>
      </section>

      <section id="policy-updates" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Policy Updates</h2>
        <p className="mb-6">
          We want our relationship with you to be completely transparent. To keep you fully informed, any official updates that affect your experience—such as adjustments to our fresh batch schedules, delivery policies, or website terms—will be updated right here on our platform with a revised effective date.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Stay In The Loop:</strong> For major adjustments, we will also send direct notifications to your preferred contact channel so you never miss a booking window or delivery update.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Have Questions or Data Requests?</strong> If you have any concerns, questions regarding your privacy, or want to update your information, simply reach out to your Pet Concierge instantly via WhatsApp during our support hours. We are always here to help.</span>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
