"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, HelpCircle, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tradingViewUsername: "",
    category: "General",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const categories = [
    "General",
    "Payment",
    "Subscription",
    "Technical",
    "Indicator",
    "Bug Report",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit support request.");
      }

      setStatus({
        type: "success",
        message: data.message || "Your support request has been submitted successfully! Check your email for updates.",
      });

      setFormData({
        name: "",
        email: "",
        tradingViewUsername: "",
        category: "General",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-36 pb-24 min-h-[100svh] relative overflow-hidden">
      {/* Background Radial Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-accent font-bold tracking-widest mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Dedicated Contact & Support</span>
          </div>
          <h1 className="syne font-extrabold text-4xl lg:text-5xl text-text-primary uppercase tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Have questions about your TradingView indicator access, crypto payments, or technical setup? Submit a support ticket or reach us directly.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 bg-bg-secondary/40 border-border/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent/10 text-accent shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="syne font-bold text-lg text-text-primary mb-1">Direct Email</h3>
              <p className="text-text-secondary text-xs mb-3">Get in touch directly with our support engineering team.</p>
              <a
                href="mailto:support@ichimokuedge.com"
                className="font-mono text-xs text-accent font-bold hover:underline"
              >
                support@ichimokuedge.com
              </a>
            </div>
          </Card>

          <Card className="p-6 bg-bg-secondary/40 border-border/80 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="syne font-bold text-lg text-text-primary mb-1">Knowledge & FAQ</h3>
              <p className="text-text-secondary text-xs mb-3">Find instant answers to common questions regarding Invite-Only Pine Script access.</p>
              <Link
                href="/faq"
                className="font-mono text-xs text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Browse FAQ Knowledgebase →</span>
              </Link>
            </div>
          </Card>
        </div>

        {/* Contact Form Card */}
        <Card className="p-6 md:p-10 bg-bg-secondary/40 border-border/80">
          <h2 className="syne font-bold text-2xl text-text-primary mb-6">Submit Support Request</h2>

          {status && (
            <div
              className={`p-4 rounded-xl mb-6 text-xs flex items-center gap-3 ${
                status.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                  TradingView Username (Optional)
                </label>
                <input
                  type="text"
                  value={formData.tradingViewUsername}
                  onChange={(e) => setFormData({ ...formData, tradingViewUsername: e.target.value })}
                  placeholder="e.g. IchimokuTrader99"
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your question or issue"
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-text-muted mb-2 font-semibold">
                Message Details *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your request in detail..."
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Support Request</span>
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
