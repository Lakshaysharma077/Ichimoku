'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Is Ichimoku a lagging indicator?",
    a: "While parts of the system use past data, the Senkou Spans are projected forward into the future to identify potential future support and resistance zones. It is a lead-lag hybrid system designed for comprehensive market context."
  },
  {
    q: "Which timeframe works best for Ichimoku?",
    a: "Originally developed for the daily timeframe, Ichimoku is fractal and works on any timeframe. However, the signals are strongest on Higher Timeframes (4H, Daily, Weekly) where market noise is reduced."
  },
  {
    q: "Can I use Ichimoku for Crypto trading?",
    a: "Absolutely. Many crypto traders use 'doubled' settings (20, 60, 120, 30) to account for the 24/7 nature of crypto markets, though the original 9, 26, 52 settings remain effective."
  },
  {
    q: "What is the most important signal in the system?",
    a: "The location of price relative to the Cloud is the most fundamental signal. Everything else—TK crosses, Chikou alignment—serves as secondary confirmation to that primary trend."
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-32 py-24">
      <div className="flex flex-col gap-12 max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="syne font-bold text-xs uppercase tracking-[0.3em] text-[#fbe178]">Questions</span>
          <h2 className="syne font-extrabold text-4xl text-text-primary tracking-tighter">
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
                    <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-border/50 pt-4">
                      {faq.a}
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
