'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import EditableElement from '../admin/EditableElement';

export default function HeroSection() {
  const hero = useContent('hero');
  const words = hero.headline;
  
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-muted mb-6 block"
          >
            <EditableElement section="hero" path={['tagline']} content={hero.tagline} />
          </motion.span>
          
          <h1 className="syne font-extrabold text-4xl lg:text-[52px] text-text-primary mb-10 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                className={`inline-block mr-[0.2em] relative ${word === 'Market' ? 'text-accent' : ''}`}
              >
                <EditableElement section="hero" path={['headline', i.toString()]} content={word} />
                {word === 'Market' && (
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    viewBox="0 0 100 10"
                    className="absolute -bottom-2 left-0 w-full h-2 text-accent"
                  >
                    <path
                      d="M0 5 Q 50 10 100 5"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                )}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-base text-text-secondary max-w-md leading-relaxed mb-10"
          >
            <EditableElement section="hero" path={['description']} content={hero.description} />
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-wrap items-center gap-5 mb-14"
          >
            <Link href={hero.buttons.primary.href}>
              <Button size="lg">
                <EditableElement section="hero" path={['buttons', 'primary', 'text']} content={hero.buttons.primary.text} />
              </Button>
            </Link>
            <Link
              href={hero.buttons.secondary.href}
              className="text-[11px] font-medium uppercase tracking-[0.15em] text-text-secondary hover:text-text-primary transition-colors duration-200 font-mono"
            >
              <EditableElement section="hero" path={['buttons', 'secondary', 'text']} content={hero.buttons.secondary.text} />
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-6"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary">
                <EditableElement section="hero" path={['trustBadges', 'rating']} content={hero.trustBadges.rating} />
              </span>
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
                <EditableElement section="hero" path={['trustBadges', 'traders']} content={hero.trustBadges.traders} />
              </span>
            </div>
            <div className="h-6 w-px bg-border" />
            <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
              <EditableElement section="hero" path={['trustBadges', 'platform']} content={hero.trustBadges.platform} />
            </span>
          </motion.div>
        </div>
        
        {/* Right Column - Indicator Visualization */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10"
          >
            <div className="aspect-[4/5] bg-bg-secondary/60 rounded-xl border border-border p-6 relative overflow-hidden">
              {/* Subtle chart bars background */}
              <div className="absolute inset-0 opacity-[0.06] flex items-end gap-1 p-4">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-full rounded-sm ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ height: `${20 + Math.random() * 60}%` }} 
                  />
                ))}
              </div>
              
              {/* Stat Cards */}
              <div className="relative space-y-4">
                <div className="flex justify-between items-center mb-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-accent text-bg-primary px-3 py-1 text-[10px] font-bold syne uppercase tracking-tighter"
                  >
                    <EditableElement section="hero" path={['mockup', 'badge']} content={hero.mockup.badge} />
                  </motion.div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                {hero.mockup.stats.map((stat: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.2 }}
                    className="bg-bg-tertiary/40 p-4 border border-border rounded-lg"
                  >
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">
                      <EditableElement section="hero" path={['mockup', 'stats', i.toString(), 'label']} content={stat.label} />
                    </span>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold syne ${i === 1 ? 'text-accent' : i === 0 ? 'text-emerald-500' : 'text-text-primary'}`}>
                        <EditableElement section="hero" path={['mockup', 'stats', i.toString(), 'value']} content={stat.value} />
                      </span>
                      <span className="text-xs text-text-secondary">
                        <EditableElement section="hero" path={['mockup', 'stats', i.toString(), 'sub']} content={stat.sub} />
                      </span>
                    </div>
                  </motion.div>
                ))}
                
                {/* Line chart */}
                <div className="mt-10 relative h-20">
                  <svg viewBox="0 0 400 100" className="w-full h-full text-emerald-500 overflow-visible">
                    <motion.path
                      d="M0 80 Q 50 60, 100 70 T 200 40 T 300 50 T 400 10"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />
                    <motion.circle
                      cx="400" cy="10" r="5"
                      fill="currentColor"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: [1, 1.4, 1] }}
                      transition={{ 
                        opacity: { delay: 3.5 },
                        scale: { delay: 3.5, duration: 2, repeat: Infinity }
                      }}
                    />
                  </svg>
                  <div className="absolute -right-2 top-0 text-[9px] font-mono font-medium text-emerald-500 uppercase">
                    <EditableElement section="hero" path={['mockup', 'chikouLabel']} content={hero.mockup.chikouLabel} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
