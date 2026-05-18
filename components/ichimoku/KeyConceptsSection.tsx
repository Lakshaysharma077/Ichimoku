'use client';

import { motion } from 'framer-motion';

const concepts = [
  { 
    title: 'Equilibrium', 
    desc: 'The point where demand and supply are perfectly balanced. Price always seeks to return to its equilibrium midpoint over time.',
    kanji: '均衡'
  },
  { 
    title: 'Alignment', 
    desc: 'The power of the signal is magnified when all five lines and the price action align in the same direction across timeframes.',
    kanji: '整列'
  },
  { 
    title: 'Location', 
    desc: 'Where the price is relative to the cloud defines the dominant market regime—be it a trend or a ranging trap.',
    kanji: '位置'
  },
  { 
    title: 'Space', 
    desc: 'The distance between price and its averages (Tenkan/Kijun) indicates over-extension and the probability of a sharp mean reversion.',
    kanji: '空間'
  },
  { 
    title: 'Invalidation', 
    desc: 'Clear objective boundaries. If the price crosses the Kijun-sen or the Cloud against your trade, the equilibrium has shifted.',
    kanji: '無効化'
  },
];

export default function KeyConceptsSection() {
  return (
    <section id="concepts" className="scroll-mt-32 py-24">
      <div className="flex flex-col gap-12">
        <div className="inline-flex items-center gap-4">
          <div className="h-px w-12 bg-border" />
          <span className="txt-label tracking-[0.3em]">Foundations</span>
        </div>

        <h2 className="syne font-extrabold text-4xl lg:text-5xl text-text-primary leading-tight">
          The Five Pillars of <br /> <span className="text-accent">Market Structure.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {concepts.map((concept, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-bg-secondary/30 border border-border rounded-2xl flex flex-col justify-between group hover:bg-bg-tertiary transition-all duration-500 min-h-[300px]"
            >
              <div>
                <span className="shippori-mincho text-2xl text-accent/40 group-hover:text-accent transition-colors block mb-6">{concept.kanji}</span>
                <h3 className="syne font-bold text-lg text-text-primary mb-4 uppercase">{concept.title}</h3>
                <p className="text-xs txt-body opacity-80 group-hover:opacity-100 transition-opacity">
                  {concept.desc}
                </p>
              </div>
              
              <div className="h-0.5 w-full bg-border group-hover:bg-accent/50 transition-colors mt-8" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
