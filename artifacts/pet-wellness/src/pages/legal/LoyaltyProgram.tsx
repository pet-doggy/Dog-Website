import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function LoyaltyProgram() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Loyalty Program";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Loyalty Program for Ancestral Essence."
      toc={[
        { id: 'loyalty-program', title: 'Loyalty Program' },
        { id: 'policy-notes', title: 'Policy Notes' }
      ]}
    >
      <section id="loyalty-program" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Loyalty Program</h2>
        <p className="mb-4 italic text-foreground/80">
          Loyalty isn't just rewarded—it's nourished.
        </p>
        <p className="mb-6">
          For every single order you place above ₹899, you automatically earn a 3% loyalty credit to use as a direct discount on your very next purchase. Even if your next order falls below ₹899, your 3% discount still stands—because consistent care deserves recognition.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Pooling Your Rewards:</strong> If you place another order above ₹899 within 3 months, you can choose to hold and pool your rewards, combining them for a maximum loyalty discount of 6%.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>The Expiration Rule:</strong> Consistency is key. If no order is placed within 3 months, your accumulated 3% loyalty credit will expire entirely and the cycle resets.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Redeeming Your 6% Credit:</strong> To activate and redeem a pooled 6% loyalty discount, your current order value must be above ₹1499.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>The Rolling Cycle Rule:</strong> If your subsequent order falls below ₹1499, you can still apply a single 3% credit from your first order. The remaining 3% from your second order will seamlessly combine with the 3% earned from your current order, rolling over toward your next purchase. This cycle continues automatically until you place an order valued above ₹1499 to unlock the full pooled savings.</span>
          </li>
        </ul>
      </section>

      <section id="policy-notes" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Policy Notes</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Tax Transparency:</strong> All loyalty percentages are calculated directly on the product value.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Shipping Independence:</strong> Shipping charges are entirely separate from discount eligibility. Free shipping applies automatically to any order total crossing ₹2999, completely independent of whether you are redeeming a 3% or 6% loyalty credit.</span>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
