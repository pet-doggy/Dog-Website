import React from 'react';
import LegalLayout from '@/components/layout/LegalLayout';

export default function About() {
  const lastUpdated = "JULY 09, 2026";
  const title = "About Us & Customer Support";
  
  return (
    <LegalLayout
      title={title}
      lastUpdated={lastUpdated}
      seoTitle={`${title} - Ancestral Essence`}
      seoDescription="Learn more about Ancestral Essence and our Customer Support."
      toc={[
        { id: 'about-us', title: 'About Us' },
        { id: 'customer-support', title: 'Customer Support' }
      ]}
    >
      <section id="about-us" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">About Us: Ancestral Essence</h2>
        <p className="mb-4">
          Ancestral Essence is a pioneer in premium, vet-formulated pet nutrition, crafting species-appropriate complementary nutrition and gourmet enrichment treats. By blending ancient nutritional wisdom with modern biomechanical stability—such as our signature 48-hour slow fermentation process—we target root-cause health concerns from gut health to allergen defense.
        </p>
        <p className="font-medium italic text-foreground/90 border-l-4 border-[#B89D5D] pl-4 py-2 my-6 bg-[#B89D5D]/5 rounded-r-lg">
          Witness the difference: over 80% of pets show improved energy, digestion, and coat within a month.
        </p>
      </section>

      <section id="customer-support" className="mb-12">
        <h2 className="text-2xl font-serif text-[#B89D5D] mb-6 border-b border-border/40 pb-4">Customer Support</h2>
        <p className="mb-6">
          Questions? Consider us your personal Pet Concierge. From instant shipping updates to the finer details of our formulas, our dedicated support team is here to deliver total peace of mind. For quick responses, connect with us instantly via WhatsApp. For detailed inquiries regarding your order, delivery, or custom nutrition requests, reach out via Email.
        </p>
        <ul className="space-y-4">
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Support Hours:</strong> Monday to Saturday, 9:00 AM to 7:00 PM (IST).</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#B89D5D] mr-3 mt-1">●</span>
            <span><strong>Commitment:</strong> We are dedicated to providing exceptional, luxury-tier service at every single step of your journey with us.</span>
          </li>
        </ul>
      </section>
    </LegalLayout>
  );
}
