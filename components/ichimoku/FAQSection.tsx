'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "What is Ichimoku Edge?",
    a: "Ichimoku Edge is a suite of TradingView tools built around the Ichimoku Kinkō Hyō system. The goal is to make Ichimoku analysis clearer, more structured, and easier to apply in real market conditions through clean visuals, dashboards, and multi-timeframe tools."
  },
  {
    q: "What is the \"Samurai Vision\" philosophy?",
    a: "Samurai Vision is our core trading approach: disciplined, structured, and systematic. We use Ichimoku not as a simple standalone indicator, but as a complete market analysis framework: cloud position, momentum, and confirmation working together."
  },
  {
    q: "Does it work on stocks, crypto, and forex?",
    a: "Yes. Ichimoku can be applied to many liquid markets, including stocks, crypto, forex, indices, futures, and commodities. It works best when there is enough liquidity and clean price structure."
  },
  {
    q: "Do Ichimoku Edge indicators repaint?",
    a: "The core Ichimoku calculations do not repaint when based on confirmed candle data. For conservative analysis, we recommend using closed-candle confirmation mode, which is available in our tools."
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-32 py-24">
      <div className="flex flex-col gap-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="syne font-bold text-xs uppercase tracking-[0.3em] text-[#fbe178]">Questions</span>
          <h2 className="syne font-extrabold text-4xl text-text-primary">
            The Ichimoku <span className="text-[#fbe178]">Debrief.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'bg-bg-secondary border-[#fbe178]/30 shadow-[0_0_30px_rgba(251,225,120,0.05)]' : 'bg-transparent'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left group"
              >
                <span className={`syne font-bold text-lg transition-colors ${openIndex === i ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-[#fbe178]' : 'text-text-muted'}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-border/50 pt-4 whitespace-pre-line">
                      {faq.a.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                        if (part.match(/^https?:\/\//)) {
                          return (
                            <a 
                              key={index} 
                              href={part} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-accent hover:underline break-all"
                            >
                              {part}
                            </a>
                          );
                        }
                        return part;
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
