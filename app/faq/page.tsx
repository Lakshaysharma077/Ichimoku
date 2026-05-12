'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Search, ChevronDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';
import EditableList from '@/components/admin/EditableList';
import { useEditStore } from '@/lib/store/useEditStore';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  
  const faq = useContent('faq');
  const { isEditMode } = useEditStore();

  const categories = ["All", ...Array.from(new Set(faq.data.flatMap((f: any) => f.categories)))];

  const filteredFaqs = faq.data.filter((f: any) => {
    const matchesCategory = activeCategory === "All" || f.categories.includes(activeCategory);
    const matchesSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Map the internal data format to the Accordion item format
  const accordionItems = filteredFaqs.map(faq => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <div className="pt-40 pb-24 relative overflow-hidden">

      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-4xl lg:text-6xl text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Frequently Asked Questions
            </h1>
          </ScrollReveal>
        </div>

        {/* Search Bar */}
        <ScrollReveal delay={0.1}>
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-2xl py-4 pl-12 pr-6 text-text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </ScrollReveal>

        {/* Categories */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat: any) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-accent text-bg-primary' 
                    : 'bg-bg-secondary text-text-muted hover:text-text-primary border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="bg-bg-primary border border-border rounded-3xl p-8 min-h-[400px]">
            <EditableList
              section="faq"
              path={['data']}
              items={faq.data as any}
              newItemTemplate={{ question: "New Question", answer: "New Answer", categories: ["General"] }}
              renderItem={(item: any, i: number) => {
                const matchesCategory = activeCategory === "All" || item.categories.includes(activeCategory);
                const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
                
                if (!matchesCategory || !matchesSearch) {
                  if (!isEditMode) return null;
                }

                const isOpen = openId === i;

                return (
                  <div key={i} className="border-b border-border last:border-0">
                    <button
                      onClick={() => setOpenId(isOpen ? null : i)}
                      className="flex items-center justify-between w-full py-6 text-left group"
                    >
                      <div className="flex flex-col gap-1.5 flex-1 pr-4">
                        <span className="text-lg font-medium syne text-text-primary group-hover:text-accent transition-colors">
                          <EditableElement section="faq" path={['data', i.toString(), 'question']} content={item.question} />
                        </span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="w-5 h-5 text-text-muted" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 text-text-secondary leading-relaxed whitespace-pre-line">
                            <EditableElement section="faq" path={['data', i.toString(), 'answer']} content={item.answer} as="div" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }}
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
