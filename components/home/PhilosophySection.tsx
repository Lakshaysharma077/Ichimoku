'use client';

import { motion } from 'framer-motion';
import KanjiWatermark from '../shared/KanjiWatermark';
import ScrollReveal from '../shared/ScrollReveal';
import BilingualHover from '../shared/BilingualHover';

const pillars = [
  { icon: '⚔', title: 'Discipline', subtitle: '規律', text: 'Follow the system, not your emotions.' },
  { icon: '🎯', title: 'Structure', subtitle: '構造', text: 'The cloud never lies. The trend is clear.' },
  { icon: '⏱', title: 'Speed', subtitle: '速度', text: 'Dashboards built to save you hours daily.' },
];

export default function PhilosophySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <KanjiWatermark kanji="武士道" className="left-[-5%] top-1/2 -translate-y-1/2 opacity-[0.03]" size="30vw" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left spacer for layout asymmetry */}
          <div className="hidden lg:block lg:w-1/4" />
          
          <div className="lg:w-3/4">
            <ScrollReveal>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-text-muted mb-4 block">
                THE PHILOSOPHY — 哲学
              </span>
              <h2 className="syne font-bold text-4xl lg:text-5xl text-text-primary leading-tight mb-12 max-w-2xl">
                Trading demands the <BilingualHover english="discipline" japanese="規律" /> of a <BilingualHover english="Samurai" japanese="侍" />.
              </h2>
            </ScrollReveal>
            
            <div className="space-y-8 text-lg text-text-secondary leading-relaxed max-w-2xl mb-20">
              <ScrollReveal delay={0.1}>
                <p>
                  The Ichimoku system was not built for guessing. It was built for clarity. Like a Samurai who sees the battlefield before the enemy moves, the Ichimoku Edge indicator reveals market structure before price confirms.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p>
                  We do not chase signals. We read the cloud, the baseline, and the conversion line together — as a unified system. No indicator overload. No noise. Just structure.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <p>
                  Samurai Vision means you act from a position of knowledge, not fear. Every entry has a reason. Every exit has a plan.
                </p>
              </ScrollReveal>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, i) => (
                <ScrollReveal key={i} delay={0.4 + i * 0.1}>
                  <div className="p-8 bg-bg-secondary border border-border rounded-xl group hover:border-accent transition-colors duration-300">
                    <span className="text-4xl block mb-6 grayscale group-hover:grayscale-0 transition-all">{pillar.icon}</span>
                    <h4 className="syne font-bold text-xl text-text-primary mb-1 uppercase tracking-tight">{pillar.title}</h4>
                    <span className="shippori-mincho text-sm text-text-muted block mb-4">{pillar.subtitle}</span>
                    <p className="text-sm text-text-secondary">{pillar.text}</p>
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
