'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border-b border-border">
          <button
            onClick={() => toggle(item.id)}
            className="flex items-center justify-between w-full py-4 text-left group"
            aria-expanded={openId === item.id}
          >
            <div className="flex flex-col gap-1.5 flex-1 pr-4">
              {item.category && (
                <span className="inline-flex self-start px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-full bg-accent/10 text-accent border border-accent/20">
                  {item.category}
                </span>
              )}
              <span className="text-lg font-medium syne text-text-primary group-hover:text-accent transition-colors">
                {item.question}
              </span>
            </div>
            <motion.div
              animate={{ rotate: openId === item.id ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-text-muted" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pb-6 text-text-secondary leading-relaxed whitespace-pre-line">
                  {item.answer.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
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
  );
}
