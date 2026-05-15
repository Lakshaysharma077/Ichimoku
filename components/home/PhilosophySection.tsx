'use client';

import { motion } from 'framer-motion';
import KanjiWatermark from '../shared/KanjiWatermark';
import ScrollReveal from '../shared/ScrollReveal';
import BilingualHover from '../shared/BilingualHover';
import { useContent } from '@/hooks/useContent';
import EditableElement from '../admin/EditableElement';

export default function PhilosophySection() {
  const philosophy = useContent('philosophy');
  return (
    <section className="relative py-16 overflow-hidden">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left spacer for layout asymmetry */}
          <div className="hidden lg:block lg:w-1/4" />
          
          <div className="lg:w-3/4">
            <ScrollReveal>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-text-muted mb-4 block">
                <EditableElement section="philosophy" path={['label']} content={philosophy.label} />
              </span>
              <h2 className="syne font-bold text-4xl lg:text-5xl text-text-primary leading-tight mb-12 max-w-2xl">
                <EditableElement section="philosophy" path={['heading']} content={philosophy.heading} />
              </h2>
            </ScrollReveal>
            
            <div className="space-y-8 text-lg text-text-secondary leading-relaxed max-w-2xl mb-12">
              {philosophy.paragraphs.map((para: string, i: number) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <EditableElement section="philosophy" path={['paragraphs', i.toString()]} content={para} as="p" />
                </ScrollReveal>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {philosophy.pillars.map((pillar: any, i: number) => (
                <ScrollReveal key={i} delay={0.4 + i * 0.1}>
                  <div className="p-6 bg-bg-secondary border border-border rounded-xl group hover:border-accent transition-colors duration-300">
                    <span className="text-4xl block mb-4 grayscale group-hover:grayscale-0 transition-all">
                      <EditableElement section="philosophy" path={['pillars', i.toString(), 'icon']} content={pillar.icon} />
                    </span>
                    <h4 className="syne font-bold text-xl text-text-primary mb-2 uppercase tracking-tight">
                      <EditableElement section="philosophy" path={['pillars', i.toString(), 'title']} content={pillar.title} />
                    </h4>
                    <p className="text-sm text-text-secondary">
                      <EditableElement section="philosophy" path={['pillars', i.toString(), 'text']} content={pillar.text} />
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
