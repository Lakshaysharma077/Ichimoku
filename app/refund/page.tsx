'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';

export default function RefundPage() {
  const sections = [
    {
      title: "1. 14-Day Free Trial",
      content: "All premium subscriptions come with a 14-day free trial. You will not be charged during this period, and you can cancel anytime to prevent any future billing."
    },
    {
      title: "2. Monthly Subscriptions",
      content: "Monthly subscriptions are non-refundable once the billing period has commenced. You may cancel at any time to prevent the next month's charge, and you will retain access until the end of your current cycle."
    },
    {
      title: "3. Annual Subscriptions",
      content: "Annual subscriptions are eligible for prorated refunds in specific cases. If you wish to cancel an annual plan mid-cycle, please contact support to discuss your options."
    },
    {
      title: "4. Cryptocurrency Payments",
      content: "Refunds for payments made in USDT/USDC are subject to network fees and will be processed back to the original sending wallet address. We are not responsible for funds sent to incorrect addresses."
    },
    {
      title: "5. Digital Goods Policy",
      content: "Because our indicators are digital goods delivered via TradingView, 'Invite-only' access is considered the delivery of service. Please ensure you use the 14-day trial to verify the tools meet your needs before subscribing."
    }
  ];

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">

      
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-4xl lg:text-6xl text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              Refund Policy
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Transparent rules for cancellations, trials, and subscription management.
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
