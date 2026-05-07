'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Ichimoku Edge, you agree to be bound by these Terms of Service. If you do not agree, you must not use our indicators or platform."
    },
    {
      title: "2. License & Usage",
      content: "We grant you a non-exclusive, non-transferable license to use our TradingView indicators for personal or professional trading analysis. You may not redistribute, resell, or reverse-engineer our Pine Script code."
    },
    {
      title: "3. TradingView Account",
      content: "Our tools are built for TradingView. You are responsible for maintaining your own TradingView account. We are not responsible for any limitations or technical issues on the TradingView platform itself."
    },
    {
      title: "4. No Financial Advice",
      content: "Ichimoku Edge provides educational tools and indicators. We do not provide financial, investment, or trading advice. Trading involves significant risk, and you are solely responsible for your own trading decisions and financial outcomes."
    },
    {
      title: "5. Indicator Performance",
      content: "Our indicators are designed to be accurate based on historical data. However, market conditions change. We do not guarantee future profits or specific performance levels."
    }
  ];

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="規約" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Terms of Service
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              「利用規約」
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              Please read these terms carefully before using the Ichimoku Edge platform and indicators.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-12 bg-bg-secondary/50 border border-border rounded-3xl p-8 sm:p-12">
          {sections.map((section, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="space-y-4">
                <h2 className="syne font-bold text-2xl text-text-primary uppercase tracking-tight">{section.title}</h2>
                <p className="text-text-secondary leading-relaxed">{section.content}</p>
              </div>
            </ScrollReveal>
          ))}
          
          <ScrollReveal delay={0.6}>
            <div className="pt-8 border-t border-border">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Last Updated: May 2026</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
