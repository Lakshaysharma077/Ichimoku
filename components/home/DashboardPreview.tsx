'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '../shared/ScrollReveal';
import Button from '../ui/Button';
import Link from 'next/link';

const previews = [
  {
    title: "Multi-Timeframe Ichimoku Table",
    content: (
      <div className="w-full h-full p-4 space-y-4">
        <div className="grid grid-cols-4 text-[10px] font-mono text-text-muted uppercase tracking-widest pb-2 border-b border-border">
          <span>TF</span>
          <span>Cloud</span>
          <span>TK</span>
          <span>Chikou</span>
        </div>
        {[
          { tf: '1H', cloud: 'bg-emerald-500', tk: 'bg-emerald-500', chikou: 'bg-gray-500' },
          { tf: '4H', cloud: 'bg-emerald-500', tk: 'bg-emerald-500', chikou: 'bg-emerald-500' },
          { tf: '1D', cloud: 'bg-emerald-500', tk: 'bg-gray-500', chikou: 'bg-gray-500' },
        ].map((row, i) => (
          <div key={i} className="grid grid-cols-4 items-center">
            <span className="text-xs font-bold font-mono">{row.tf}</span>
            <div className={`w-3 h-3 rounded-full ${row.cloud}`} />
            <div className={`w-3 h-3 rounded-full ${row.tk}`} />
            <div className={`w-3 h-3 rounded-full ${row.chikou}`} />
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Trend Strength Meter",
    content: (
      <div className="w-full h-full p-6 flex flex-col justify-center">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold syne uppercase">Strong Uptrend</span>
          <span className="text-xl font-bold syne">75%</span>
        </div>
        <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '75%' }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-emerald-500"
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-text-muted uppercase">Kumo Thickness</span>
            <span className="text-xs font-bold text-text-primary">2.3%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-text-muted uppercase">Bias</span>
            <span className="text-xs font-bold text-emerald-500 uppercase">BULLISH</span>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Signal Alert Panel",
    content: (
      <div className="w-full h-full p-4 space-y-3">
        {[
          { status: '✓', title: 'TK Cross', asset: 'BTCUSD', tf: '4H', color: 'text-emerald-500' },
          { status: '✓', title: 'Kumo Breakout', asset: 'ETHUSDT', tf: '1D', color: 'text-emerald-500' },
          { status: '○', title: 'Chikou Clear', asset: 'AAPL', tf: '1W', color: 'text-text-muted' },
        ].map((alert, i) => (
          <div key={i} className="p-3 bg-bg-tertiary/50 border border-border rounded-lg flex items-center justify-between group-hover:translate-x-1 transition-transform">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${alert.color}`}>{alert.status}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-text-primary">{alert.title}</span>
                <span className="text-[10px] font-mono text-text-muted uppercase">{alert.asset}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-text-muted">{alert.tf}</span>
          </div>
        ))}
      </div>
    )
  }
];

import TradingViewIndicator from './TradingViewIndicator';

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h2 className="syne font-bold text-4xl lg:text-5xl text-text-primary mb-4">
              Time-Saving Dashboards
            </h2>
            <p className="shippori-mincho text-xl text-text-muted mb-4">
              時間節約ダッシュボード
            </p>
            <p className="text-text-secondary">One glance. Full market context.</p>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {previews.map((preview, i) => (
            <ScrollReveal key={i}>
              <div className="flex flex-col h-full">
                <div className="aspect-square bg-bg-secondary border border-border rounded-2xl relative overflow-hidden group mb-6">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-1 text-[8px] font-mono font-bold bg-accent/10 text-accent border border-accent/20 rounded uppercase tracking-widest">
                      LIVE PREVIEW
                    </span>
                  </div>
                  {preview.content}
                </div>
                <h4 className="syne font-bold text-xl text-text-primary">{preview.title}</h4>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* New Feature: Full Indicator Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="flex justify-center">
            <ScrollReveal>
              <div className="max-w-[540px] w-full">
                <TradingViewIndicator />
              </div>
            </ScrollReveal>
          </div>
          <div>
            <ScrollReveal>
              <h3 className="syne font-bold text-3xl text-text-primary mb-6 uppercase">
                Premium Indicator Visuals
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Experience crystal-clear signals on your TradingView charts. Our suite is designed to adapt to your workspace—whether you trade in high-contrast light or midnight dark themes.
              </p>
              <div className="space-y-4">
                {[
                  "Clean TK Cross Identification",
                  "Dynamic Kumo Cloud Transparency",
                  "Adaptive Background Coloring",
                  "Institutional-Grade Typography"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-text-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
        
        <div className="text-center">
          <ScrollReveal>
            <Link href="/tools">
              <Button variant="outline" size="lg">Explore All Tools →</Button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
