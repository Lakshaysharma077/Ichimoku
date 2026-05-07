'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Data Collection",
      content: "We collect minimal data necessary to provide our services, including your name, email address, and TradingView username."
    },
    {
      title: "2. Usage of TradingView Username",
      content: "Your TradingView username is used exclusively to grant you 'Invite-only' access to our premium indicators on the TradingView platform."
    },
    {
      title: "3. Third-Party Services",
      content: "We use secure third-party payment processors. We do not store your credit card or crypto wallet private keys on our servers."
    },
    {
      title: "4. Data Security",
      content: "We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure."
    },
    {
      title: "5. Cookie Usage",
      content: "We use essential cookies to maintain your session and remember your theme and language preferences. See our Cookie Policy for more details."
    }
  ];

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="秘密" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Privacy Policy
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              「プライバシーポリシー」
            </p>
            <p className="text-xl text-text-secondary leading-relaxed">
              Your privacy and the security of your trading identity are paramount to us.
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
