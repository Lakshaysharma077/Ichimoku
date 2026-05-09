'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import KanjiWatermark from '../shared/KanjiWatermark';
import Link from 'next/link';

export default function HeroSection() {
  const words = ["See", "the", "Market", "Clearly."];
  
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-20">
      <KanjiWatermark kanji="一目" className="bottom-0 right-[-5%] opacity-[0.04]" size="45vw" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase text-text-muted mb-4"
          >
            Professional Trading Tools — Since 2021
          </motion.span>
          
          <h1 className="syne font-extrabold text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] text-text-primary mb-6">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                className={`inline-block mr-[0.2em] relative ${word === 'Market' ? 'text-accent' : ''}`}
              >
                {word}
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
            transition={{ duration: 0.5, delay: 0.8 }}
            className="shippori-mincho text-xl text-text-muted mb-6"
          >
            市場を明確に見る
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-lg text-text-secondary max-w-lg leading-relaxed mb-10"
          >
            The Ichimoku Edge indicator suite transforms complex Ichimoku Kinko Hyo signals into instant, actionable intelligence. Built for traders who value discipline over noise.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href="/pricing">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/tools">
              <Button variant="outline" size="lg">View Indicators</Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex items-center gap-6"
          >
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary">★★★★★</span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
                Trusted by 1,200+ traders on TradingView
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              Available on TradingView Pine Script v5
            </span>
          </motion.div>
        </div>
        
        {/* Right Column - Mockup */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative z-10"
          >
            {/* Stylized Dashboard Mockup - Liquid Glass Style */}
            <div className="aspect-[4/5] bg-bg-secondary/80 backdrop-blur-[30px] rounded-2xl border border-border shadow-2xl p-6 relative overflow-hidden group">
              {/* Fake Chart Background */}
              <div className="absolute inset-0 opacity-10 flex items-end gap-1 p-4">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-full rounded-sm ${i % 3 === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ height: `${20 + Math.random() * 60}%` }} 
                  />
                ))}
              </div>

              {/* Inner glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
              
              {/* Stat Cards Overlay */}
              <div className="relative space-y-4">
                <div className="flex justify-between items-center mb-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-accent text-bg-primary px-3 py-1 text-[10px] font-bold syne uppercase tracking-tighter"
                  >
                    ICHIMOKU EDGE PRO
                  </motion.div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                {[
                  { label: "Cloud Signal", value: "BULLISH ▲", sub: "Strong Confirmation", color: "text-emerald-500" },
                  { label: "TK Cross", value: "ACTIVE", sub: "Bullish Breakout", color: "text-accent" },
                  { label: "Kumo Twist", value: "3 BARS", sub: "Recent Change", color: "text-text-primary" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.2 }}
                    className="bg-bg-tertiary/60 backdrop-blur-xl p-4 border border-border rounded-xl shadow-xl hover:bg-bg-tertiary/80 transition-all duration-300 group/card relative overflow-hidden"
                  >
                    {/* Inner glass glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity" />
                    
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1 relative z-10">{stat.label}</span>
                    <div className="flex items-center justify-between relative z-10">
                      <span className={`text-lg font-bold syne ${stat.color}`}>{stat.value}</span>
                      <span className="text-xs text-text-secondary">{stat.sub}</span>
                    </div>
                  </motion.div>
                ))}
                
                {/* Visual Line */}
                <div className="mt-12 relative h-20">
                  <svg viewBox="0 0 400 100" className="w-full h-full text-emerald-500 overflow-visible">
                    <motion.path
                      d="M0 80 Q 50 60, 100 70 T 200 40 T 300 50 T 400 10"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />
                    <motion.circle
                      cx="400" cy="10" r="6"
                      fill="currentColor"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: [1, 1.5, 1] }}
                      transition={{ 
                        opacity: { delay: 3.5 },
                        scale: { delay: 3.5, duration: 2, repeat: Infinity }
                      }}
                    />
                  </svg>
                  <div className="absolute -right-2 top-0 text-[10px] font-mono font-bold text-emerald-500 uppercase">Chikou Span</div>
                </div>
              </div>
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-accent/5 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
