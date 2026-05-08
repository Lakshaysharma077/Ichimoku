'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing the popup for a more professional feel
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-[calc(100vw-3rem)]"
        >
          <div className="bg-bg-secondary/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative group">
            {/* Background Kanji Watermark */}
            <div className="absolute -bottom-6 -right-6 text-8xl font-bold opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-700">
              同意
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <Cookie size={20} />
              </div>
              <Link href="/cookies" onClick={() => setShow(false)}>
                <h3 className="syne font-bold text-lg uppercase tracking-tight text-text-primary hover:text-accent transition-colors">
                  Cookie Policy
                </h3>
              </Link>
              <button 
                onClick={() => setShow(false)}
                className="ml-auto text-text-muted hover:text-text-primary transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed mb-8">
              We use cookies to optimize your experience on Ichimoku Edge. 
              By accepting, you allow us to remember your preferences and analyze traffic. 
              Review our <Link href="/cookies" onClick={() => setShow(false)} className="text-accent hover:underline font-bold decoration-accent/30 underline-offset-4">Cookie Policy</Link>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-accent text-bg-primary py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg shadow-accent/20 active:scale-95"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-bg-tertiary text-text-secondary border border-border/50 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:text-text-primary hover:bg-bg-secondary transition-all active:scale-95"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
