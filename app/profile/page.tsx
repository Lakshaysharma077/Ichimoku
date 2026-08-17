'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import TradingViewIcon from '@/components/ui/TradingViewIcon';
import {
  User,
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  CreditCard,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [tvUsername, setTvUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Profile and subscription state from API
  const [profileData, setProfileData] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activatingTrial, setActivatingTrial] = useState(false);
  const [trialError, setTrialError] = useState("");

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        if (data.user?.tradingViewUsername) {
          setTvUsername(data.user.tradingViewUsername);
        }
      }
    } catch (err) {
      console.error("Failed to load profile data:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    } else if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      const currentTv = (session.user as any).tradingViewUsername;
      if (currentTv && !tvUsername) {
        setTvUsername(currentTv);
      }
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
      await fetchProfileData();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrial = async () => {
    setActivatingTrial(true);
    setTrialError("");

    try {
      const res = await fetch('/api/user/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: "Samurai",
          tradingViewUsername: tvUsername,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start 7-day free trial.");
      }

      await fetchProfileData();
    } catch (err: any) {
      setTrialError(err.message || "An error occurred.");
    } finally {
      setActivatingTrial(false);
    }
  };

  if (status === 'loading') return null;

  const subInfo = profileData?.subscriptionInfo;
  const isTrial = subInfo?.isTrial;
  const trialDaysRemaining = subInfo?.trialDaysRemaining ?? 0;
  const hasActiveSub = subInfo?.hasActiveSubscription;
  const hasUsedTrial = subInfo?.hasUsedTrial || profileData?.user?.hasUsedTrial;
  const latestSub = subInfo?.latestSubscription;
  const isExpired = latestSub?.status === 'EXPIRED' || profileData?.accessProfile?.accessLevel === 'Expired Subscriber';

  // Format dates
  const trialEndDateStr = subInfo?.trialEndDate
    ? new Date(subInfo.trialEndDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const subExpiryDateStr = latestSub?.expiryDate
    ? new Date(latestSub.expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen pt-36 pb-20 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-8 bg-bg-secondary border border-border rounded-[2rem] text-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-accent/20 border-2 border-accent/20 mx-auto mb-6 overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent text-3xl font-bold uppercase">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <h2 className="syne font-extrabold text-xl text-text-primary uppercase tracking-tight">
                {session?.user?.name || "Trader"}
              </h2>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mt-1">
                {(session?.user as any)?.role || "USER"}
              </p>

              {/* Status Pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                {isTrial ? (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Trial Active
                  </span>
                ) : hasActiveSub ? (
                  <span className="bg-accent/10 text-accent border border-accent/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-accent" />
                    Active Subscriber
                  </span>
                ) : isExpired ? (
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-rose-400" />
                    Trial Expired
                  </span>
                ) : (
                  <span className="bg-bg-primary text-text-muted border border-border px-3 py-1 rounded-full flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    Free Explorer
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 bg-bg-secondary border border-border rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs truncate">{session?.user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                <Shield className="w-4 h-4 text-accent shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-widest">
                  Account: {(session?.user as any)?.provider || "Credentials"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. SUBSCRIPTION & TRIAL STATUS CARD */}
            <div className="bg-bg-secondary border border-border rounded-[2.5rem] p-8 relative overflow-hidden">
              {isTrial ? (
                /* ACTIVE TRIAL VIEW */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                        <Sparkles className="w-3 h-3" />
                        <span>7-Day Free Trial Active</span>
                      </div>
                      <h2 className="syne font-extrabold text-2xl text-text-primary uppercase tracking-tight">
                        {latestSub?.planName || "Samurai"} Indicator Suite
                      </h2>
                    </div>

                    {/* Countdown Banner */}
                    <div className="text-left sm:text-right bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-2xl">
                      <span className="text-2xl font-extrabold text-emerald-400 font-mono syne block leading-none">
                        {trialDaysRemaining} {trialDaysRemaining === 1 ? 'Day' : 'Days'}
                      </span>
                      <span className="text-[9px] text-text-muted font-mono uppercase tracking-widest">
                        Remaining in Trial
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar (7 Days) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-text-muted uppercase tracking-wider">
                      <span>Day 1 (Activated)</span>
                      <span>Expires {trialEndDateStr || 'in 7 days'}</span>
                    </div>
                    <div className="h-2 w-full bg-bg-primary rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(14, ((7 - trialDaysRemaining) / 7) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Access details */}
                  <div className="p-4 rounded-xl bg-bg-primary/60 border border-border text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Website Tools Access:</span>
                      <span className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                        <Unlock className="w-3.5 h-3.5" />
                        Active (Unlocked)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">TradingView Indicator Access:</span>
                      <span className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Pending Whitelist (@{profileData?.user?.tradingViewUsername || tvUsername || "Not Set"})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Payment During Trial:</span>
                      <span className="font-mono text-text-primary">$0.00 (Zero Charge)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Trial Expiry:</span>
                      <span className="font-mono font-bold text-text-primary">{trialEndDateStr}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-4">
                    <Link href="/tools" className="flex-1">
                      <Button size="lg" className="w-full !rounded-xl !text-xs !py-5 font-bold">
                        Open Indicator Suite →
                      </Button>
                    </Link>
                    <Link href="/checkout?plan=Samurai" className="flex-1">
                      <Button size="lg" variant="outline" className="w-full !rounded-xl !text-xs !py-5 font-bold">
                        Upgrade to Paid Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : isExpired ? (
                /* EXPIRED TRIAL VIEW */
                <div className="space-y-6">
                  <div className="border-b border-border/70 pb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                      <Lock className="w-3 h-3" />
                      <span>Trial Expired • Payment Required</span>
                    </div>
                    <h2 className="syne font-extrabold text-2xl text-text-primary uppercase tracking-tight">
                      Your 7-Day Free Trial Has Concluded
                    </h2>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      Your trial period expired on <strong className="text-text-primary font-mono">{subExpiryDateStr || "recently"}</strong>. Premium website tools and TradingView indicator whitelisting are temporarily suspended until a paid subscription is completed.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-bg-primary/60 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>One-Time Trial Limit</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      To maintain platform integrity and fair access, free trials cannot be restarted repeatedly. Choose a paid plan below to instantly restore full access.
                    </p>
                  </div>

                  <Link href="/checkout?plan=Samurai">
                    <Button size="lg" className="w-full !rounded-xl !py-6 !text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(251,225,120,0.2)]">
                      Purchase Paid Subscription ($22/mo) →
                    </Button>
                  </Link>
                </div>
              ) : hasActiveSub ? (
                /* ACTIVE PAID SUBSCRIBER VIEW */
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                        <Shield className="w-3 h-3" />
                        <span>Active Pro Subscription</span>
                      </div>
                      <h2 className="syne font-extrabold text-2xl text-text-primary uppercase tracking-tight">
                        {latestSub?.planName || "Samurai"} Plan
                      </h2>
                    </div>

                    <div className="text-left sm:text-right bg-accent/10 border border-accent/20 px-4 py-2.5 rounded-2xl">
                      <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest block">
                        Renews / Expires
                      </span>
                      <span className="text-sm font-bold text-text-primary font-mono">
                        {subExpiryDateStr || "Active"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-bg-primary/60 border border-border text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Website Tools Access:</span>
                      <span className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                        <Unlock className="w-3.5 h-3.5" />
                        Active (Full Suite Unlocked)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">TradingView Username:</span>
                      <span className="font-mono font-bold text-accent">@{profileData?.user?.tradingViewUsername || tvUsername || "Configured"}</span>
                    </div>
                  </div>

                  <Link href="/tools">
                    <Button size="lg" className="w-full !rounded-xl !py-5 !text-xs font-bold">
                      Launch Tools & Indicators →
                    </Button>
                  </Link>
                </div>
              ) : (
                /* FREE EXPLORER VIEW (ELIGIBLE OR NOT) */
                <div className="space-y-6">
                  <div className="border-b border-border/70 pb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-bold uppercase tracking-widest mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>Free Explorer Tier</span>
                    </div>
                    <h2 className="syne font-extrabold text-2xl text-text-primary uppercase tracking-tight">
                      Experience 7 Days Free
                    </h2>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      Unlock the complete Samurai Pine Script v5 indicator suite, multi-timeframe scanner, and cloud signals with zero payment required today.
                    </p>
                  </div>

                  {trialError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{trialError}</span>
                    </div>
                  )}

                  {!hasUsedTrial ? (
                    <Button
                      size="lg"
                      onClick={handleStartTrial}
                      disabled={activatingTrial}
                      className="w-full !rounded-xl !py-6 !text-xs font-bold tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      {activatingTrial ? (
                        <span className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          Activating 7-Day Trial...
                        </span>
                      ) : (
                        "Start 7-Day Free Trial ($0.00)"
                      )}
                    </Button>
                  ) : (
                    <Link href="/checkout?plan=Samurai">
                      <Button size="lg" className="w-full !rounded-xl !py-6 !text-xs font-bold tracking-wider">
                        Upgrade to Paid Plan ($22/mo) →
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* 2. TRADINGVIEW WHITELIST & SETTINGS CARD */}
            <div className="bg-bg-secondary border border-border rounded-[2.5rem] p-8">
              <h2 className="syne font-extrabold text-2xl text-text-primary uppercase tracking-tight mb-6">
                TradingView Whitelisting
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest ml-1 flex justify-between">
                    TradingView Username
                    <span className="text-[9px] text-accent/80 lowercase tracking-normal font-sans">
                      Whitelists invite-only indicators on TradingView
                    </span>
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                      <TradingViewIcon className="w-4 h-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      value={tvUsername}
                      onChange={(e) => setTvUsername(e.target.value)}
                      placeholder="e.g. TradingNinja99"
                      className="w-full bg-bg-primary border border-border rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="!rounded-xl !py-5 !px-8 !text-[10px] !tracking-[0.2em]"
                  >
                    {isLoading ? "SAVING..." : "UPDATE USERNAME"}
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

            {/* 3. RECENT PAYMENTS / TRANSACTION HISTORY CARD (IF ANY) */}
            {profileData?.payments && profileData.payments.length > 0 && (
              <div className="bg-bg-secondary border border-border rounded-[2.5rem] p-8">
                <h3 className="syne font-bold text-xl text-text-primary uppercase tracking-tight mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span>Payment History</span>
                </h3>

                <div className="space-y-3">
                  {profileData.payments.map((p: any) => (
                    <div
                      key={p.id}
                      className="p-4 bg-bg-primary/50 border border-border rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-text-primary uppercase block">
                          {p.plan} Plan
                        </span>
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(p.createdAt).toLocaleDateString()} • {p.paymentMethod} ({p.network})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-accent block">
                          ${p.amount} {p.currency}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase ${
                          p.status === 'Approved' ? 'text-emerald-400' :
                          p.status === 'Pending' || p.status === 'Pending Verification' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}

