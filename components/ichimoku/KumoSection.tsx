'use client';

import { motion } from 'framer-motion';

const cloudInsights = [
  { 
    title: 'Bullish Cloud', 
    desc: 'When Span A is above Span B, the cloud typically glows green. This indicates long-term bullish equilibrium.',
    color: 'emerald-500'
  },
  { 
    title: 'Bearish Cloud', 
    desc: 'When Span B is above Span A, the cloud glows red. This signals that long-term sentiment is favoring sellers.',
    color: 'rose-500'
  },
  { 
    title: 'Market Equilibrium', 
    desc: 'When price enters the cloud, it is in a "No Man\'s Land" of noise and consolidation. Balance is being recalibrated.',
    color: 'text-muted'
  },
  { 
    title: 'The Weight of Time', 
    desc: 'A thick cloud suggests strong institutional commitment. A thin cloud indicates fragility and high potential for a flip.',
    color: 'amber-500'
  },
];

export default function KumoSection() {
  return (
    <section id="kumo" className="scroll-mt-32 py-24 relative">
      <div className="flex flex-col gap-12">
        <div className="inline-flex items-center gap-4">
          <div className="h-px w-12 bg-[#fbe178]/50" />
          <span className="syne font-bold text-xs uppercase tracking-[0.3em] text-[#fbe178]">The Kumo</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="syne font-extrabold text-4xl lg:text-5xl text-text-primary tracking-tighter leading-tight">
              The Soul of the System: <br /> <span className="text-[#fbe178]">The Kumo Cloud.</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              The Cloud is the most distinctive element of Ichimoku. It doesn't just show support 
              and resistance; it represents the <span className="text-text-primary font-bold">memory of the market</span> and the 
              probability of future trend continuation.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {cloudInsights.map((insight, i) => (
                <div key={i} className="p-4 bg-bg-secondary/50 border border-border rounded-xl flex gap-4 items-start">
                   <div className={`w-1 h-full rounded-full bg-${insight.color === 'text-muted' ? 'bg-tertiary' : insight.color}`} />
                   <div>
                     <h4 className="syne font-bold text-sm text-text-primary mb-1 uppercase tracking-tight">{insight.title}</h4>
                     <p className="text-xs text-text-secondary leading-relaxed">{insight.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            {/* Animated Cloud Visualization */}
            <div className="aspect-[4/3] bg-bg-tertiary rounded-[40px] border border-border p-12 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fbe178]/5 via-transparent to-transparent" />
              
              <div className="relative h-full flex flex-col justify-center">
                {/* Visual Representation of Cloud */}
                <div className="relative w-full h-48">
                  {/* Top Line (Span A) */}
                  <motion.svg 
                    viewBox="0 0 400 100" 
                    className="absolute inset-0 w-full h-full text-emerald-500/50"
                  >
                    <motion.path 
                      d="M0 60 Q 50 40, 100 50 T 200 30 T 300 40 T 400 20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      animate={{ d: ["M0 60 Q 50 40, 100 50 T 200 30 T 300 40 T 400 20", "M0 55 Q 50 45, 100 45 T 200 35 T 300 35 T 400 25", "M0 60 Q 50 40, 100 50 T 200 30 T 300 40 T 400 20"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.svg>

                  {/* Bottom Line (Span B) */}
                  <motion.svg 
                    viewBox="0 0 400 100" 
                    className="absolute inset-0 w-full h-full text-rose-500/50"
                  >
                    <motion.path 
                      d="M0 85 Q 50 65, 100 75 T 200 55 T 300 65 T 400 45" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      animate={{ d: ["M0 85 Q 50 65, 100 75 T 200 55 T 300 65 T 400 45", "M0 90 Q 50 70, 100 70 T 200 60 T 300 70 T 400 50", "M0 85 Q 50 65, 100 75 T 200 55 T 300 65 T 400 45"] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.svg>

                  {/* Filling (Cloud) */}
                  <motion.div 
                    className="absolute top-[25%] bottom-[15%] left-0 right-0 bg-gradient-to-b from-emerald-500/10 to-rose-500/10 backdrop-blur-[2px] rounded-full"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Price Line Overlay */}
                  <motion.svg 
                    viewBox="0 0 400 100" 
                    className="absolute inset-0 w-full h-full text-text-primary z-10"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2.5 }}
                  >
                    <path 
                      d="M0 90 L 50 70 L 100 80 L 150 40 L 200 50 L 250 10 L 300 20 L 400 5" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </div>
                
                <div className="mt-16 flex items-center justify-between text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Senkou Span A</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Senkou Span B</span>
                  </div>
                  <div className="h-px flex-1 mx-8 bg-border/50" />
                  <span className="text-[#fbe178] font-bold">Institutional Bias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
