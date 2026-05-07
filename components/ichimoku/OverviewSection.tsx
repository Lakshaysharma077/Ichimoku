'use client';

import { motion } from 'framer-motion';

export default function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-32">
      <div className="flex flex-col gap-12">
        <div className="inline-flex items-center gap-4">
          <div className="h-px w-12 bg-[#fbe178]/50" />
          <span className="syne font-bold text-xs uppercase tracking-[0.3em] text-[#fbe178]">Overview</span>
        </div>

        <div className="space-y-12">
          <h2 className="syne font-extrabold text-4xl lg:text-5xl text-text-primary leading-tight">
            The Philosophy of <span className="text-[#fbe178]">One Look</span> Equilibrium.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                Developed in the late 1930s by Goichi Hosoda, Ichimoku Kinkō Hyō translates to 
                <span className="text-text-primary font-bold italic"> "one-look equilibrium chart."</span>
              </p>
              <p>
                Hosoda spent 30 years perfecting this system, aiming to create a comprehensive framework 
                that could define the entire market narrative in a single glance. It is not just an indicator; 
                it is a <span className="text-text-primary font-semibold underline decoration-[#fbe178]">holistic trading philosophy</span>.
              </p>
            </div>

            <blockquote className="relative p-8 bg-bg-secondary/50 rounded-2xl border-l-4 border-[#fbe178] overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl shippori-mincho text-[#fbe178] select-none group-hover:scale-110 transition-transform duration-700">「</div>
              <p className="relative z-10 shippori-mincho text-xl text-text-primary leading-relaxed italic">
                "The market is a reflection of human nature. To master the chart, one must first master the self and understand the balance of time."
              </p>
              <footer className="mt-4 text-xs font-mono uppercase tracking-widest text-text-muted">
                — Goichi Hosoda (Ichimoku Sanjin)
              </footer>
            </blockquote>
          </div>
          
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: 'Founded', value: '1930s' },
              { label: 'Public Release', value: '1968' },
              { label: 'Core Principle', value: 'Equilibrium' },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-bg-tertiary/30 border border-border rounded-xl">
                <span className="block text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">{stat.label}</span>
                <span className="text-2xl font-bold syne text-text-primary">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
