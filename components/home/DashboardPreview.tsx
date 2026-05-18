'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '../shared/ScrollReveal';
import Button from '../ui/Button';
import Link from 'next/link';
import TradingViewIndicator from './TradingViewIndicator';
import { useContent } from '@/hooks/useContent';
import EditableElement from '../admin/EditableElement';
import { useEditStore } from '@/lib/store/useEditStore';

export default function DashboardPreview() {
  const dashboard = useContent('dashboard');
  const { isEditMode } = useEditStore();

  return (
    <section className="py-16 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-10">
          <ScrollReveal>
            <h2 className="syne font-bold text-4xl lg:text-5xl text-text-primary mb-4">
              <EditableElement section="dashboard" path={['heading']} content={dashboard.heading} />
            </h2>
            <p className="shippori-mincho text-xl text-text-muted mb-4">
              <EditableElement section="dashboard" path={['japaneseHeading']} content={dashboard.japaneseHeading} />
            </p>
            <p className="txt-body">
              <EditableElement section="dashboard" path={['subtitle']} content={dashboard.subtitle} />
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {dashboard.previews.map((preview: any, i: number) => (
            <ScrollReveal key={i}>
              <div className="flex flex-col h-full">
                <div className="aspect-square bg-bg-secondary/80 backdrop-blur-[30px] border border-border rounded-2xl relative overflow-hidden group mb-6 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-text-primary/[0.05] to-transparent pointer-events-none" />

                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-1 text-[8px] font-mono font-bold bg-accent/10 text-accent border border-accent/20 rounded uppercase tracking-widest">
                      <EditableElement section="dashboard" path={['previews', i.toString(), 'badge']} content={preview.badge} />
                    </span>
                  </div>

                  <div className="relative z-0 h-full">
                    {renderPreviewContent(i)}
                  </div>
                </div>
                <h4 className="syne font-bold text-xl text-text-primary">
                  <EditableElement section="dashboard" path={['previews', i.toString(), 'title']} content={preview.title} />
                </h4>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Feature Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-10">
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
                <EditableElement section="dashboard" path={['featureSection', 'heading']} content={dashboard.featureSection.heading} />
              </h3>
              <p className="text-lg txt-body leading-relaxed mb-8">
                <EditableElement section="dashboard" path={['featureSection', 'description']} content={dashboard.featureSection.description} />
              </p>
              <div className="space-y-4">
                {dashboard.featureSection.features.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-text-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <EditableElement section="dashboard" path={['featureSection', 'features', i.toString()]} content={item} />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="text-center">
          <ScrollReveal>
            <Link href="/tools">
              <Button variant="outline" size="lg">
                <EditableElement section="dashboard" path={['featureSection', 'button']} content={dashboard.featureSection.button} />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function renderPreviewContent(index: number) {
  if (index === 0) {
    return (
      <div className="w-full h-full p-4 space-y-4">
        <div className="grid grid-cols-4 txt-label pb-2 border-b border-border">
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
    );
  }
  if (index === 1) {
    return (
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
            <span className="txt-label">Kumo Thickness</span>
            <span className="text-xs font-bold text-text-primary">2.3%</span>
          </div>
          <div className="flex flex-col">
            <span className="txt-label">Bias</span>
            <span className="text-xs font-bold text-emerald-500 uppercase">BULLISH</span>
          </div>
        </div>
      </div>
    );
  }
  return (
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
              <span className="txt-label">{alert.asset}</span>
            </div>
          </div>
          <span className="txt-label font-normal">{alert.tf}</span>
        </div>
      ))}
    </div>
  );
}
