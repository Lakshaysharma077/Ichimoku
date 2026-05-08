'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

const glossaryItems = [
  {
    term: "Tenkan-sen",
    translation: "転換線",
    definition: "Often called the Conversion Line. It is calculated as the mid-point of the highest high and lowest low over the last 9 periods. It represents short-term momentum and minor support or resistance."
  },
  {
    term: "Kijun-sen",
    translation: "基準線",
    definition: "Often called the Base Line. It is calculated as the mid-point of the highest high and lowest low over the last 26 periods. It represents medium-term momentum and is considered a key level of equilibrium."
  },
  {
    term: "Senkou Span A",
    translation: "先行スパンA",
    definition: "The average of the Tenkan-sen and Kijun-sen, projected forward 26 periods. It forms one boundary of the Kumo (Cloud) and reflects shorter-term trend momentum."
  },
  {
    term: "Senkou Span B",
    translation: "先行スパンB",
    definition: "The mid-point of the highest high and lowest low over the last 52 periods, projected forward 26 periods. It forms the second boundary of the Kumo (Cloud) and represents longer-term equilibrium."
  },
  {
    term: "Kumo",
    translation: "雲",
    definition: "The 'Cloud' formed by the space between Senkou Span A and Senkou Span B. It represents a multidimensional zone of support and resistance that varies in strength based on its thickness."
  },
  {
    term: "Chikou Span",
    translation: "遅行スパン",
    definition: "The Lagging Span. It is the current closing price projected backwards 26 periods. It is used to compare current price action with historical data to confirm trend direction."
  }
];

export default function GlossaryPage() {
  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="用語" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Ichimoku Glossary
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              用語集
            </p>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
              Master the terminology of the cloud. A comprehensive guide to the core components of the Ichimoku Kinkō Hyō system.
            </p>
          </ScrollReveal>
        </div>

        <div className="space-y-6">
          {glossaryItems.map((item, i) => (
            <ScrollReveal key={item.term} delay={i * 0.1}>
              <div className="group bg-bg-secondary/30 hover:bg-bg-secondary/50 border border-border/50 rounded-3xl p-8 sm:p-10 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl hover:shadow-accent/5">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                  <h2 className="syne font-bold text-2xl sm:text-3xl text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
                    {item.term}
                  </h2>
                  <span className="shippori-mincho text-lg text-text-muted opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.translation}
                  </span>
                </div>
                <div className="h-px w-12 bg-accent/30 mb-6 group-hover:w-full transition-all duration-700" />
                <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
                  {item.definition}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
