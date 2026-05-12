'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import TradingViewIcon from '@/components/ui/TradingViewIcon';
import { User, Mail, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [tvUsername, setTvUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth');
    }
  }, [status]);

  useEffect(() => {
    if (session?.user) {
      setTvUsername((session.user as any).tradingViewUsername || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tradingViewUsername: tvUsername }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      await update({ tradingViewUsername: tvUsername });
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-bg-secondary border border-border rounded-[2rem] text-center">
              <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/20 mx-auto mb-6 overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent text-3xl font-bold uppercase">
                    {session?.user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="syne font-extrabold text-xl text-text-primary uppercase tracking-tight">{session?.user?.name}</h2>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mt-1">{(session?.user as any).role}</p>
            </div>

            <div className="p-6 bg-bg-secondary border border-border rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-xs truncate">{session?.user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Account: {(session?.user as any).provider || "Email"}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-bg-secondary border border-border rounded-[2.5rem] p-8 sm:p-12">
              <h1 className="syne font-extrabold text-3xl text-text-primary uppercase tracking-tight mb-8">Account Settings</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">Platform Integration</h3>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1 flex justify-between">
                      TradingView Username
                      <span className="text-[8px] text-accent/70 lowercase tracking-normal font-sans">Used for indicator whitelisting</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                        <TradingViewIcon className="w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={tvUsername}
                        onChange={(e) => setTvUsername(e.target.value)}
                        placeholder="your_tv_username"
                        className="w-full bg-bg-primary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="!rounded-xl !py-6 !px-10 !text-[10px] !tracking-[0.2em]"
                  >
                    {isLoading ? "SAVING CHANGES..." : "SAVE PROFILE"}
                  </Button>

                  <AnimatePresence>
                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Changes Saved!
                      </motion.div>
                    )}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
