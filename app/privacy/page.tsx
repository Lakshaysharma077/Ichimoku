'use client';

import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Introduction",
      content: "Ichimoku Edge respects your privacy and aims to collect only the personal data necessary to provide, secure, and improve our services. This Privacy Policy explains what information we collect, how we use it, how long we keep it, and what rights you have regarding your personal data. By using Ichimoku Edge, you agree to the practices described in this Privacy Policy."
    },
    {
      title: "2. Data Controller",
      content: "For users located in the European Union, Switzerland, the United Kingdom, Canada, the United States, or any other region, the data controller responsible for your personal data is Ichimoku Edge (contact@ichimokuedge.com). For privacy-related requests, you can contact us at our dedicated support email."
    },
    {
      title: "3. Data We Collect",
      content: "We may collect the following information: name, email address, TradingView username, payment status and subscription information, support messages or communications, technical information (browser type, device type, language preference), and cookie/local storage preferences. We aim to collect only the data necessary to operate Ichimoku Edge."
    },
    {
      title: "4. Use of Your TradingView Username",
      content: "Your TradingView username is used to grant and manage access to Ichimoku Edge invite-only indicators on the TradingView platform. We do not use your TradingView username to access your private TradingView account, trading activity, charts, broker account, or financial information. You are responsible for providing the correct TradingView username."
    },
    {
      title: "5. How We Use Your Data",
      content: "We use your personal data to provide access to products, manage subscriptions, grant access to TradingView indicators, process payments, respond to support requests, improve the user experience, prevent fraud, and comply with legal obligations. We do not sell your personal data."
    },
    {
      title: "6. Legal Basis for Processing",
      content: "Depending on the situation, our legal basis for processing includes contractual necessity, legal obligation, legitimate interest (securing the website, preventing abuse), or consent (for non-essential cookies or analytics). You may withdraw consent at any time where processing is based on consent."
    },
    {
      title: "7. Payments and Third-Party Services",
      content: "Payments are processed by secure third-party providers. Ichimoku Edge does not store your full credit card details or crypto wallet private keys. We may use third-party services for hosting, analytics, support, and technical infrastructure. These providers process data only as necessary to provide their services."
    },
    {
      title: "8. Cookies and Local Storage",
      content: "We use cookies and local storage to keep the website functional, remember preferences (theme, language), and understand visitor interaction through analytics. Where required by law, non-essential cookies will only be used with your consent. For more details, please see our Cookie Policy."
    },
    {
      title: "9. Data Retention",
      content: "We keep your personal data only for as long as necessary for the purposes described. This includes maintaining active account information, keeping payment records for tax obligations, and preserving support history. When your data is no longer needed, we will delete or anonymize it."
    },
    {
      title: "10. Data Security",
      content: "We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse. However, no online system is 100% secure. You are responsible for keeping your own accounts, passwords, and TradingView access secure."
    },
    {
      title: "11. International Data Transfers",
      content: "Some third-party providers may process data in countries outside your region of residence. Where required by law, we aim to use appropriate safeguards for international data transfers, such as contractual protections or other lawful transfer mechanisms."
    },
    {
      title: "12. Your Privacy Rights",
      content: "Depending on your location (including GDPR/Swiss FADP/UK GDPR/CCPA regions), you may have the right to access, correct, delete, object to, or restrict the processing of your data. To exercise your rights, contact us at contact@ichimokuedge.com."
    },
    {
      title: "13. Specific Notice for Users in the European Union",
      content: "EU users have specific rights under the GDPR. If you believe your data protection rights have not been respected, you may contact your local data protection authority. The relevant supervisory authority depends on your country of residence."
    },
    {
      title: "14. Specific Notice for Users in Switzerland",
      content: "Swiss users' data is protected under the Federal Act on Data Protection. You have rights to request access, correction, deletion, or restriction of your personal data, subject to applicable legal limits."
    },
    {
      title: "15. Specific Notice for Users in the United Kingdom",
      content: "UK users are protected under the UK GDPR and the Data Protection Act 2018. You have rights to access, correct, delete, restrict, object to processing, and request data portability where applicable."
    },
    {
      title: "16. Specific Notice for Users in Canada",
      content: "Canadian users are protected under PIPEDA and other applicable privacy laws. You have rights to access information we hold about you and request correction of inaccurate information."
    },
    {
      title: "17. Specific Notice for Users in the United States",
      content: "U.S. privacy rights vary by state (e.g., CCPA). Ichimoku Edge does not sell your personal data. We provide required notice and opt-out mechanisms where legally required for tracking technologies."
    },
    {
      title: "18. Specific Notice for Users in Other Countries",
      content: "We aim to respect applicable privacy rights worldwide. Depending on your location, you may have rights to access, correct, delete, or object to data processing. Contact us at contact@ichimokuedge.com for requests."
    },
    {
      title: "19. Children’s Privacy",
      content: "Ichimoku Edge is not intended for children. We do not knowingly collect personal data from children. If you believe a child has provided us with data, please contact us for appropriate action."
    },
    {
      title: "20. Changes to This Privacy Policy",
      content: "We may update this Privacy Policy from time to time. Any changes will be published on this page with an updated date. Continued use of Ichimoku Edge after changes are published means you accept the updated policy."
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
              プライバシーポリシー
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
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Last Updated: May 7, 2026</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
