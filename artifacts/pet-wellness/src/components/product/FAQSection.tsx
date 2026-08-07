import React, { useState } from 'react';
import { FAQ } from '@/data/products';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-serif mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm">Everything you need to know about this product.</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-border/50 rounded-2xl overflow-hidden bg-background">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-card/50 transition-colors"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                >
                  <span className="font-medium pr-4">{faq.question}</span>
                  {openId === faq.id ? <ChevronUp size={20} className="flex-shrink-0" /> : <ChevronDown size={20} className="flex-shrink-0" />}
                </button>
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {/* CMS Rich Text Placeholder rendering */}
                      <div 
                        className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

