'use client';

import { motion } from 'framer-motion';

const components = [
  { 
    name: 'Tenkan-sen', 
    kanji: '転換線', 
    eng: 'Conversion Line', 
    period: '9 Periods',
    role: 'Momentum & Entry Signal',
    desc: 'The midpoint of the highest high and lowest low over the last 9 periods. It acts as a minor support/resistance and a trigger for momentum shifts.',
    color: '#00B4D8' 
  },
  { 
    name: 'Kijun-sen', 
    kanji: '基準線', 
    eng: 'Base Line', 
    period: '26 Periods',
    role: 'Trend Confirmation & Exit',
    desc: 'The midpoint over the last 26 periods. A primary indicator of trend direction and a major level of support or resistance.',
    color: '#EF4444' 
  },
  { 
    name: 'Senkou Span A', 
    kanji: '先行スパンA', 
    eng: 'Leading Span A', 
    period: 'Projected +26',
    role: 'Cloud Boundary 1',
    desc: 'Calculated as the average of Tenkan-sen and Kijun-sen, then plotted 26 periods into the future.',
    color: '#10B981' 
  },
  { 
    name: 'Senkou Span B', 
    kanji: '先行スパンB', 
    eng: 'Leading Span B', 
    period: 'Projected +26',
    role: 'Cloud Boundary 2',
    desc: 'The 52-period midpoint, plotted 26 periods into the future. Represents long-term equilibrium.',
    color: '#F59E0B' 
  },
  { 
    name: 'Chikou Span', 
    kanji: '遅行スパン', 
    eng: 'Lagging Span', 
    period: 'Delayed -26',
    role: 'Sentiment Confirmation',
    desc: 'The current closing price plotted 26 periods back. Used to confirm trend strength by checking against past price action.',
    color: '#8B5CF6' 
  },
];

export default function ComponentsSection() {
  return (
    <section id="components" className="scroll-mt-32 py-24">
      <div className="flex flex-col gap-12">
        <div className="inline-flex items-center gap-4">
          <div className="h-px w-12 bg-[#fbe178]/50" />
          <span className="syne font-bold text-xs uppercase tracking-[0.3em] text-[#fbe178]">The Five Lines</span>
        </div>

        <h2 className="syne font-extrabold text-4xl lg:text-5xl text-text-primary leading-tight">
          Anatomy of the <span className="text-[#fbe178]">Indicator Suite.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 bg-bg-secondary border border-border rounded-2xl relative overflow-hidden flex flex-col h-full hover:border-[#fbe178]/50 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="shippori-mincho text-3xl text-text-primary mb-1 block">{item.kanji}</span>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{item.eng}</span>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-bg-tertiary border border-border shadow-inner">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}80` }} />
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <h3 className="syne font-bold text-xl text-text-primary">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-bg-tertiary text-[9px] font-bold text-text-muted border border-border uppercase tracking-tighter">{item.period}</span>
                  <span className="text-[9px] font-bold text-[#fbe178] uppercase tracking-widest">{item.role}</span>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-8 flex-grow">
                {item.desc}
              </p>

              {/* Mini Graphic Placeholder */}
              <div className="h-16 w-full bg-bg-tertiary/50 rounded-xl border border-border/50 relative overflow-hidden p-4">
                <svg viewBox="0 0 200 40" className="w-full h-full opacity-30">
                  <path d="M0 20 Q 25 10, 50 25 T 100 15 T 150 30 T 200 10" fill="transparent" stroke={item.color} strokeWidth="2" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-bg-tertiary to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
