'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Check, X } from 'lucide-react';

interface PricingCardProps {
  name: string;
  kanji: string;
  price: string;
  period: string;
  tagline: string;
  features: { text: string; included: boolean }[];
  isFeatured?: boolean;
  isTrial?: boolean;
  ctaText: string;
}

export default function PricingCard({ 
  name, 
  kanji, 
  price, 
  period, 
  tagline, 
  features, 
  isFeatured, 
  isTrial,
  ctaText 
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`relative p-8 rounded-2xl border flex flex-col h-full transition-all duration-300 ${
        isFeatured 
          ? 'bg-bg-secondary border-accent shadow-2xl scale-105 z-10' 
          : 'bg-bg-primary border-border'
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-bg-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Most Popular
        </div>
      )}

      {isTrial && (
        <div className="mb-6 py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            14-Day Free Trial — No Card Required
          </span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="syne font-bold text-2xl text-text-primary uppercase">{name}</h3>
          <span className="shippori-mincho text-xl text-text-muted">{kanji}</span>
        </div>
        <p className="text-sm text-text-secondary mb-6">{tagline}</p>
        <div className="flex items-baseline gap-1">
          <motion.span 
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold syne text-text-primary"
          >
            {price}
          </motion.span>
          <span className="text-text-muted font-mono text-xs uppercase">{period}</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-10">
        {features.map((feature, i) => (
          <div key={i} className="flex gap-3 items-start text-sm">
            {feature.included ? (
              <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-text-muted mt-0.5" />
            )}
            <span className={feature.included ? 'text-text-secondary' : 'text-text-muted line-through opacity-50'}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Button className="w-full" variant={isFeatured ? 'solid' : 'outline'}>
          {ctaText}
        </Button>
        {isFeatured && (
          <p className="text-[10px] text-center text-text-muted font-mono uppercase tracking-widest">
            Then $29/mo. Cancel anytime.
          </p>
        )}
      </div>
    </motion.div>
  );
}
