import { Link } from 'wouter';
import { Instagram, Linkedin, Youtube, MessageCircle, Mail, ArrowRight, Sparkles, Facebook } from 'lucide-react';
import React, { useState } from 'react';

import { toast } from 'sonner';

export default function Footer() {
  const [email, setEmail] = useState('');
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      try {
        const res = await fetch('/api/telegram-notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type: 'newsletter' })
        });
        
        if (!res.ok) {
          throw new Error("Failed to subscribe");
        }
        
        toast.success("Subscribed successfully!");
        setEmail('');
      } catch (err) {
        console.error("Subscription error", err);
        toast.error("Failed to subscribe. Please try again.");
      }
    }
  };

  return (
    <>
      <footer className="bg-[#12333B] text-[#F7F5F2] border-t border-[#B89D5D]/20 pt-20 pb-8 animate-in fade-in duration-700 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1 - Logo & About */}
          <div className="lg:col-span-2 flex flex-col">
            <Link href="/" className="mb-6 inline-block">
              <img src="/logo.png" alt="Ancestral Essence" className="w-[150px] h-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm font-light leading-relaxed mb-8">
              Premium pet nutrition inspired by nature and crafted with carefully selected ingredients to support healthier, happier lives.
            </p>
            <div className="space-y-2 mb-8 text-sm font-light">
              <p>wildigourmet@gmail.com</p>
              <p>+91 96330 07591</p>
            </div>

          </div>

          {/* Column 2 - Company */}
          <div>
            <h4 className="text-[#B89D5D] font-serif text-lg mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm font-light">
              <li>
                <Link href="/about" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/shop" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Shop
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/journal" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  The Ancestral Journal
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-[#B89D5D] font-serif text-lg mb-6">Support</h4>
            <ul className="flex flex-col gap-4 text-sm font-light">
              <li>
                <Link href="/faqs" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  FAQ
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Customer Support
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/legal/shipping-policy" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Shipping & Delivery
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/legal/refund-return-policy" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Returns & Refunds
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="text-[#B89D5D] font-serif text-lg mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm font-light">
              <li>
                <Link href="/legal/terms-conditions" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Terms & Conditions
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Privacy Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Rewards */}
          <div>
            <h4 className="text-[#B89D5D] font-serif text-lg mb-6">Rewards</h4>
            <ul className="flex flex-col gap-4 text-sm font-light">
              <li>
                <Link href="/referrals" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Referral & Discounts
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/legal/loyalty-program" className="relative group hover:text-[#E38B2C] transition-colors duration-300">
                  Loyalty Program
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#E38B2C] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Newsletter - Centered below grid */}
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto mb-16">
          <h4 className="text-[#B89D5D] font-serif text-xl mb-4">Join Our Community</h4>
          <p className="text-sm font-light leading-relaxed mb-6">
            Get product updates, exclusive offers, and pet wellness tips.
          </p>
          <form onSubmit={handleSubscribe} className="relative w-full">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              className="w-full bg-transparent border border-[#B89D5D] rounded-full h-12 pl-6 pr-12 text-sm text-[#F7F5F2] outline-none focus:border-[#E38B2C] transition-colors text-left"
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 w-10 bg-[#E38B2C] hover:bg-[#C77722] text-[#F7F5F2] rounded-full flex items-center justify-center transition-colors duration-300">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Stay Connected Section */}
        <div className="mt-16 mb-8 flex flex-col items-center justify-center">
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-10 w-full">
            <div className="h-[1px] bg-gradient-to-r from-transparent to-[#B89D5D]/50 w-24"></div>
            <Sparkles className="text-[#B89D5D]" size={16} />
            <div className="h-[1px] bg-gradient-to-l from-transparent to-[#B89D5D]/50 w-24"></div>
          </div>

          <h4 className="text-[#D7D2C9] font-serif text-xl mb-8">Stay Connected</h4>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-12">
            <a href="https://www.instagram.com/ancestralessence.petnutrition" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border/20 flex items-center justify-center hover:bg-[#E38B2C] hover:border-[#E38B2C] transition-colors group p-2">
              <img src="/Instagram.png" alt="Instagram" className="w-full h-full object-contain filter invert opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all" />
            </a>
            <a href="https://www.linkedin.com/company/wildi-gourmet/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border/20 flex items-center justify-center hover:bg-[#E38B2C] hover:border-[#E38B2C] transition-colors group p-2">
              <img src="/linkedin.png" alt="LinkedIn" className="w-full h-full object-contain filter invert opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all" />
            </a>
            <a href="https://www.youtube.com/@ancestralessence" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border/20 flex items-center justify-center hover:bg-[#E38B2C] hover:border-[#E38B2C] transition-colors group p-2">
              <img src="/youtube.png" alt="YouTube" className="w-full h-full object-contain filter invert opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all" />
            </a>
            <a href="https://wa.me/919633007591" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border/20 flex items-center justify-center hover:bg-[#E38B2C] hover:border-[#E38B2C] transition-colors group p-2">
              <img src="/whatsapp.png" alt="WhatsApp" className="w-full h-full object-contain filter invert opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all" />
            </a>
            <a href="mailto:wildigourmet@gmail.com" className="w-12 h-12 rounded-full border border-border/20 flex items-center justify-center hover:bg-[#E38B2C] hover:border-[#E38B2C] transition-colors group p-2">
              <img src="/email.png" alt="Email" className="w-full h-full object-contain filter invert opacity-80 group-hover:filter-none group-hover:opacity-100 transition-all" />
            </a>
          </div>

          <div className="text-center mb-8">
            <span className="text-sm font-light text-[#D7D2C9]">
              Crafted with <span className="text-[#B89D5D]">💛</span> for discerning pet families worldwide
            </span>
          </div>

          {/* Copyright Box */}
          <div className="w-full max-w-2xl mx-auto border border-[#B89D5D]/20 rounded-xl p-6 text-center bg-[#12333B]/50">
            <p className="text-[#F7F5F2] text-sm">Ancestral Essence a product of Wild Gourmet</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#B89D5D]/20 flex flex-col md:flex-row justify-between items-center text-sm font-light text-center gap-4">
          <p className="text-center w-full text-[#F7F5F2]">© 2026 Ancestral Essence. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
    </>
  );
}
