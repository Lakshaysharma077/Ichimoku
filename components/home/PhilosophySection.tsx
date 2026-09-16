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
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Text Content */}
          <div className="lg:w-7/12">
            <ScrollReveal>
              <span className="txt-label tracking-[0.3em] mb-4 block">
                <EditableElement section="philosophy" path={['label']} content={philosophy.label} />
              </span>
              <h2 className="syne font-bold text-4xl lg:text-5xl text-text-primary leading-tight mb-10">
                <EditableElement section="philosophy" path={['heading']} content={philosophy.heading} />
              </h2>
            </ScrollReveal>
            
            <div className="space-y-6 text-lg txt-body">
              {philosophy.paragraphs.map((para: string, i: number) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <EditableElement section="philosophy" path={['paragraphs', i.toString()]} content={para} as="p" />
                </ScrollReveal>
              ))}
            </div>
          </div>
          
          {/* Right Column: Vertical Pillars */}
          <div className="lg:w-5/12 w-full flex flex-col gap-6 mt-8 lg:mt-0">
            {philosophy.pillars.map((pillar: any, i: number) => (
              <ScrollReveal key={i} delay={0.4 + i * 0.1}>
                <div className="p-6 bg-bg-secondary border border-border rounded-xl group hover:border-accent transition-all duration-300 flex items-start gap-5">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all shrink-0 mt-1">
                    <EditableElement section="philosophy" path={['pillars', i.toString(), 'icon']} content={pillar.icon} />
                  </span>
                  <div>
                    <h4 className="syne font-bold text-lg text-text-primary mb-2 uppercase tracking-tight">
                      <EditableElement section="philosophy" path={['pillars', i.toString(), 'title']} content={pillar.title} />
                    </h4>
                    <p className="text-[13px] leading-relaxed txt-muted">
                      <EditableElement section="philosophy" path={['pillars', i.toString(), 'text']} content={pillar.text} />
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
