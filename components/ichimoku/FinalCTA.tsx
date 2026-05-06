'use client';

import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[200px] bg-[#fbe178]/5 blur-[100px] rotate-[-5deg]" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary tracking-tighter leading-tight uppercase">
            Master Structure. <br /> <span className="text-[#fbe178]">Remove Noise.</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
            Ready to experience the clarity of Ichimoku Kinko Hyo with institutional-grade tools?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/tools">
              <Button size="lg" className="!px-12 !py-6 text-lg rounded-full">
                Explore Ichimoku Edge
              </Button>
            </Link>
            <Link href="/pricing" className="text-text-muted hover:text-[#fbe178] transition-colors font-bold uppercase tracking-widest text-xs">
              View Pricing Plans
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
