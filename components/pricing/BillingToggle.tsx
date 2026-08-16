'use client';

import { motion } from 'framer-motion';

interface BillingToggleProps {
  isYearly: boolean;
  setIsYearly: (v: boolean) => void;
}

export default function BillingToggle({ isYearly, setIsYearly }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-16">
      <span className={`text-sm font-bold uppercase tracking-widest ${!isYearly ? 'text-text-primary' : 'text-text-muted'}`}>Monthly</span>
      <button
        onClick={() => setIsYearly(!isYearly)}
        className="relative w-14 h-7 bg-bg-secondary border border-border rounded-full p-1 transition-colors hover:border-accent"
      >
        <motion.div
          animate={{ x: isYearly ? 28 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-accent rounded-full"
        />
      </button>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold uppercase tracking-widest ${isYearly ? 'text-text-primary' : 'text-text-muted'}`}>Yearly</span>
        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full uppercase tracking-tighter">
          2 Months Free
        </span>
      </div>
    </div>
  );
}
