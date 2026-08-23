'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Terminal,
  ShieldAlert,
  Cpu,
  Layers,
  ExternalLink,
  Code2,
  Check,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tradingViewUsername: '',
    category: 'Bug Report',
    indicator: 'Ichimoku Kinkō Hyō',
    symbolTimeframe: '',
    environment: 'TradingView Web (Browser)',
    subject: '',
    message: '',
    screenshotUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string; ticketId?: string } | null>(null);

  const issueCategories = [
    { label: 'Pine Script Indicator Display / Calculation Bug', value: 'Indicator' },
    { label: 'Invite-Only Access Not Visible on TradingView', value: 'Technical' },
    { label: 'Kumo Scanner / Web Screener Discrepancy', value: 'Technical' },
    { label: 'Crypto Payment / TXID Verification Glitch', value: 'Payment' },
    { label: 'Account / Authentication Session Error', value: 'General' },
    { label: 'Other Technical Anomaly', value: 'Bug Report' },
  ];

  const indicatorOptions = [
    'Ichimoku Kinkō Hyō - (一目均衡表)',
    'Equilibrium Flat Levels & Confluence',
    'Forward Projection Rays & Status Table',
    'TradingView Script Access / Whitelisting',
    'Website Tools & Platform',
    'Other Technical Module',
  ];

  const environmentOptions = [
    'TradingView Web (Chrome / Brave / Firefox / Safari)',
    'TradingView Desktop App (Windows / macOS)',
    'TradingView Mobile App (iOS / Android)',
    'Website Browser Dashboard',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          tradingViewUsername: formData.tradingViewUsername,
          category: formData.category,
          indicator: formData.indicator,
          symbolTimeframe: formData.symbolTimeframe,
          environment: formData.environment,
          subject: `[BUG REPORT] ${formData.subject}`,
          message: formData.message,
          screenshotUrl: formData.screenshotUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit bug report.');
      }

      setStatus({
        type: 'success',
        message: 'Technical issue report submitted successfully! Our Pine Script engineering team has been notified.',
        ticketId: data.ticketId,
      });

      setFormData({
        name: '',
        email: '',
        tradingViewUsername: '',
        category: 'Bug Report',
        indicator: 'Ichimoku Kinkō Hyō',
        symbolTimeframe: '',
        environment: 'TradingView Web (Browser)',
        subject: '',
        message: '',
        screenshotUrl: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'An error occurred submitting the report. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-24 min-h-[100svh] relative overflow-hidden bg-bg-primary">
      {/* Amber/Red Technical Diagnostic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[180px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono uppercase text-amber-400 font-bold tracking-widest mb-4">
              <Bug className="w-4 h-4 text-amber-400" />
              <span>不具合報告 • TECHNICAL DIAGNOSTICS</span>
            </div>
            <h1 className="syne font-extrabold text-4xl sm:text-5xl lg:text-6xl text-text-primary uppercase tracking-tight mb-4">
              Report an <span className="text-amber-400">Issue</span>
            </h1>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Found a calculation discrepancy, indicator display glitch, or platform anomaly? Submit diagnostic logs so our Pine Script engineering team can inspect and patch it.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Self-Troubleshooting Checklist & System Status (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Diagnostic Checklist */}
            <ScrollReveal delay={0.1}>
              <Card className="p-6 bg-bg-secondary border border-border space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="syne font-bold text-base text-text-primary flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span>Quick Pre-Flight Checks</span>
                  </h3>
                  <span className="text-[10px] font-mono text-text-muted uppercase">Troubleshooting</span>
                </div>

                <div className="space-y-3.5 text-xs text-text-secondary">
                  <div className="p-3 rounded-xl bg-bg-primary border border-border space-y-1">
                    <div className="font-bold text-text-primary flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-accent/10 text-accent font-mono text-[10px] flex items-center justify-center font-bold">1</span>
                      <span>Invite-Only Folder Check</span>
                    </div>
                    <p className="text-[11px] text-text-muted pl-5.5">
                      Open TradingView &gt; <em>Indicators</em> &gt; <em>Invite-only scripts</em>. Ensure your TradingView account matches your submitted username.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-primary border border-border space-y-1">
                    <div className="font-bold text-text-primary flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-accent/10 text-accent font-mono text-[10px] flex items-center justify-center font-bold">2</span>
                      <span>Closed vs Live Candle Logic</span>
                    </div>
                    <p className="text-[11px] text-text-muted pl-5.5">
                      Live forming candles update in real time. Signals and cloud crossovers lock once the candle closes.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-bg-primary border border-border space-y-1">
                    <div className="font-bold text-text-primary flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-accent/10 text-accent font-mono text-[10px] flex items-center justify-center font-bold">3</span>
                      <span>Script Reload</span>
                    </div>
                    <p className="text-[11px] text-text-muted pl-5.5">
                      Remove the indicator from your chart and re-add it from <em>Invite-only scripts</em> to ensure TradingView loads the newest Pine Script version.
                    </p>
                  </div>
                </div>
              </Card>
            </ScrollReveal>

            {/* Core Status Card */}
            <ScrollReveal delay={0.2}>
              <Card className="p-6 bg-bg-secondary border border-border space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between text-text-primary font-bold">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Engine Telemetry Status</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    NOMINAL
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-text-muted">
                  <div className="flex items-center justify-between">
                    <span>Pine Script Engine:</span>
                    <span className="text-text-primary font-bold">v5 / v6 Compiled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>MTF Multi-Cloud Sync:</span>
                    <span className="text-emerald-400 font-bold">Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kumo Cloud Scanner API:</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                </div>
              </Card>
            </ScrollReveal>

            {/* General Contact Shortcut */}
            <ScrollReveal delay={0.3}>
              <div className="p-4 rounded-2xl bg-bg-secondary border border-border flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-text-primary">Not a bug or technical issue?</div>
                  <div className="text-[11px] text-text-muted">Billing, account or general questions.</div>
                </div>
                <Link
                  href="/contact"
                  className="px-3 py-1.5 rounded-lg bg-bg-primary border border-border hover:border-accent text-accent font-mono text-xs font-bold transition-colors"
                >
                  Contact Support →
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Detailed Bug Report Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={0.2}>
              <Card className="p-6 sm:p-10 bg-bg-secondary border border-border relative">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                  <div>
                    <h2 className="syne font-bold text-2xl text-text-primary uppercase tracking-tight flex items-center gap-2">
                      <span>Submit Diagnostics</span>
                    </h2>
                    <p className="text-text-secondary text-xs mt-0.5">
                      Provide detailed context to help our engineers reproduce and patch the anomaly.
                    </p>
                  </div>
                  <Bug className="w-5 h-5 text-amber-400" />
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
                          Diagnostic ID: #{status.ticketId.slice(-8).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Reporter Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Your Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors placeholder:text-text-muted/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@example.com"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors placeholder:text-text-muted/60"
                      />
                    </div>
                  </div>

                  {/* TradingView Username (Crucial) & Issue Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        TradingView Username <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tradingViewUsername}
                        onChange={(e) => setFormData({ ...formData, tradingViewUsername: e.target.value })}
                        placeholder="e.g. IchimokuTrader99"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors placeholder:text-text-muted/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Issue Type <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                      >
                        {issueCategories.map((c) => (
                          <option key={c.label} value={c.value} className="bg-bg-primary text-text-primary">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Affected Indicator & Symbol / Timeframe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Target Tool / Script <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={formData.indicator}
                        onChange={(e) => setFormData({ ...formData, indicator: e.target.value })}
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                      >
                        {indicatorOptions.map((ind) => (
                          <option key={ind} value={ind} className="bg-bg-primary text-text-primary">
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                        Asset Symbol & Timeframe (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.symbolTimeframe}
                        onChange={(e) => setFormData({ ...formData, symbolTimeframe: e.target.value })}
                        placeholder="e.g. BTCUSDT 4H Binance, NQ1! 15m"
                        className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors placeholder:text-text-muted/60"
                      />
                    </div>
                  </div>

                  {/* Environment */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                      Client Environment
                    </label>
                    <select
                      value={formData.environment}
                      onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                    >
                      {environmentOptions.map((env) => (
                        <option key={env} value={env} className="bg-bg-primary text-text-primary">
                          {env}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Issue Summary / Headline */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                      Issue Summary <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief one-line summary of the bug"
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors placeholder:text-text-muted/60"
                    />
                  </div>

                  {/* Description & Steps to Reproduce */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                      Detailed Description & Steps to Reproduce <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={"1. What happened?\n2. What was expected?\n3. Steps to reproduce the discrepancy..."}
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors resize-none placeholder:text-text-muted/60 font-mono text-[11px]"
                    />
                  </div>

                  {/* Screenshot Link */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                      TradingView Snapshot URL or Image Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.screenshotUrl}
                      onChange={(e) => setFormData({ ...formData, screenshotUrl: e.target.value })}
                      placeholder="https://www.tradingview.com/x/... or image link"
                      className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-amber-400 transition-colors placeholder:text-text-muted/60"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full py-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Diagnostics...</span>
                      </>
                    ) : (
                      <>
                        <Bug className="w-4 h-4" />
                        <span>Submit Bug Report to Engineering</span>
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
