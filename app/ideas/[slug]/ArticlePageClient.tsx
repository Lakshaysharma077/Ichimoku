'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Calendar,
  Layers,
  Share2,
  Copy,
  Check,
  Maximize2,
  X,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import TradingViewIcon from '@/components/ui/TradingViewIcon';

export interface ArticleData {
  id?: string;
  slug?: string;
  ticker?: string;
  timeframe?: string;
  company?: string;
  title: string;
  date?: string;
  image?: string;
  url?: string;
  editorPick?: boolean;
  wordCount?: number;
  content?: string;
  status?: string;
  bias?: 'Bullish' | 'Bearish' | 'Neutral' | 'Breakout Watch';
  primaryResistance?: string;
  primarySupport?: string;
  equilibriumAnchor?: string;
}

interface AdjacentArticle {
  slug: string;
  title: string;
  ticker?: string;
  timeframe?: string;
  company?: string;
  image?: string;
  date?: string;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getReadingTimeMinutes(wordCount?: number): number {
  const words = typeof wordCount === 'number' && wordCount > 0 ? wordCount : 1000;
  return Math.max(1, Math.ceil(words / 200));
}

function formatAssetName(company?: string, ticker?: string): string {
  const raw = company || ticker || '';
  return raw
    .replace(/\bTetherUS\b/gi, 'USDT')
    .replace(/\bTether US\b/gi, 'USDT')
    .replace(/\bTether\b/gi, 'USDT')
    .trim();
}

export default function ArticlePageClient({
  article,
  slug,
  prevArticle,
  nextArticle,
  relatedArticles = [],
}: {
  article: ArticleData;
  slug: string;
  prevArticle?: AdjacentArticle | null;
  nextArticle?: AdjacentArticle | null;
  relatedArticles?: AdjacentArticle[];
}) {
  const [copied, setCopied] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Pure hardware-accelerated scroll progress (zero spring physics lag)
  const { scrollYProgress } = useScroll();

  const hasContent = article.content && article.content.trim().length > 0;
  const hasUrl = article.url && article.url.trim().length > 0;

  // Handle Copy Link
  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  // Keyboard shortcut to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setZoomLevel(1);
      }
    };
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  // Determine bias badge styling
  const bias = article.bias || 'Bullish';
  const biasBadgeClass =
    bias === 'Bullish'
      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
      : bias === 'Bearish'
      ? 'border-rose-500/30 text-rose-400 bg-rose-500/10'
      : bias === 'Breakout Watch'
      ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
      : 'border-accent/30 text-accent bg-accent/10';

  return (
    <>
      {/* ── Fixed Reading Progress Bar (Hardware Accelerated) ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent to-accent/60 z-50 origin-left pointer-events-none"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      <div className="pt-28 sm:pt-36 pb-24 relative overflow-hidden min-h-[100svh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* ── Breadcrumb & Top Bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <Link
                href="/ideas"
                className="hover:text-text-primary transition-colors flex items-center gap-1.5 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>All Ideas</span>
              </Link>
              <span>/</span>
              <span className="text-text-secondary uppercase">{article.ticker || 'Market Analysis'}</span>
            </nav>

            {/* Share & Copy Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border text-xs text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all active:scale-95 shadow-sm"
                title="Copy link to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-mono text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">Copy Link</span>
                  </>
                )}
              </button>

              {hasUrl && (
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${article.title} — Ichimoku Technical Analysis on ${article.ticker || 'Crypto'}`
                  )}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-secondary border border-border text-xs text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all shadow-sm"
                  title="Share on X (Twitter)"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">Share</span>
                </a>
              )}
            </div>
          </div>

          {/* ── Article Header ── */}
          <header className="mb-8">
            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-4">
              {article.ticker && (
                <span className="px-2.5 py-1 rounded-md bg-bg-secondary border border-border font-mono font-bold text-text-primary text-[12px] shadow-sm">
                  {article.ticker}
                  {article.timeframe ? ` • ${article.timeframe}` : ''}
                </span>
              )}
              {(article.company || article.ticker) && (
                <span className="text-text-secondary font-medium">
                  {formatAssetName(article.company, article.ticker)}
                </span>
              )}
              {article.editorPick && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2962FF]/10 border border-[#2962FF]/25 text-[#2962FF] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  <svg className="w-3 h-3 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                    <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
                  </svg>
                  TradingView Editor&apos;s Pick
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-mono font-bold uppercase tracking-wider ${biasBadgeClass}`}
              >
                <TrendingUp className="w-3 h-3" />
                {bias}
              </span>
            </div>

            {/* Title */}
            <h1
              className="syne font-extrabold text-2xl sm:text-3xl lg:text-4xl text-text-primary leading-tight tracking-tight mb-5"
              style={{ wordSpacing: '0.08em' }}
            >
              {article.title}
            </h1>

            {/* Publication Date, Reading Time, Word Count */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-muted border-b border-border/60 pb-6">
              {article.date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>{formatDate(article.date)}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>{getReadingTimeMinutes(article.wordCount)} min read</span>
              </span>
              {article.wordCount && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-text-muted" />
                  <span>{article.wordCount.toLocaleString()} words</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-text-muted text-xs font-mono ml-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Samurai Vision Framework</span>
              </span>
            </div>
          </header>

          {/* ── Quick Setup Blueprint (Market Snapshot Card) ── */}
          <div className="bg-bg-secondary/70 border border-border/80 rounded-2xl p-4 sm:p-5 mb-8 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-border/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                  Market Blueprint &amp; Key Parameters
                </span>
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                TF: {article.timeframe || '1D'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-bg-primary/60 border border-border/40 rounded-xl p-2.5">
                <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">Market Bias</span>
                <span className="font-bold text-text-primary text-xs">{bias}</span>
              </div>
              <div className="bg-bg-primary/60 border border-border/40 rounded-xl p-2.5">
                <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">Key Resistance</span>
                <span className="font-bold text-text-primary text-xs truncate block" title={article.primaryResistance || 'See analysis'}>
                  {article.primaryResistance || 'Key Pivot High'}
                </span>
              </div>
              <div className="bg-bg-primary/60 border border-border/40 rounded-xl p-2.5">
                <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">Key Support</span>
                <span className="font-bold text-text-primary text-xs truncate block" title={article.primarySupport || 'See analysis'}>
                  {article.primarySupport || 'Kumo / Tenkan'}
                </span>
              </div>
              <div className="bg-bg-primary/60 border border-border/40 rounded-xl p-2.5">
                <span className="text-[10px] font-mono uppercase text-text-muted block mb-1">Equilibrium Pivot</span>
                <span className="font-bold text-text-primary text-xs truncate block" title={article.equilibriumAnchor || 'Kijun Baseline'}>
                  {article.equilibriumAnchor || 'Kijun-sen'}
                </span>
              </div>
            </div>
          </div>

          {/* ── Featured Chart Image with Lightbox Zoom ── */}
          {article.image && (
            <div className="relative group rounded-2xl overflow-hidden border border-border mb-10 bg-bg-secondary shadow-lg">
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="cursor-zoom-in relative block"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
                aria-label="Enlarge chart analysis image"
              >
                <img
                  src={article.image}
                  alt={`${article.ticker || ''} — ${article.title}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="eager"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-primary/80 to-transparent pointer-events-none" />

                {/* Enlarge Hint Pill */}
                <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-bg-primary/85 backdrop-blur-md border border-border/80 text-text-secondary text-xs font-mono font-medium flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:border-accent/50 group-hover:text-text-primary transition-all shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5 text-accent" />
                  <span>Click to inspect chart</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Article Body Content (Natural Solid Flow) ── */}
          <article className="article-content">
            {hasContent ? (
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content! }}
              />
            ) : (
              <div className="py-12 text-center border border-dashed border-border rounded-2xl bg-bg-secondary/30">
                <Layers className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-text-secondary text-sm font-medium mb-1">
                  Full article content coming soon
                </p>
                <p className="text-text-muted text-xs max-w-md mx-auto">
                  This analysis is available on TradingView. The full article will be published on Ichimoku Edge shortly.
                </p>
              </div>
            )}
          </article>

          {/* ── TradingView Interactive Card ── */}
          {hasUrl && (
            <div className="mt-14 pt-8 border-t border-border/70">
              <a
                href={article.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full bg-gradient-to-r from-bg-secondary via-bg-secondary to-bg-tertiary border border-border rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-[#2962FF]/60 hover:shadow-[0_12px_32px_-8px_rgba(41,98,255,0.2)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2962FF]/10 border border-[#2962FF]/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TradingViewIcon className="w-6 h-6 text-[#2962FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-text-primary group-hover:text-[#2962FF] transition-colors">
                        View Interactive Chart on TradingView
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-[#2962FF] transition-colors" />
                    </div>
                    <span className="text-xs text-text-muted block mt-0.5">
                      Interact with the original candle bars, test indicators, leave a comment, and follow @IchimokuEdge
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center px-4 py-2 rounded-xl bg-bg-primary border border-border text-xs font-bold text-text-primary group-hover:border-[#2962FF]/50 transition-all">
                  <span>Open in TradingView</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#2962FF]" />
                </div>
              </a>
            </div>
          )}

          {/* ── Author / Framework Signature Card ── */}
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-bg-secondary/40 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
                  Ichimoku Edge Analysis Desk
                </span>
              </div>
              <p className="text-xs text-text-muted max-w-lg leading-relaxed">
                Published under the Samurai Vision framework: systematic equilibrium mapping, zero emotional guesswork, and strict risk invalidation rules.
              </p>
            </div>

            <Link
              href="/ichimoku"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-secondary border border-border text-xs font-mono text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all shrink-0 self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Explore Methodology</span>
            </Link>
          </div>

          {/* ── Previous & Next Article Navigation ── */}
          {(prevArticle || nextArticle) && (
            <div className="mt-12 pt-8 border-t border-border/70">
              <div className="text-[11px] font-mono text-text-muted uppercase tracking-widest mb-4">
                Continue Reading Analysis
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link
                    href={`/ideas/${prevArticle.slug}`}
                    className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-bg-secondary border border-border hover:border-accent/40 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-2">
                      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                      <span>Previous Idea</span>
                      {prevArticle.ticker && (
                        <span className="px-1.5 py-0.5 rounded bg-bg-primary text-text-secondary text-[10px]">
                          {prevArticle.ticker}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
                      {prevArticle.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextArticle ? (
                  <Link
                    href={`/ideas/${nextArticle.slug}`}
                    className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-bg-secondary border border-border hover:border-accent/40 transition-all duration-200 sm:text-right"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-mono text-text-muted mb-2 sm:justify-end">
                      {nextArticle.ticker && (
                        <span className="px-1.5 py-0.5 rounded bg-bg-primary text-text-secondary text-[10px]">
                          {nextArticle.ticker}
                        </span>
                      )}
                      <span>Next Idea</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
                      {nextArticle.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          )}

          {/* ── Related Ideas Cards ── */}
          {relatedArticles.length > 0 && (
            <div className="mt-14 pt-8 border-t border-border/70">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="syne font-bold text-lg text-text-primary">Related Market Ideas</h3>
                  <p className="text-xs text-text-muted">More technical setups from the Ichimoku Edge research desk</p>
                </div>
                <Link
                  href="/ideas"
                  className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 group"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/ideas/${rel.slug}`}
                    className="group block rounded-2xl overflow-hidden bg-bg-secondary border border-border hover:border-accent/40 transition-all duration-200 hover:shadow-md"
                  >
                    {rel.image && (
                      <div className="aspect-[16/9] w-full overflow-hidden bg-bg-primary">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                        {rel.ticker && (
                          <span className="font-bold text-text-secondary">{rel.ticker}</span>
                        )}
                        {rel.timeframe && <span>• {rel.timeframe}</span>}
                      </div>
                      <h4 className="text-xs font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Samurai Vision Indicator Suite CTA ── */}
          <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-bg-secondary via-bg-secondary to-bg-primary border border-border relative overflow-hidden text-center shadow-xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-accent/60 rounded-full" />
            <div className="max-w-xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Trade with Samurai Vision
              </span>
              <h3 className="syne font-extrabold text-xl sm:text-2xl text-text-primary">
                Ready to Apply These Setups in Real Time?
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Unlock the full Ichimoku Edge indicator suite on TradingView: automated equilibrium alerts, multi-timeframe cloud projections, and real-time flat level recognition.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/pricing"
                  className="px-5 py-2.5 rounded-xl bg-accent text-bg-primary font-bold text-xs hover:opacity-90 transition-opacity shadow-md"
                >
                  Start 7-Day Free Trial
                </Link>
                <Link
                  href="/tools"
                  className="px-5 py-2.5 rounded-xl bg-bg-primary border border-border text-text-primary font-bold text-xs hover:border-accent/40 transition-colors"
                >
                  Explore Indicators
                </Link>
              </div>
            </div>
          </div>

          {/* ── Bottom Back Navigation ── */}
          <div className="mt-12 text-center">
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-xs font-mono uppercase tracking-widest transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to All Ideas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── High-Resolution Lightbox Modal ── */}
      {isLightboxOpen && article.image && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => {
            setIsLightboxOpen(false);
            setZoomLevel(1);
          }}
        >
          {/* Top Controls Bar */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-text-muted z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 font-mono">
              <span className="text-text-primary font-bold">{article.ticker}</span>
              <span>•</span>
              <span className="truncate max-w-[200px] sm:max-w-md">{article.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
                className="px-2.5 py-1.5 rounded-lg bg-bg-secondary border border-border hover:text-text-primary font-mono text-xs"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="px-2.5 py-1.5 rounded-lg bg-bg-secondary border border-border hover:text-text-primary font-mono text-[11px]"
                title="Reset Zoom"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
                className="px-2.5 py-1.5 rounded-lg bg-bg-secondary border border-border hover:text-text-primary font-mono text-xs"
                title="Zoom Out"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setZoomLevel(1);
                }}
                className="p-1.5 rounded-lg bg-bg-secondary border border-border hover:text-text-primary ml-2"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Image Container */}
          <div
            className="relative max-w-6xl max-h-[85vh] overflow-auto flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={article.image}
              alt={article.title}
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl transition-transform duration-200"
            />
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-4 text-center text-xs font-mono text-text-muted">
            Press <kbd className="px-1.5 py-0.5 rounded bg-bg-secondary border border-border text-[10px]">Esc</kbd> or click outside to close
          </div>
        </div>
      )}
    </>
  );
}
