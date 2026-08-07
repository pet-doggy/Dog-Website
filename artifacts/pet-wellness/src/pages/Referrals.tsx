import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function Referrals() {
  const lastUpdated = "JULY 09, 2026";
  const title = "Referrals & Discounts";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Referrals, Discounts, and Loyalty Rewards for Ancestral Essence."
      toc={[
        { id: 'referrals-discounts', title: 'Referrals & Discounts' },
        { id: 'policy-notes', title: 'Policy Notes' }
      ]}
    >
      <section id="referrals-discounts" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Referrals & Discounts</h2>
        <p className="mb-6 italic text-foreground/80">
          Because good things are meant to be shared—especially when they make tails wag and whiskers twitch.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Referral Rewards:</strong> Every time you refer a fellow pet parent to Ancestral Essence, we thank you with a discount of upto 8% on your final order value. The more pets you refer, the more your savings add up. One pet, one reward—simple and sincere.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Social Media Discount:</strong> We love seeing your pets thrive on Ancestral Essence. Share your experience on Instagram, tag our official account, and enjoy a discount of upto 10% on your next order. Your story might even be featured on our page!</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Loyalty Reward Program:</strong> Consistency deserves celebration. Place an order above ₹899 every three months to unlock an ongoing 3% loyalty discount. Planning ahead? You can choose to pool your rewards and club them together for a maximum savings of 6% off a single fresh batch.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Complimentary Shipping:</strong> Orders above ₹2999 receive automatic free shipping—because premium nutrition deserves to travel in style.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Extended Rewards Flex:</strong> To give you total control over your savings, all your earned Social Media and Referral discounts can be securely saved and accumulated for up to 6 months before expiration.</span>
          </li>
        </ul>
      </section>

      <section id="policy-notes" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Policy Notes</h2>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Discount Stacking:</strong> Only one promotional discount code can be applied per order.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Shipping Exemption:</strong> Free shipping is completely independent. If your order total crosses ₹2999, you will receive free shipping regardless of any other referral, social media, or loyalty discount applied to the items in your cart.</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Calculation Rule:</strong> All percentage discounts are calculated strictly on the product value before any applicable shipping charges are added.</span>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
