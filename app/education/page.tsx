'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Button from '@/components/ui/Button';
import { Youtube, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EducationPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-24 relative overflow-hidden">
      <KanjiWatermark kanji="資料" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" size="40vw" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center relative z-10">
        <ScrollReveal>
          <div className="inline-flex p-6 bg-rose-500/10 rounded-full mb-8">
            <Youtube className="w-12 h-12 text-rose-500" />
          </div>
          
          <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tight" style={{ wordSpacing: '0.2em' }}>
            Resources Hub
          </h1>
          <p className="shippori-mincho text-2xl text-text-muted mb-8">
            資料ハブ
          </p>
          
          <p className="text-xl text-text-secondary leading-relaxed mb-12">
            Free Ichimoku trading tutorials, strategy breakdowns, and live analysis videos. Subscribe to our YouTube channel to be notified when new resources drop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white flex gap-2 items-center">
              <Youtube className="w-5 h-5" /> Subscribe on YouTube
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="flex gap-2 items-center">
                <ArrowLeft className="w-4 h-4" /> Back to Philosophy
              </Button>
            </Link>
          </div>

          <div className="max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded-lg py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <Button type="submit">Notify Me</Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 font-bold text-sm uppercase tracking-widest"
              >
                ✓ You're on the list! We'll email you when we launch.
              </motion.div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
