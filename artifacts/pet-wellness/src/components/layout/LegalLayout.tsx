import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/cart/CartDrawer';

interface TocItem {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  seoTitle: string;
  seoDescription: string;
  toc?: TocItem[];
  children: React.ReactNode;
}

export default function LegalLayout({ 
  title, 
  lastUpdated, 
  seoTitle, 
  seoDescription, 
  toc = [],
  children 
}: LegalLayoutProps) {

  // SEO Management
  useEffect(() => {
    document.title = seoTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoDescription);

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOGTag('og:title', seoTitle);
    updateOGTag('og:description', seoDescription);
    updateOGTag('og:type', 'website');
    updateOGTag('og:url', window.location.href);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Cleanup function not strictly necessary for SPA unless we want to revert, 
    // but the next page will just overwrite these.
  }, [seoTitle, seoDescription]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // offset for sticky navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F2]">
      <Navbar />
      <CartDrawer />

      {/* Luxury Header Banner */}
      <div className="pt-32 pb-16 bg-[#12333B] text-[#F7F5F2] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <p className="text-sm font-medium tracking-widest uppercase text-[#B89D5D] mb-4">
            Official Document
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 drop-shadow-md">{title}</h1>
          <p className="text-sm font-light tracking-widest uppercase text-[#D7D2C9]">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      <main className="flex-grow pb-24 -mt-8">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="bg-white/80 backdrop-blur-md border border-white shadow-2xl rounded-[2.5rem] p-8 md:p-16 relative z-20">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
            
            {/* Sticky Table of Contents (Desktop) */}
            {toc.length > 0 && (
              <aside className="hidden lg:block w-64 shrink-0 sticky top-32">
                <div className="pr-8 border-r border-border/40">
                  <h4 className="font-serif text-lg mb-6 text-[#12333B]">Contents</h4>
                  <ul className="space-y-4">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a 
                          href={`#${item.id}`} 
                          onClick={(e) => scrollToSection(e, item.id)}
                          className="text-sm text-muted-foreground hover:text-[#E38B2C] transition-colors line-clamp-2"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            {/* Main Content Area */}
            <article className="flex-1 w-full max-w-3xl prose prose-neutral prose-headings:font-serif prose-headings:text-[#12333B] prose-a:text-[#B89D5D] prose-a:no-underline hover:prose-a:underline prose-p:font-light prose-p:leading-relaxed prose-li:font-light">
              {children}
            </article>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
