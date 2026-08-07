import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { MapPin, Phone, Mail, Clock, HelpCircle, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import { trackMetaEvent } from '@/lib/metaTracking';

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us | Ancestral Essence";
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Contact Ancestral Essence for inquiries, support, or veterinary consultations.');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F2]">
      <Navbar />
      <CartDrawer />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif text-[#12333B] mb-4">Contact Ancestral Essence</h1>
            <p className="text-muted-foreground font-light text-lg">
              Questions? Consider us your personal Pet Concierge. From instant shipping updates to the finer details of our formulas, our dedicated support team is here to deliver total peace of mind. For quick responses, connect with us instantly via WhatsApp. For detailed inquiries regarding your order, delivery, or custom nutrition requests, reach out via Email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Left: Info */}
            <div className="space-y-12">
              <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
                <h3 className="font-serif text-[#12333B] text-2xl mb-8">Direct Contact</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-[#B89D5D]" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-[#12333B]">Email</p>
                      <a href="mailto:wildigourmet@gmail.com" className="text-muted-foreground hover:text-[#E38B2C] transition-colors">
                        wildigourmet@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-[#B89D5D]" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-[#12333B]">Phone</p>
                      <a href="tel:+919633007591" className="text-muted-foreground hover:text-[#E38B2C] transition-colors">
                        +91 96330 07591
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center shrink-0">
                      <Clock size={18} className="text-[#B89D5D]" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-[#12333B]">Business Hours</p>
                      <p className="text-muted-foreground">Monday - Saturday<br/>9:00 AM - 7:00 PM IST</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#F7F5F2] flex items-center justify-center shrink-0">
                      <HelpCircle size={18} className="text-[#B89D5D]" />
                    </div>
                    <div>
                      <p className="font-medium mb-1 text-[#12333B]">Commitment</p>
                      <p className="text-muted-foreground text-sm">We are dedicated to providing exceptional, luxury-tier service at every single step of your journey with us.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#12333B] rounded-3xl flex flex-col items-center justify-center text-center p-8 text-white">
                <HelpCircle size={32} className="text-[#B89D5D] mb-4" />
                <h4 className="font-serif text-xl mb-3">Have a Quick Question?</h4>
                <p className="text-[#D7D2C9] font-light mb-6 text-sm">
                  Check our Frequently Asked Questions to see if we've already answered it!
                </p>
                <Link href="/faqs" className="inline-block border border-[#B89D5D] text-[#B89D5D] hover:bg-[#E38B2C] hover:text-white px-6 py-2 rounded-full font-medium transition-colors">
                  Read FAQs
                </Link>
              </div>
            </div>

            {/* Right: WhatsApp CTA */}
            <div className="bg-[#12333B] text-white p-8 md:p-12 rounded-3xl border border-border shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
              
              <div className="w-20 h-20 rounded-full bg-[#3B4732] flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle size={40} className="text-[#B89D5D]" />
              </div>
              
              <h3 className="font-serif text-3xl mb-4 relative z-10">Your Pet Concierge</h3>
              <p className="text-[#D7D2C9] font-light mb-8 text-lg max-w-sm relative z-10">
                For the fastest response regarding orders, shipping updates, or custom nutritional advice, reach out to us instantly via WhatsApp.
              </p>
              
              <a 
                href="https://wa.me/919633007591" 
                target="_blank" 
                rel="noreferrer"
                onClick={() => {
                  trackMetaEvent({ eventName: 'Contact' });
                }}
                className="w-full sm:w-auto py-4 px-12 bg-[#E38B2C] text-white rounded-full font-medium hover:bg-[#B89658] transition-all hover:shadow-[0_0_20px_rgba(198,156,69,0.4)] relative z-10 text-lg flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                Message on WhatsApp
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
