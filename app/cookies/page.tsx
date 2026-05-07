'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function CookiesPage() {
  const sections = [
    {
      title: "1. What are Cookies?",
      content: "Cookies are small text files stored on your device to help websites function properly and remember your preferences."
    },
    {
      title: "2. Essential Cookies",
      content: "We use essential cookies for authentication and to store your theme (Light/Dark/Ichimoku) and language (English/Japanese) settings."
    },
    {
      title: "3. Analytics Cookies",
      content: "We may use anonymized analytics to understand how visitors interact with the site, helping us improve the platform's performance and layout."
    },
    {
      title: "4. Managing Cookies",
      content: "You can control and delete cookies through your browser settings. However, disabling essential cookies may prevent you from logging in or using certain platform features."
    }
  ];

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="記録" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Cookie Policy
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              「クッキーポリシー」
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              How we use local storage and cookies to improve your Ichimoku Edge experience.
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
