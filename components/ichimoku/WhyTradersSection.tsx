'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Activity, ArrowDownCircle, Zap, Shield, Target } from 'lucide-react';

const features = [
  { 
    title: 'Trend Direction', 
    desc: 'Instantly identify if the market is bullish, bearish, or neutral based on price location relative to the cloud.', 
    icon: TrendingUp,
  },
  { 
    title: 'Momentum Shifts', 
    desc: 'The Tenkan/Kijun cross provides early warnings of explosive momentum before it reflects in price action.', 
    icon: Activity,
  },
  { 
    title: 'Pullback Zones', 
    desc: 'Identify high-probability entry points by watching how price interacts with the Kijun-sen during trends.', 
    icon: ArrowDownCircle,
  },
  { 
    title: 'Breakout Conditions', 
    desc: 'The thickness and angle of the Kumo predict the strength of potential breakouts or trend continuations.', 
    icon: Zap,
  },
  { 
    title: 'Dynamic Support', 
    desc: 'Unlike static levels, Ichimoku lines move with the market, providing real-time institutional floors and ceilings.', 
    icon: Shield,
  },
  { 
    title: 'Trade Invalidation', 
    desc: 'Clear, objective rules for when a thesis is no longer valid, protecting your capital from emotional bias.', 
    icon: Target,
  },
];

export default function WhyTradersSection() {
  return (
    <section id="why" className="scroll-mt-32 py-24">
      <div className="flex flex-col gap-12">
        <div className="inline-flex items-center gap-4">
          <div className="h-px w-12 bg-border" />
          <span className="txt-label tracking-[0.3em]">Edge</span>
        </div>

        <h2 className="syne font-extrabold text-4xl lg:text-5xl text-text-primary leading-tight">
          Why Professional Traders <br /> <span className="text-accent">Rely on Ichimoku.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative p-8 bg-bg-secondary border border-border rounded-2xl group overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-border">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="syne font-bold text-xl text-text-primary mb-4">{feature.title}</h3>
                <p className="text-sm txt-body leading-relaxed">{feature.desc}</p>
              </div>

              {/* Animated Corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-accent/10 translate-x-4 translate-y-4 rotate-45 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
