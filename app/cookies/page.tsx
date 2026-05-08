'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function CookiesPage() {
  const sections = [
    {
      title: "1. Introduction",
      content: "This Cookie Policy explains how Ichimoku Edge uses cookies, local storage, and similar technologies to operate the website, remember your preferences, improve user experience, and understand how visitors interact with the platform."
    },
    {
      title: "2. What Are Cookies?",
      content: "Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember preferences, maintain sessions, and improve the browsing experience. Local storage works in a similar way and allows certain information to be stored directly in your browser, such as theme or language preferences."
    },
    {
      title: "3. Essential Cookies and Local Storage",
      content: "We use essential cookies and local storage to make the website function correctly. These are used to maintain sessions, support login features, remember theme preferences (Light, Dark, or Ichimoku mode), remember language preferences (English or Japanese), and improve website stability. Disabling them may prevent parts of the website from functioning correctly."
    },
    {
      title: "4. Analytics Cookies",
      content: "We may use analytics cookies or similar technologies to understand how visitors use Ichimoku Edge. This helps us understand which pages are visited, how users navigate, and where design improvements may be needed. Where required by law, analytics cookies will only be used with your consent."
    },
    {
      title: "5. Marketing and Advertising Cookies",
      content: "At this stage, Ichimoku Edge may not use marketing or advertising cookies. If we later use marketing cookies, advertising pixels, or retargeting tools, they will only be used where permitted by law and, where required, after receiving your explicit consent."
    },
    {
      title: "6. Third-Party Cookies",
      content: "Some third-party services may place cookies when you interact with payment systems, embedded content, analytics tools, or videos. These third parties process data according to their own privacy and cookie policies. Ichimoku Edge does not control all cookies placed by third-party services."
    },
    {
      title: "7. Managing Cookies",
      content: "You can control, delete, or block cookies through your browser settings. Where applicable, you may also be able to accept, reject, or customize non-essential cookies through the cookie banner. In the EU, users can refuse non-essential cookies as easily as accepting them."
    },
    {
      title: "8. Cookie Consent",
      content: "When required by law, we will ask for your consent before placing non-essential cookies on your device. You may withdraw or change your cookie consent at any time through the cookie settings available on our website. Your choices may be stored to remember your preferences."
    },
    {
      title: "9. Changes to This Cookie Policy",
      content: "We may update this Cookie Policy from time to time. Any changes will be published on this page with the updated date. Continued use of Ichimoku Edge after changes are published means you accept the updated Cookie Policy."
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
              クッキーポリシー
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
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Last Updated: May 7, 2026</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
