'use client';

import { motion } from 'framer-motion';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';
import SectionDivider from '@/components/shared/SectionDivider';
import BilingualHover from '@/components/shared/BilingualHover';

const components = [
  { name: 'Tenkan-Sen', kanji: '転換線', eng: 'Conversion Line', desc: '9-period midpoint of the high and low.', color: '#00B4D8' },
  { name: 'Kijun-Sen', kanji: '基準線', eng: 'Base Line', desc: '26-period midpoint of the high and low.', color: '#EF4444' },
  { name: 'Senkou Span A', kanji: '先行スパンA', eng: 'Leading Span A', desc: 'Average of Tenkan and Kijun, plotted 26 periods ahead.', color: '#10B981' },
  { name: 'Senkou Span B', kanji: '先行スパンB', eng: 'Leading Span B', desc: '52-period midpoint, plotted 26 periods ahead.', color: '#F59E0B' },
  { name: 'Chikou Span', kanji: '遅行スパン', eng: 'Lagging Span', desc: 'Closing price plotted 26 periods behind.', color: '#94A3B8' },
];

export default function IchimokuPage() {
  return (
    <div className="pt-40 pb-24 relative overflow-hidden">
      <KanjiWatermark kanji="一目均衡表" className="top-10 right-[-10%] opacity-[0.04]" size="35vw" />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Ichimoku Kinkō Hyō
            </h1>
            <p className="shippori-mincho text-[clamp(1.75rem,5vw,3rem)] text-text-muted mb-8 leading-none transform scale-y-[1.1] origin-left">
              一目均衡表
            </p>
          </div>
          <p className="text-xl text-text-secondary max-w-3xl leading-relaxed">
            Ichimoku Kinkō Hyō, commonly known as the Ichimoku Cloud, is a versatile charting system that identifies trend direction, gauges momentum, and reveals support and resistance levels. It offers a "single glance" view of the market.
          </p>
        </ScrollReveal>
      </div>

      {/* 5 Components */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <ScrollReveal>
          <h2 className="syne font-bold text-3xl text-text-primary uppercase">The 5 Lines of Ichimoku</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {components.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="p-8 bg-bg-secondary border border-border rounded-2xl group hover:border-accent transition-all duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl text-text-primary font-bold">{item.name}</span>
                  <div className="w-12 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                </div>
                <span className="shippori-mincho text-sm text-text-muted mb-3 block">{item.kanji}</span>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block italic">"{item.eng}"</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <SectionDivider kanji="雲" />

      {/* The Cloud */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <h2 className="syne font-bold text-4xl text-text-primary mb-8 uppercase">How to Read the Cloud</h2>
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>The <BilingualHover english="Kumo" japanese="雲" /> (Cloud) is the heart of the system. Formed by Senkou Span A and B, it represents a dynamic zone of support and resistance.</p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-emerald-500 font-bold">▲</span>
                  <span><strong>Price Above <BilingualHover english="Cloud" japanese="雲" />:</strong> Strong Bullish Sentiment.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-text-muted font-bold">●</span>
                  <span><strong>Price Inside <BilingualHover english="Cloud" japanese="雲" />:</strong> Neutral / Consolidation Zone.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-rose-500 font-bold">▼</span>
                  <span><strong>Price Below <BilingualHover english="Cloud" japanese="雲" />:</strong> Strong Bearish Sentiment.</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="aspect-video bg-bg-tertiary rounded-3xl border border-border p-8 relative overflow-hidden flex flex-col justify-center">
              {/* Simplified Cloud Diagram */}
              <div className="relative h-40">
                {/* Span A */}
                <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full text-emerald-500">
                  <path d="M0 60 Q 50 40, 100 50 T 200 30 T 300 40 T 400 20" fill="transparent" stroke="currentColor" strokeWidth="2" />
                </svg>
                {/* Span B */}
                <svg viewBox="0 0 400 100" className="absolute inset-0 w-full h-full text-rose-500">
                  <path d="M0 80 Q 50 60, 100 70 T 200 50 T 300 60 T 400 40" fill="transparent" stroke="currentColor" strokeWidth="2" />
                </svg>
                {/* Cloud Fill */}
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />

                {/* Price Line */}
                <motion.svg
                  viewBox="0 0 400 100"
                  className="absolute inset-0 w-full h-full text-text-primary"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                >
                  <path d="M0 90 L 50 70 L 100 80 L 150 40 L 200 50 L 250 10 L 300 20 L 400 5" fill="transparent" stroke="currentColor" strokeWidth="3" />
                </motion.svg>
              </div>
              <div className="mt-8 flex justify-center gap-12 text-[10px] font-mono text-text-muted uppercase tracking-widest">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Span A</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500" /> Span B</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-text-primary" /> Price</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Settings Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-32">
        <ScrollReveal>
          <h2 className="syne font-bold text-3xl text-text-primary mb-12 uppercase">Ichimoku Settings</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-secondary text-text-muted font-mono uppercase text-[10px] tracking-widest border-b border-border">
                <tr>
                  <th className="px-8 py-6">Style</th>
                  <th className="px-8 py-6">Conversion (TK)</th>
                  <th className="px-8 py-6">Base (KJ)</th>
                  <th className="px-8 py-6">Leading B (S2)</th>
                  <th className="px-8 py-6">Lagging (CS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-secondary">
                {[
                  { style: 'Classic (Original)', tk: 9, kj: 26, s2: 52, cs: 26 },
                  { style: 'Modern (Stock)', tk: 10, kj: 30, s2: 60, cs: 30 },
                  { style: 'Crypto-Adapted', tk: 20, kj: 60, s2: 120, cs: 30 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-text-primary">{row.style}</td>
                    <td className="px-8 py-6 font-mono">{row.tk}</td>
                    <td className="px-8 py-6 font-mono">{row.kj}</td>
                    <td className="px-8 py-6 font-mono">{row.s2}</td>
                    <td className="px-8 py-6 font-mono">{row.cs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>

      {/* SEO Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <h2 className="syne font-bold text-3xl text-text-primary mb-8 uppercase">What is Ichimoku Kinkō Hyō?</h2>
          <div className="prose prose-invert prose-p:text-text-secondary prose-p:leading-relaxed space-y-6">
            <p>Developed in the late 1930s by Goichi Hosoda, a Japanese journalist who used to be known as Ichimoku Sanjin, Ichimoku Kinkō Hyō translates to "one-look equilibrium chart." Hosoda spent 30 years perfecting the system before releasing it to the public in 1968.</p>
            <p>Unlike traditional technical indicators that focus on a single aspect of market behavior, Ichimoku is a comprehensive framework. It provides a holistic view of price action, trend strength, and potential reversal points. Many traders find it superior to standard moving average crossovers because it accounts for the element of time, not just price.</p>
            <p>The system is built on five distinct lines, each calculated based on the midpoints of highs and lows over specific periods. This focus on midpoints rather than closing prices makes the system more sensitive to market volatility and helps filter out noise.</p>
            <p>In modern trading, Ichimoku has become a staple for institutional traders in Japan and is rapidly gaining popularity among Western forex and crypto traders. Its ability to define trend and support/resistance simultaneously makes it an essential tool for any disciplined trader seeking market clarity.</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
