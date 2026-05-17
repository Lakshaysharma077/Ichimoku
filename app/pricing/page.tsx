'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import BillingToggle from '@/components/pricing/BillingToggle';
import PricingCard from '@/components/pricing/PricingCard';
import PaymentMethods from '@/components/pricing/PaymentMethods';
import Button from '@/components/ui/Button';
import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';
import EditableList from '@/components/admin/EditableList';
import { useEditStore } from '@/lib/store/useEditStore';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const pricing = useContent('pricing');
  const { isEditMode } = useEditStore();

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1 className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="pricing" path={['hero', 'heading']} content={pricing.hero.heading} />
            </h1>

            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              <EditableElement section="pricing" path={['hero', 'description']} content={pricing.hero.description} />
            </p>
          </ScrollReveal>
        </div>

        <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <EditableList
          section="pricing"
          path={['tiers']}
          items={[...pricing.tiers]}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24"
          newItemTemplate={{
            name: "New Tier",
            monthlyPrice: "$99",
            yearlyPrice: "$79",
            tagline: "New description",
            ctaText: "Get Started",
            features: [{ text: "New feature", included: true }]
          }}
          renderItem={(tier: any, i: number) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <PricingCard
                {...tier}
                price={isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                period={isYearly ? "/ mo billed yearly" : "/ mo"}
                // Pass indices for inline editing inside PricingCard
                index={i}
                isYearly={isYearly}
              />
            </ScrollReveal>
          )}
        />

        <PaymentMethods />

        {/* Trial Guarantee Banner */}
        <ScrollReveal delay={0.3}>
          <div className="mt-24 bg-bg-secondary border border-border rounded-3xl p-12 text-center relative overflow-hidden">

            <div className="relative z-10">
              <h2 className="syne font-bold text-3xl lg:text-4xl text-text-primary mb-4">
                <EditableElement section="pricing" path={['trialGuarantee', 'heading']} content={pricing.trialGuarantee.heading} />
              </h2>

              <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                <EditableElement section="pricing" path={['trialGuarantee', 'description']} content={pricing.trialGuarantee.description} />
              </p>
              <Button size="lg">
                <EditableElement section="pricing" path={['trialGuarantee', 'button']} content={pricing.trialGuarantee.button} />
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
