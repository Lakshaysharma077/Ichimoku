'use client';

import { useState } from 'react';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCard from '@/components/pricing/PricingCard';
import PaymentMethods from '@/components/pricing/PaymentMethods';
import Button from '@/components/ui/Button';

const pricingTiers = [
  {
    name: "Explorer",
    kanji: "探索者",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    tagline: "Start your Ichimoku journey",
    ctaText: "Get Started Free",
    features: [
      { text: "TK Cross Alert (free indicator)", included: true },
      { text: "S/R Auto indicator", included: true },
      { text: "Community Discord access", included: true },
      { text: "Education resources (YouTube)", included: true },
      { text: "Premium indicators", included: false },
      { text: "Multi-timeframe dashboard", included: false },
      { text: "Email alerts", included: false },
    ],
  },
  {
    name: "Samurai",
    kanji: "侍",
    monthlyPrice: "$29",
    yearlyPrice: "$23",
    tagline: "The complete Ichimoku Edge system",
    ctaText: "Start 14-Day Free Trial",
    isFeatured: true,
    isTrial: true,
    features: [
      { text: "ALL free indicators", included: true },
      { text: "Ichimoku Edge Pro indicator", included: true },
      { text: "MTF Ichimoku Table dashboard", included: true },
      { text: "Kumo Cloud Scanner", included: true },
      { text: "Chikou Span Analyzer", included: true },
      { text: "Ichimoku Trend Meter", included: true },
      { text: "Session Dashboard", included: true },
      { text: "Priority email support", included: true },
    ],
  },
  {
    name: "Daimyo",
    kanji: "大名",
    monthlyPrice: "$79",
    yearlyPrice: "$63",
    tagline: "For serious institutional traders",
    ctaText: "Start 14-Day Free Trial",
    isTrial: true,
    features: [
      { text: "Everything in Samurai PLUS:", included: true },
      { text: "1-on-1 strategy consultation", included: true },
      { text: "Custom indicator requests", included: true },
      { text: "Telegram VIP alerts group", included: true },
      { text: "Portfolio review sessions", included: true },
      { text: "Early beta indicator access", included: true },
      { text: "Dedicated support line", included: true },
    ],
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="pt-40 pb-24 relative overflow-hidden">
      <KanjiWatermark kanji="価値" className="top-1/4 right-[-5%] opacity-[0.04]" size="35vw" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Simple, Transparent Pricing
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              「価格設定」
            </p>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Start with 14 days completely free. No credit card required.
            </p>
          </ScrollReveal>
        </div>

        <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
          {pricingTiers.map((tier, i) => (
            <ScrollReveal key={tier.name} delay={i * 0.1}>
              <PricingCard
                {...tier}
                price={isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                period={isYearly ? "/ mo billed yearly" : "/ mo"}
              />
            </ScrollReveal>
          ))}
        </div>

        <PaymentMethods />

        {/* Trial Guarantee Banner */}
        <ScrollReveal delay={0.3}>
          <div className="mt-24 bg-bg-secondary border border-border rounded-3xl p-12 text-center relative overflow-hidden">
            <KanjiWatermark kanji="信頼" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02]" size="20vw" />
            <div className="relative z-10">
              <h2 className="syne font-bold text-3xl lg:text-4xl text-text-primary mb-4">
                14 Days. Full Access. Zero Risk.
              </h2>
              <p className="shippori-mincho text-xl text-text-muted mb-8">
                「14日間。完全アクセス。ゼロリスク。」
              </p>
              <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                Try every premium indicator free for 14 days. If it's not the best Ichimoku toolset you've ever used, cancel with one click. No questions asked.
              </p>
              <Button size="lg">Start Your Free Trial Now →</Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
