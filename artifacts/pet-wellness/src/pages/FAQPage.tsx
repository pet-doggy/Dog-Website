import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FAQSection from '@/components/product/FAQSection';

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow pt-[140px] pb-12 px-4 md:px-8 max-w-5xl mx-auto w-full">
        <FAQSection faqs={[
          {
            id: 'faq-1',
            question: 'How does the Ancestral Essence loyalty program work?',
            answer: 'For every single order placed above ₹899, you automatically earn a 3% loyalty credit to use as a direct discount on your very next order. Even if your next order falls below ₹899, your 3% discount still stands.'
          },
          {
            id: 'faq-2',
            question: 'Are veterinarians involved with these products?',
            answer: 'Yes! All products are carefully formulated by veterinarians to meet high nutritional standards. Additionally, veterinarians are available for consultations, meal plans, and addressing scientific queries.'
          },
          {
            id: 'faq-3',
            question: 'How can your team assist me?',
            answer: "Our team is here to support you and your pet's nutritional journey. We provide a variety of consultation services, customized meal plans, and expert guidance to help address specific dietary needs or scientific queries. Feel free to reach out to our team at any time!"
          },
          {
            id: 'faq-4',
            question: 'Can I combine or pool my loyalty rewards for a bigger discount?',
            answer: 'Yes. If you place another order above ₹899 within 3 months, you can choose to hold and pool your rewards for a maximum loyalty discount of 6%. However, consistency is key: if no order is placed within 3 months, your accumulated 3% loyalty credit will expire entirely and the cycle resets.'
          },
          {
            id: 'faq-5',
            question: 'What are the restrictions for redeeming a pooled 6% loyalty discount?',
            answer: 'To activate and redeem a pooled 6% loyalty discount, your current order value must be above ₹1499. If your order falls below this amount, you can only apply a single 3% credit from your first order. The remaining 3% from your second order will combine with the 3% earned from your current order, rolling over toward your next purchase.'
          },
          {
            id: 'faq-6',
            question: 'How long can I save my Social Media and Referral discounts before expiration?',
            answer: 'To give you total control over your savings, all your earned Social Media and Referral discounts can be securely saved, tracked, and accumulated for up to 6 months before expiration.'
          },
          {
            id: 'faq-7',
            question: 'Are loyalty program discounts calculated on shipping or GST charges?',
            answer: 'All loyalty program percentages are calculated directly on the product value. Shipping charges are completely separate from discount eligibility. Free shipping applies automatically to any order total crossing ₹2999, independent of whether you are redeeming a 3% or 6% loyalty credit.'
          }
        ]} />
      </div>
      <Footer />
    </div>
  );
}
