'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';

import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';
import EditableList from '@/components/admin/EditableList';
import { useEditStore } from '@/lib/store/useEditStore';

export default function GlossaryPage() {
  const searchParams = useSearchParams();
  const [isExtended, setIsExtended] = useState(false);
  const glossary = useContent('glossary');
  const { isEditMode } = useEditStore();

  useEffect(() => {
    if (searchParams.get('mode') === 'extended') {
      setIsExtended(true);
    }
  }, [searchParams]);

  const filteredData = isExtended 
    ? glossary.data 
    : glossary.data.filter((item: any) => glossary.mainWords.includes(item.romanized));

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">

      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-4xl lg:text-6xl text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="glossary" path={['heading']} content={glossary.heading} />
            </h1>
          </ScrollReveal>

          {/* Toggle Switch */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                <EditableElement section="glossary" path={['toggleLabels', 'label']} content={glossary.toggleLabels.label} />
              </span>
              <div 
                onClick={() => setIsExtended(!isExtended)}
                className="relative w-48 h-12 bg-bg-secondary/50 backdrop-blur-md rounded-2xl border border-border/50 p-1 cursor-pointer group"
              >
                <div className="absolute inset-0 flex">
                  <div className="flex-1 flex items-center justify-center z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${!isExtended ? 'text-[#0c101f]' : 'text-text-muted group-hover:text-text-primary'}`}>
                      <EditableElement section="glossary" path={['toggleLabels', 'main']} content={glossary.toggleLabels.main} />
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isExtended ? 'text-[#0c101f]' : 'text-text-muted group-hover:text-text-primary'}`}>
                      <EditableElement section="glossary" path={['toggleLabels', 'extended']} content={glossary.toggleLabels.extended} />
                    </span>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#fbe178] rounded-[12px] shadow-[0_0_15px_rgba(251,225,120,0.3)]"
                  animate={{ x: isExtended ? '100%' : '0%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Content List - Professional Table */}
        <div className="bg-bg-secondary/20 backdrop-blur-2xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-3 px-8 py-5 bg-white/[0.04] border-b border-white/5">
            <span className="text-[11px] font-mono font-bold text-accent uppercase tracking-[0.25em]">
              Romanized Japanese
            </span>
            <span className="text-[11px] font-mono font-bold text-accent uppercase tracking-[0.25em]">
              Japanese
            </span>
            <span className="text-[11px] font-mono font-bold text-accent uppercase tracking-[0.25em]">
              English Translation
            </span>
          </div>

          <div className="flex flex-col">
            <EditableList
              section="glossary"
              path={['data']}
              items={glossary.data as any}
              newItemTemplate={{ romanized: "New Term", japanese: "新用語", english: "New translation" }}
              renderItem={(item: any, i: number) => {
                const isVisible = isExtended || glossary.mainWords.includes(item.romanized);
                if (!isVisible && !isEditMode) return null;

                return (
                  <div 
                    key={i}
                    className="md:grid md:grid-cols-3 flex flex-col gap-4 px-8 py-6 border-b border-white/[0.03] last:border-0 items-center"
                  >
                    {/* Romanized */}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[15px] font-bold text-accent uppercase tracking-tight">
                        <EditableElement section="glossary" path={['data', i.toString(), 'romanized']} content={item.romanized} />
                      </span>
                    </div>

                    {/* Japanese */}
                    <div className="flex items-center relative z-10">
                      <span className="shippori-mincho text-[15px] font-bold text-accent">
                        <EditableElement section="glossary" path={['data', i.toString(), 'japanese']} content={item.japanese} />
                      </span>
                    </div>

                    {/* English */}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[15px] font-bold text-accent uppercase tracking-tight">
                        <EditableElement section="glossary" path={['data', i.toString(), 'english']} content={item.english} />
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">
              Showing {filteredData.length} Terms
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
