'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Users,
  Compass
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tradingViewUsername: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string; ticketId?: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const categories = [
    { label: 'General Inquiry', value: 'General' },
    { label: 'TradingView Whitelist & Indicator Access', value: 'Indicator' },
    { label: 'Billing & Crypto Payment Support', value: 'Payment' },
    { label: 'Institutional / Daimyo Tier Inquiry', value: 'Institutional' },
    { label: 'Partnership / Affiliate Program', value: 'Partnership' },
    { label: 'Feature Request & Custom Logic', value: 'Feature Request' },
  ];

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.');
      }

      setStatus({
        type: 'success',
        message: 'Your inquiry has been received! Our support team will review and reply to your email address shortly.',
        ticketId: data.ticketId,
      });

      setFormData({
        name: '',
        email: '',
        tradingViewUsername: '',
        category: 'General Inquiry',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please try again or email us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-24 min-h-[100svh] relative overflow-hidden bg-bg-primary">
      {/* Background Radial Gold Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[180px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-secondary border border-border text-xs font-mono uppercase text-accent font-bold tracking-widest mb-4">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span>お問合せ • OFFICIAL COMMUNICATIONS</span>
            </div>
            <h1 className="syne font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary uppercase tracking-tight mb-4">
              Contact <span className="text-accent">Ichimoku Edge</span>
            </h1>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Have questions about your TradingView indicator entitlement, crypto settlements, institutional access, or custom indicator strategies? We are here to assist you.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid: Left Channels + Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Channels & Information (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Email Card */}
            <ScrollReveal delay={0.1}>
              <Card className="p-6 bg-bg-secondary border border-border relative overflow-hidden group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>24/7 SLA</span>
                  </span>
                </div>

                <h3 className="syne font-bold text-lg text-text-primary mb-1">
                  General & Partner Inquiries
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed mb-4">
                  Direct line for account questions, custom indicator logic, partnerships, and licensing.
                </p>

                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-primary border border-border">
                  <span className="font-mono text-xs text-text-primary select-all">
                    contact@ichimokuedge.com
                  </span>
                  <button
                    onClick={() => handleCopyEmail('contact@ichimokuedge.com')}
                    className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-bg-secondary transition-colors"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </Card>
            </ScrollReveal>

            {/* Quick Resolution Channels Card */}
            <ScrollReveal delay={0.2}>
              <Card className="p-6 bg-bg-secondary border border-border space-y-4">
                <h3 className="syne font-bold text-base text-text-primary flex items-center gap-2">
                  <Compass className="w-4 h-4 text-accent" />
                  <span>Looking for Something Specific?</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <Link
                    href="/faq"
                    className="p-3 rounded-xl bg-bg-primary border border-border hover:border-accent/40 transition-colors flex items-center justify-between group block"
                  >
                    <div>
                      <div className="font-bold text-text-primary group-hover:text-accent transition-colors">
                        Frequently Asked Questions
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Instant answers on TradingView invite-only scripts & billing.
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent shrink-0 ml-2 transition-colors" />
                  </Link>

                  <Link
                    href="/report-issue"
                    className="p-3 rounded-xl bg-bg-primary border border-border hover:border-amber-500/40 transition-colors flex items-center justify-between group block"
                  >
                    <div>
                      <div className="font-bold text-amber-400">
                        Technical Bug or Indicator Issue?
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Submit diagnostic logs to our Pine Script engineering team.
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  </Link>

                  <Link
                    href="/pricing"
                    className="p-3 rounded-xl bg-bg-primary border border-border hover:border-accent/40 transition-colors flex items-center justify-between group block"
                  >
                    <div>
                      <div className="font-bold text-text-primary group-hover:text-accent transition-colors">
                        7-Day Free Trial & Pricing
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Explore Samurai indicator package & crypto payment methods.
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent shrink-0 ml-2 transition-colors" />
                  </Link>
                </div>
              </Card>
            </ScrollReveal>

            {/* SLA Badge */}
            <ScrollReveal delay={0.3}>
              <div className="p-4 rounded-2xl bg-bg-secondary/60 border border-border/80 text-xs font-mono space-y-2">
                <div className="flex items-center gap-2 text-text-primary font-bold">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Support Service Level Guarantee</span>
                </div>
                <p className="text-text-muted leading-relaxed text-[11px]">
                  All inquiries submitted through this form are logged in our priority ticketing system. Typical turnaround time is under 4 hours during active market trading sessions.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Interactive Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2}>
              <Card className="p-6 sm:p-10 bg-bg-secondary border border-border relative">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                  <div>
                    <h2 className="syne font-bold text-2xl text-text-primary uppercase tracking-tight">
                      Send a Message
                    </h2>
                    <p className="text-text-secondary text-xs mt-0.5">
                      Fill in the details below and we will respond via email.
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>

                {status && (
                  <div
                    className={`p-4 rounded-xl mb-6 text-xs flex items-start gap-3 ${
                      status.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold">{status.message}</div>
                      {status.ticketId && (
                        <div className="font-mono text-[11px] opacity-80">
                          Tracking Reference: #{status.ticketId.slice(-8).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Your Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Kenzo Takahashi"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. trader@domain.com"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/60"
                      />
                    </div>
                  </div>

                  {/* TradingView Handle & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        TradingView Username (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.tradingViewUsername}
                        onChange={(e) => setFormData({ ...formData, tradingViewUsername: e.target.value })}
                        placeholder="e.g. EdgeTrader99"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Inquiry Category <span className="text-accent">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value} className="bg-bg-primary text-text-primary">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                      Subject <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief topic of your inquiry"
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors placeholder:text-text-muted/60"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                      Message Details <span className="text-accent">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please explain how we can help you with as much detail as possible..."
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-text-muted/60"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full py-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider font-bold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatch Message to Support</span>
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
