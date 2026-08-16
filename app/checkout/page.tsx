'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  User,
  Mail,
  Globe,
  Sparkles,
  Upload,
  Image as ImageIcon,
  FileCheck,
  X,
  Lock,
  ExternalLink
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import {
  NETWORK_OPTIONS,
  SUPPORTED_PAYMENT_COMBINATIONS,
  getOfficialDepositAddress,
  getNetworkWarning,
  OFFICIAL_PRICING,
  PaymentMethod,
  NetworkId,
  getExplorerTxUrl,
} from '@/lib/payments';

// SVG QR Code generator representation matching deposit details
function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-white/20 inline-block relative overflow-hidden group transition-transform hover:scale-105 duration-300">
      <div className="absolute left-0 right-0 h-[2px] bg-accent/60 opacity-0 group-hover:opacity-100 group-hover:animate-[scanSweep_2s_ease_infinite] pointer-events-none" />
      <svg className="w-44 h-44 text-black fill-current" viewBox="0 0 29 29">
        <rect x="0" y="0" width="7" height="7" />
        <rect x="1" y="1" width="5" height="5" fill="white" />
        <rect x="2" y="2" width="3" height="3" />

        <rect x="22" y="0" width="7" height="7" />
        <rect x="23" y="1" width="5" height="5" fill="white" />
        <rect x="24" y="2" width="3" height="3" />

        <rect x="0" y="22" width="7" height="7" />
        <rect x="1" y="23" width="5" height="5" fill="white" />
        <rect x="2" y="24" width="3" height="3" />

        <rect x="20" y="20" width="5" height="5" />
        <rect x="21" y="21" width="3" height="3" fill="white" />
        <rect x="22" y="22" width="1" height="1" />

        <rect x="8" y="6" width="1" height="1" /><rect x="10" y="6" width="1" height="1" /><rect x="12" y="6" width="1" height="1" /><rect x="14" y="6" width="1" height="1" /><rect x="16" y="6" width="1" height="1" /><rect x="18" y="6" width="1" height="1" /><rect x="20" y="6" width="1" height="1" />
        <rect x="6" y="8" width="1" height="1" /><rect x="6" y="10" width="1" height="1" /><rect x="6" y="12" width="1" height="1" /><rect x="6" y="14" width="1" height="1" /><rect x="6" y="16" width="1" height="1" /><rect x="6" y="18" width="1" height="1" /><rect x="6" y="20" width="1" height="1" />

        <rect x="8" y="0" width="1" height="2" />
        <rect x="10" y="1" width="2" height="1" />
        <rect x="13" y="0" width="1" height="3" />
        <rect x="16" y="2" width="2" height="2" />
        <rect x="19" y="1" width="1" height="1" />
        <rect x="9" y="4" width="3" height="1" />
        <rect x="14" y="4" width="1" height="2" />
        <rect x="17" y="5" width="2" height="1" />
        <rect x="8" y="8" width="2" height="1" />
        <rect x="11" y="9" width="1" height="3" />
        <rect x="13" y="8" width="3" height="1" />
        <rect x="17" y="8" width="1" height="2" />
        <rect x="19" y="9" width="2" height="1" />
        <rect x="9" y="12" width="1" height="2" />
        <rect x="11" y="14" width="2" height="1" />
        <rect x="14" y="11" width="1" height="3" />
        <rect x="16" y="13" width="3" height="1" />
        <rect x="20" y="11" width="2" height="2" />
        <rect x="8" y="16" width="3" height="1" />
        <rect x="12" y="17" width="1" height="2" />
        <rect x="14" y="16" width="2" height="1" />
        <rect x="17" y="16" width="1" height="3" />
        <rect x="19" y="18" width="2" height="1" />
        <rect x="9" y="20" width="2" height="2" />
        <rect x="13" y="20" width="1" height="1" />
        <rect x="15" y="21" width="3" height="1" />
        <rect x="8" y="23" width="1" height="3" />
        <rect x="10" y="25" width="3" height="1" />
        <rect x="14" y="24" width="1" height="2" />
        <rect x="16" y="23" width="2" height="1" />
        <rect x="19" y="25" width="1" height="3" />
      </svg>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  // URL Params
  const plan = searchParams.get('plan') || 'Samurai';
  const isYearly = searchParams.get('yearly') === 'true';

  // Official Confirmed Pricing in USD
  const amountDue = isYearly ? OFFICIAL_PRICING.yearly.amount : OFFICIAL_PRICING.monthly.amount;
  const billingPeriodLabel = isYearly ? 'Yearly' : 'Monthly';

  // State: Customer Info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [tradingViewUsername, setTradingViewUsername] = useState('');
  const [country, setCountry] = useState('');

  // State: Transaction Hash (TXID) & Payment Screenshot
  const [txnHash, setTxnHash] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // State: Crypto Payment Selection (USDT vs USDC & Network)
  const [selectedToken, setSelectedToken] = useState<PaymentMethod>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>('arbitrum');
  const [copied, setCopied] = useState(false);

  // State: Form submission & status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedPayment, setSubmittedPayment] = useState<any | null>(null);

  // Auto-populate from logged-in session
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setCustomerName((prev) => prev || session.user.name || '');
      if (session.user.email) setCustomerEmail((prev) => prev || session.user.email || '');
      if ((session.user as any).tradingViewUsername) {
        setTradingViewUsername((prev) => prev || (session.user as any).tradingViewUsername || '');
      }
    }
  }, [session]);

  // Handle Token Switch: Automatically switch network if invalid for newly selected token
  const handleSelectToken = (token: PaymentMethod) => {
    setSelectedToken(token);
    const validNetworks = SUPPORTED_PAYMENT_COMBINATIONS[token];
    if (!validNetworks.includes(selectedNetwork)) {
      // Default to Arbitrum or Ethereum if current network is invalid for this token
      setSelectedNetwork('arbitrum');
    }
  };

  // Get active deposit wallet address from single source of truth
  const activeWalletAddress = getOfficialDepositAddress(selectedToken, selectedNetwork) || '';
  const currentNetworkConfig = NETWORK_OPTIONS.find((n) => n.id === selectedNetwork) || NETWORK_OPTIONS[0];
  const warningText = getNetworkWarning(selectedToken);

  // Copy click handler
  const handleCopy = () => {
    if (!activeWalletAddress) return;
    navigator.clipboard.writeText(activeWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // File Screenshot Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/payments/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload screenshot.');
      }

      setScreenshotUrl(data.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  // Submit payment request
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!customerName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid Email Address.');
      return;
    }
    if (!tradingViewUsername.trim()) {
      setErrorMessage('TradingView Username is required so we can grant indicator access.');
      return;
    }
    if (!txnHash.trim()) {
      setErrorMessage('Transaction Hash (TXID) is required to verify on-chain payment.');
      return;
    }
    if (!activeWalletAddress) {
      setErrorMessage('Invalid cryptocurrency and network combination selected.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          amount: amountDue,
          currency: 'USD',
          billingPeriod: isYearly ? 'yearly' : 'monthly',
          paymentMethod: selectedToken,
          network: `${currentNetworkConfig.name} (${currentNetworkConfig.badge})`,
          walletAddressUsed: activeWalletAddress,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          tradingViewUsername: tradingViewUsername.trim(),
          country: country.trim() || undefined,
          txnHash: txnHash.trim(),
          paymentScreenshot: screenshotUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to record payment request.');
      }

      setSubmittedPayment({
        id: data.paymentId,
        plan,
        amount: amountDue,
        currency: 'USD',
        token: selectedToken,
        network: currentNetworkConfig.name,
        badge: currentNetworkConfig.badge,
        walletAddress: activeWalletAddress,
        tradingViewUsername: tradingViewUsername.trim(),
        customerEmail: customerEmail.trim(),
        txnHash: txnHash.trim(),
        verification: data.verification,
        createdAt: new Date().toLocaleString(),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Features list for summary sidebar
  const getFeatures = () => {
    if (plan.toLowerCase() === 'explorer') {
      return [
        'TK Cross Alert (Free indicator)',
        'S/R Auto indicator',
        'Community Discord access',
        'Education resources'
      ];
    } else if (plan.toLowerCase() === 'daimyo') {
      return [
        'ALL Free & Premium indicators',
        'Ichimoku Edge Pro indicator',
        'MTF Dashboard + Cloud Scanner',
        '1-on-1 Strategy consultation',
        'Custom indicator requests',
        'VIP Telegram alerts group'
      ];
    } else {
      return [
        'ALL Free & Premium indicators',
        'Ichimoku Edge Pro indicator',
        'MTF Ichimoku Table dashboard',
        'Kumo Cloud Scanner',
        'Chikou Span Analyzer',
        'Priority email support'
      ];
    }
  };

  const { url: submittedExplorerUrl } = submittedPayment?.txnHash
    ? getExplorerTxUrl(submittedPayment.network, submittedPayment.txnHash)
    : { url: '#' };

  return (
    <div className="pt-36 pb-24 relative overflow-hidden min-h-[100svh]">
      {/* Radial Background Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.push('/pricing')}
          className="group flex items-center gap-2 text-text-muted hover:text-accent transition-colors text-xs font-mono uppercase tracking-widest mb-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Pricing Plans</span>
        </button>

        {/* Page Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Crypto Checkout</span>
          </div>
          <h1 className="syne font-extrabold text-3xl lg:text-4xl text-text-primary uppercase tracking-tight">
            Checkout & Indicator Activation
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Pay with USDT or USDC, submit your Transaction Hash (TXID), and activate your invite-only TradingView indicator suite.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submittedPayment ? (
            /* SUCCESS / CONFIRMATION VIEW */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto py-8"
            >
              <Card className="p-8 md:p-12 relative overflow-hidden border-emerald-500/30">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 animate-pulse" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    Payment Request Registered
                  </span>
                  <h2 className="syne font-bold text-2xl lg:text-3xl text-text-primary uppercase mt-3 mb-2 tracking-tight">
                    Thank You, {customerName}!
                  </h2>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
                    Your TXID has been submitted for on-chain verification. Indicator access will be activated following admin confirmation.
                  </p>
                </div>

                {/* Submitted Order Details */}
                <div className="bg-bg-primary/60 border border-border rounded-2xl p-6 mb-8 text-xs space-y-3.5">
                  <div className="flex justify-between items-center border-b border-border/50 pb-3">
                    <span className="text-text-muted">Payment Reference ID:</span>
                    <span className="font-mono font-bold text-text-primary">{submittedPayment.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Plan:</span>
                    <span className="font-bold text-text-primary uppercase">{submittedPayment.plan} ({billingPeriodLabel})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Amount Due / Sent:</span>
                    <span className="font-bold font-mono text-accent text-sm">${submittedPayment.amount} USD ({submittedPayment.token})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Network:</span>
                    <span className="font-mono font-bold text-text-primary">{submittedPayment.network} ({submittedPayment.badge})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">TradingView Username:</span>
                    <span className="font-mono font-bold text-accent">{submittedPayment.tradingViewUsername}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">TXID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-text-primary truncate max-w-[150px]" title={submittedPayment.txnHash}>
                        {submittedPayment.txnHash}
                      </span>
                      {submittedExplorerUrl !== '#' && (
                        <a
                          href={submittedExplorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1 font-mono text-[10px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="text-text-muted">Verification Status:</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-0.5 rounded-md font-mono">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      Pending Verification
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full" onClick={() => router.push('/tools')}>
                    Explore Tools Page
                  </Button>
                  <Button size="lg" variant="outline" className="w-full" onClick={() => setSubmittedPayment(null)}>
                    Submit Another Payment
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            /* MAIN FORM VIEW */
            <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-8 items-start">

              <div className="space-y-6">

                {/* Step 1: Customer Information */}
                <Card className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3.5 border-b border-border pb-5">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-bold font-mono">
                      1
                    </div>
                    <div>
                      <h3 className="syne font-bold text-lg text-text-primary uppercase">Customer Information</h3>
                      <p className="text-xs text-text-muted uppercase font-mono tracking-widest mt-0.5">Required for TradingView Indicator Activation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Customer Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent" />
                        <span>Customer Name <span className="text-red-400">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Satoshi Nakamoto"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/50"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-accent" />
                        <span>Email Address <span className="text-red-400">*</span></span>
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. satoshi@domain.com"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/50"
                      />
                    </div>

                    {/* TradingView Username */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                          <span>TradingView Username <span className="text-red-400">*</span></span>
                        </span>
                        <span className="text-[10px] text-accent lowercase">required to grant invite-only indicators</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={tradingViewUsername}
                        onChange={(e) => setTradingViewUsername(e.target.value)}
                        placeholder="e.g. TradingNinja99"
                        className="w-full bg-bg-primary border border-accent/40 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/50 font-mono font-medium shadow-[0_0_12px_rgba(41,98,255,0.08)]"
                      />
                    </div>

                    {/* Country (Optional) */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-text-muted" />
                        <span>Country <span className="text-text-muted text-[10px] font-normal">(Optional)</span></span>
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. United States, United Kingdom, Singapore"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/50"
                      />
                    </div>
                  </div>
                </Card>

                {/* Step 2: Payment Method & Deposit Details */}
                <Card className="p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-3.5 border-b border-border pb-5">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-sm font-bold font-mono">
                      2
                    </div>
                    <div>
                      <h3 className="syne font-bold text-lg text-text-primary uppercase">Payment Options</h3>
                      <p className="text-xs text-text-muted uppercase font-mono tracking-widest mt-0.5">Select USDT or USDC & Network</p>
                    </div>
                  </div>

                  {/* Token Selection (USDT vs USDC) */}
                  <div className="space-y-3">
                    <label className="text-xs text-text-muted uppercase font-mono tracking-widest block">
                      Select Cryptocurrency
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['USDT', 'USDC'] as const).map((token) => (
                        <button
                          type="button"
                          key={token}
                          onClick={() => handleSelectToken(token)}
                          className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all duration-300 ${
                            selectedToken === token
                              ? 'border-[#2962FF] bg-[#2962FF]/10 shadow-[0_0_15px_rgba(41,98,255,0.18)]'
                              : 'border-border bg-bg-primary/40 hover:border-text-secondary/30'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm ${
                            token === 'USDC' ? 'bg-[#2775CA] text-white' : 'bg-[#26A17B] text-white'
                          }`}>
                            {token === 'USDC' ? '$' : '₮'}
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-text-primary block text-base">{token}</span>
                            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wide">
                              {token === 'USDC' ? 'USD Coin' : 'Tether USD'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blockchain Network Selector - Strictly Enforcing Supported Pairs */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-text-muted uppercase font-mono tracking-widest block">
                        Select Blockchain Network
                      </label>
                      <span className="text-[10px] font-mono text-accent uppercase">
                        {selectedToken === 'USDT' ? 'Ethereum, Arbitrum, Avalanche, TRON' : 'Ethereum, Arbitrum, Avalanche, Solana'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {NETWORK_OPTIONS.map((net) => {
                        const isValidForToken = SUPPORTED_PAYMENT_COMBINATIONS[selectedToken].includes(net.id);
                        const isSelected = selectedNetwork === net.id && isValidForToken;

                        if (!isValidForToken) {
                          return (
                            <div
                              key={net.id}
                              className="p-3 rounded-xl border border-border/30 bg-bg-primary/20 opacity-40 cursor-not-allowed flex flex-col items-center justify-center text-center gap-1.5"
                              title={`${net.name} does not support ${selectedToken}`}
                            >
                              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-text-muted">
                                {net.badge}
                              </span>
                              <span className="text-xs text-text-muted font-bold font-sans">
                                {net.name}
                              </span>
                              <span className="text-[9px] text-red-400 font-mono">Not Supported</span>
                            </div>
                          );
                        }

                        return (
                          <button
                            type="button"
                            key={net.id}
                            onClick={() => setSelectedNetwork(net.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all duration-300 ${
                              isSelected
                                ? `${net.activeBorderColor} ${net.glowClass} bg-bg-secondary`
                                : `border-border bg-bg-primary/40 ${net.hoverBgColor}`
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${net.color}`}>
                              {net.badge}
                            </span>
                            <span className="text-xs text-text-primary font-bold font-sans">
                              {net.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Deposit Wallet Instructions & QR Code Panel */}
                  <div className="bg-bg-secondary/60 border border-border/70 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-60 ${currentNetworkConfig.color}`} />

                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* QR Code */}
                      <div className="shrink-0 flex flex-col items-center gap-2">
                        <QRCodeDisplay value={`${selectedToken.toLowerCase()}:${activeWalletAddress}?amount=${amountDue}`} />
                        <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
                          Scan to Deposit
                        </span>
                      </div>

                      {/* Payment Details & Address Copy */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest block">
                            Exact Payment Amount
                          </span>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl font-extrabold text-text-primary syne tracking-tight font-mono">
                              ${amountDue}
                            </span>
                            <span className="text-base font-bold text-accent">
                              USD ({selectedToken})
                            </span>
                            {isYearly && (
                              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                2 Months Free Included
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Deposit Address Box */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-text-muted uppercase font-mono tracking-widest block">
                              Deposit Wallet Address ({currentNetworkConfig.name})
                            </span>
                            <span className={`text-[10px] font-mono font-bold uppercase ${currentNetworkConfig.color}`}>
                              {currentNetworkConfig.badge}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 bg-bg-primary border border-border rounded-xl px-3.5 py-3 w-full justify-between group hover:border-accent/40 transition-colors">
                            <span className="text-xs font-mono text-text-primary truncate pr-2 select-all">
                              {activeWalletAddress}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopy}
                              className="shrink-0 px-3 py-1.5 bg-bg-secondary hover:bg-accent/10 border border-border hover:border-accent/30 rounded-lg text-text-muted hover:text-accent transition-all flex items-center gap-1.5 text-xs font-mono"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Address</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Network Warning Note */}
                        <div className="bg-bg-primary/50 border border-amber-500/30 rounded-xl p-3.5 text-xs text-text-secondary flex items-start gap-2.5">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] leading-relaxed text-text-muted font-sans">
                            <strong className="text-amber-300 block mb-0.5">NETWORK WARNING:</strong>
                            {warningText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Hash (TXID) - REQUIRED */}
                    <div className="pt-4 border-t border-border/40 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex justify-between">
                        <span className="flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-accent" />
                          <span>Transaction Hash (TXID) <span className="text-red-400">*</span></span>
                        </span>
                        <span className="text-[10px] text-accent font-normal lowercase">required to verify transfer on-chain</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={txnHash}
                        onChange={(e) => setTxnHash(e.target.value)}
                        placeholder="e.g. 0x7a89f... or Solana / TRON transaction hash"
                        className="w-full bg-bg-primary border border-accent/40 rounded-xl px-4 py-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/40 shadow-[0_0_10px_rgba(41,98,255,0.08)]"
                      />
                    </div>

                    {/* Payment Screenshot Uploader (OPTIONAL) */}
                    <div className="pt-4 border-t border-border/40 space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-text-muted" />
                          <span>Payment Screenshot <span className="text-text-muted text-[10px] font-normal">(Optional)</span></span>
                        </span>
                        <span className="text-[10px] text-text-muted">JPG, PNG, WEBP max 10MB</span>
                      </label>

                      {screenshotUrl ? (
                        <div className="flex items-center justify-between bg-bg-primary border border-emerald-500/40 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <img src={screenshotUrl} alt="Receipt preview" className="w-12 h-12 object-cover rounded-lg border border-border" />
                            <div>
                              <span className="text-xs font-mono text-emerald-400 font-bold block flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Screenshot Uploaded
                              </span>
                              <span className="text-[10px] text-text-muted truncate max-w-[200px] block">{screenshotUrl}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setScreenshotUrl(null)}
                            className="p-1.5 text-text-muted hover:text-red-400 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full p-4 bg-bg-primary/50 hover:bg-bg-primary border border-dashed border-border hover:border-accent/50 rounded-xl cursor-pointer transition-colors group">
                          <Upload className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors mb-1.5" />
                          <span className="text-xs text-text-secondary font-sans font-medium">
                            {isUploading ? 'Uploading screenshot...' : 'Click to attach payment receipt / screenshot'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Action Button: "I've Sent the Payment" */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full py-4 text-base font-bold tracking-wide"
                      disabled={isSubmitting || isUploading}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 animate-spin" />
                          Registering Payment Request...
                        </span>
                      ) : (
                        "I've Sent the Payment"
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-text-muted font-mono uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Triggers blockchain verification & admin indicator activation</span>
                    </p>
                  </div>

                </Card>
              </div>

              {/* Order Summary Sidebar */}
              <div className="space-y-6">
                <Card className="p-6 md:p-8 bg-bg-secondary/40 border border-border/80 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-transparent" />

                  <h3 className="syne font-bold text-lg text-text-primary uppercase tracking-tight mb-6">
                    Order Summary
                  </h3>

                  {/* Selected Plan Details */}
                  <div className="flex items-start justify-between border-b border-border pb-6 mb-6">
                    <div>
                      <h4 className="font-bold text-text-primary uppercase text-lg">{plan} Plan</h4>
                      <span className="text-xs text-text-muted font-mono uppercase tracking-wider block mt-1">
                        Billed {billingPeriodLabel} {isYearly && '(2 Months Free)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-text-primary block font-mono">
                        ${amountDue} USD
                      </span>
                      <span className="text-[10px] text-text-muted font-mono uppercase tracking-widest block">
                        {isYearly ? '/ year' : '/ month'}
                      </span>
                    </div>
                  </div>

                  {/* Line Item Breakdown */}
                  <div className="space-y-3.5 text-sm border-b border-border pb-6 mb-6 font-sans">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subscription ({billingPeriodLabel})</span>
                      <span className="font-mono text-text-primary">${amountDue}.00 USD</span>
                    </div>
                    {isYearly && (
                      <div className="flex justify-between text-emerald-400 text-xs font-mono uppercase tracking-wide">
                        <span>Annual Savings</span>
                        <span>2 Months Free</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Crypto Processing Fee
                      </span>
                      <span className="font-mono text-emerald-400">$0.00</span>
                    </div>
                  </div>

                  {/* Total Due Today */}
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="font-bold text-text-primary uppercase text-sm">Total Due Today</span>
                    <div className="text-right">
                      <span className="text-3xl font-extrabold text-accent syne tracking-tight font-mono">
                        ${amountDue}
                      </span>
                      <span className="text-xs text-text-muted font-mono block mt-0.5 uppercase">
                        USD in {selectedToken} ({currentNetworkConfig.name})
                      </span>
                    </div>
                  </div>

                  {/* Included Tools / Indicators */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] text-text-muted uppercase font-mono tracking-widest border-b border-border pb-2.5">
                      Included with {plan} subscription
                    </h5>
                    <div className="space-y-3 text-xs text-text-secondary font-medium">
                      {getFeatures().map((feature, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-40 pb-24 text-center min-h-[100svh] flex items-center justify-center">
          <div className="space-y-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
            <p className="text-text-muted font-mono uppercase tracking-widest text-xs">Loading secure checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
