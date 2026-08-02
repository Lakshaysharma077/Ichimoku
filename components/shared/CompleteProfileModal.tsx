'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import TradingViewIcon from '../ui/TradingViewIcon';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CompleteProfileModal() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [tvUsername, setTvUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user && !(session.user as any).tradingViewUsername) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tvUsername) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradingViewUsername: tvUsername }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      // Update session
      await update({ tradingViewUsername: tvUsername });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="max-w-md w-full bg-bg-secondary border border-border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-accent/10 rounded-2xl mb-6">
              <TradingViewIcon className="w-10 h-10 text-accent" />
            </div>
            <h2 className="syne font-extrabold text-2xl text-text-primary uppercase tracking-tight mb-3">Complete Your Profile</h2>
            <p className="text-sm text-text-secondary">
              We need your TradingView username to grant you access to our premium institutional indicators.
            </p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Username Linked Successfully!</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1">TradingView Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                    <TradingViewIcon className="w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                  </div>
                  <input
                    required
                    type="text"
                    value={tvUsername}
                    onChange={(e) => setTvUsername(e.target.value)}
                    placeholder="your_tv_username"
                    className="w-full bg-bg-primary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                  />
                </div>
                {error && (
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-2">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !tvUsername}
                className="w-full !rounded-xl !py-6 !text-[10px] !tracking-[0.2em]"
              >
                {isLoading ? "LINKING ACCOUNT..." : "LINK TRADINGVIEW ACCOUNT"}
              </Button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-[10px] font-bold text-text-muted hover:text-text-primary uppercase tracking-[0.2em] transition-colors"
              >
                I&apos;ll do this later
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
