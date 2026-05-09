'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

const mainWords = [
  "Ichimoku Kinkō Hyō",
  "Tenkan-sen",
  "Kijun-sen",
  "Senkō Span A",
  "Senkō Span B",
  "Chikō Span",
  "Kumo"
];

const glossaryData = [
  { romanized: "Ichimoku Kinkō Hyō", japanese: "一目均衡表", english: "One-Glance Equilibrium Chart" },
  { romanized: "Tenkan-sen", japanese: "転換線", english: "Conversion Line" },
  { romanized: "Kijun-sen", japanese: "基準線", english: "Base Line" },
  { romanized: "Senkō Span A", japanese: "先行スパンA", english: "Leading Span A" },
  { romanized: "Senkō Span B", japanese: "先行スパンB", english: "Leading Span B" },
  { romanized: "Chikō Span", japanese: "遅行スパン", english: "Lagging Span" },
  { romanized: "Kumo", japanese: "雲", english: "Cloud" },
  { romanized: "Kumo no nejire", japanese: "雲のねじれ", english: "Cloud Twist" },
  { romanized: "Kumo-nuke", japanese: "雲抜け", english: "Cloud Breakout" },
  { romanized: "Tenkan-sen to Kijun-sen no kurosu", japanese: "転換線と基準線のクロス", english: "Tenkan-Kijun Cross" },
  { romanized: "Kōten", japanese: "好転", english: "Bullish Turn / Positive Turn" },
  { romanized: "Gyakuten", japanese: "逆転", english: "Bearish Turn / Reversal" },
  { romanized: "Kijun-sen hanpatsu", japanese: "基準線反発", english: "Kijun Bounce" },
  { romanized: "Tenkan-sen hanpatsu", japanese: "転換線反発", english: "Tenkan Bounce" },
  { romanized: "Jōshō-gumo", japanese: "上昇雲", english: "Bullish Cloud / Rising Cloud" },
  { romanized: "Kakō-gumo", japanese: "下降雲", english: "Bearish Cloud / Falling Cloud" },
  { romanized: "Taira na kumo", japanese: "平らな雲", english: "Flat Cloud" },
  { romanized: "Kinkō", japanese: "均衡", english: "Equilibrium / Balance" },
  { romanized: "Torendo", japanese: "トレンド", english: "Trend" },
  { romanized: "Ikioi", japanese: "勢い", english: "Momentum / Force" },
  { romanized: "Shiji-sen", japanese: "支持線", english: "Support Line" },
  { romanized: "Teikō-sen", japanese: "抵抗線", english: "Resistance Line" },
  { romanized: "Jōshō torendo", japanese: "上昇トレンド", english: "Uptrend" },
  { romanized: "Kakō torendo", japanese: "下降トレンド", english: "Downtrend" },
  { romanized: "Mochiai", japanese: "持ち合い", english: "Range / Consolidation" },
  { romanized: "Hōkō-kan", japanese: "方向感", english: "Directional Bias" },
  { romanized: "Kyōjaku", japanese: "強弱", english: "Strength / Weakness" },
  { romanized: "Senkō", japanese: "先行", english: "Leading / Ahead" },
  { romanized: "Chikō", japanese: "遅行", english: "Lagging / Delayed" },
  { romanized: "Sen", japanese: "線", english: "Line" },
  { romanized: "Supan", japanese: "スパン", english: "Span" },
  { romanized: "Hen’i", japanese: "変位", english: "Displacement" },
  { romanized: "Shifuto", japanese: "シフト", english: "Shift" },
  { romanized: "Mirai", japanese: "未来", english: "Future" },
  { romanized: "Kako", japanese: "過去", english: "Past" },
  { romanized: "Genzaichi", japanese: "現在値", english: "Current Price" },
  { romanized: "Owarine", japanese: "終値", english: "Closing Price" },
  { romanized: "Takane", japanese: "高値", english: "High Price" },
  { romanized: "Yasune", japanese: "安値", english: "Low Price" },
  { romanized: "Saikōne", japanese: "最高値", english: "Highest High" },
  { romanized: "Saiyasune", japanese: "最安値", english: "Lowest Low" },
  { romanized: "Chūkan-chi", japanese: "中間値", english: "Midpoint / Middle Value" },
  { romanized: "Kikan", japanese: "期間", english: "Period" },
  { romanized: "Kyū-kikan", japanese: "9期間", english: "9 Periods" },
  { romanized: "Nijūroku-kikan", japanese: "26期間", english: "26 Periods" },
  { romanized: "Gojūni-kikan", japanese: "52期間", english: "52 Periods" },
  { romanized: "Keisan", japanese: "計算", english: "Calculation" },
  { romanized: "Neugoki", japanese: "値動き", english: "Price Movement" },
  { romanized: "Kakaku", japanese: "価格", english: "Price" },
  { romanized: "Uwa-nuke", japanese: "上抜け", english: "Break Above" },
  { romanized: "Shita-nuke", japanese: "下抜け", english: "Break Below" },
  { romanized: "Hane-kaeri", japanese: "跳ね返り", english: "Bounce / Rejection" },
  { romanized: "Oshime", japanese: "押し目", english: "Pullback" },
  { romanized: "Modori", japanese: "戻り", english: "Retracement / Return" },
  { romanized: "Uwari", japanese: "上回り", english: "Move Above" },
  { romanized: "Shitamawari", japanese: "下回り", english: "Move Below" },
  { romanized: "Meikaku na torendo", japanese: "明確なトレンド", english: "Clear Trend" },
];

export default function GlossaryPage() {
  const searchParams = useSearchParams();
  const [isExtended, setIsExtended] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'extended') {
      setIsExtended(true);
    }
  }, [searchParams]);

  const filteredData = isExtended 
    ? glossaryData 
    : glossaryData.filter(item => mainWords.includes(item.romanized));

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="用語" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Ichimoku Glossary
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-0">
              用語集
            </p>
          </ScrollReveal>

          {/* Toggle Switch */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.2em] ml-1">
                Version Select
              </span>
              <div 
                onClick={() => setIsExtended(!isExtended)}
                className="relative w-48 h-12 bg-bg-secondary/50 backdrop-blur-md rounded-2xl border border-border/50 p-1 cursor-pointer group"
              >
                <div className="absolute inset-0 flex">
                  <div className="flex-1 flex items-center justify-center z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${!isExtended ? 'text-[#0c101f]' : 'text-text-muted group-hover:text-text-primary'}`}>
                      Main
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${isExtended ? 'text-[#0c101f]' : 'text-text-muted group-hover:text-text-primary'}`}>
                      Extended
                    </span>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#fbe178] rounded-[12px] shadow-[0_0_15px_rgba(251,225,120,0.3)]"
                  animate={{ x: isExtended ? '100%' : '0%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Content List - Professional Table */}
        <ScrollReveal delay={0.2}>
          <div className="bg-bg-secondary/20 backdrop-blur-2xl border border-white/5 rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)]">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-3 px-8 py-5 bg-white/[0.04] border-b border-white/5">
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.25em]">
                Romanized Japanese
              </span>
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.25em]">
                Japanese
              </span>
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-[0.25em]">
                English Translation
              </span>
            </div>

            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {filteredData.map((item, i) => (
                  <motion.div 
                    key={item.romanized}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: isExtended ? 0 : i * 0.05 }}
                    className="group relative md:grid md:grid-cols-3 flex flex-col gap-4 px-8 py-6 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-all duration-300 items-center"
                  >
                    {/* Romanized */}
                    <div className="flex flex-col gap-1 relative z-10">
                      <span className="hidden md:block text-[10px] font-mono text-text-muted/40 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">Romanized</span>
                      <span className="text-[15px] font-bold text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors duration-300">
                        {item.romanized}
                      </span>
                    </div>

                    {/* Japanese */}
                    <div className="flex items-center relative z-10">
                      <span className="shippori-mincho text-2xl text-text-muted opacity-40 group-hover:opacity-100 group-hover:text-text-primary group-hover:scale-105 transition-all duration-500">
                        {item.japanese}
                      </span>
                    </div>

                    {/* English */}
                    <div className="flex flex-col relative z-10">
                      <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors duration-300 leading-relaxed">
                        {item.english}
                      </span>
                    </div>

                    {/* Mobile Labels (only shown on small screens) */}
                    <div className="md:hidden absolute top-2 right-4 flex gap-2">
                      <span className="text-[8px] font-mono text-text-muted uppercase tracking-tighter opacity-30">Glossary Term</span>
                    </div>

                    {/* Subtle hover accent */}
                    <div className="absolute left-0 w-1 h-0 bg-accent rounded-full group-hover:h-12 transition-all duration-300 top-1/2 -translate-y-1/2" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em]">
              Showing {filteredData.length} Terms
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
