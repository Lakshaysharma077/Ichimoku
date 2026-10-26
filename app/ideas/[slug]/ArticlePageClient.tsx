'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, ExternalLink, Calendar, Layers } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface ArticleData {
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
}: {
  article: ArticleData;
  slug: string;
}) {
  const hasContent = article.content && article.content.trim().length > 0;
  const hasUrl = article.url && article.url.trim().length > 0;

  return (
    <div className="pt-28 sm:pt-36 pb-20 relative overflow-hidden min-h-[100svh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* ── Back Navigation ── */}
        <ScrollReveal>
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-xs font-mono uppercase tracking-widest transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>All Articles</span>
          </Link>
        </ScrollReveal>

        {/* ── Article Header ── */}
        <ScrollReveal delay={0.05}>
          <header className="mb-8">
            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-4">
              {article.ticker && (
                <span className="px-2 py-0.5 rounded-md bg-bg-secondary border border-border font-mono font-bold text-text-secondary text-[11px]">
                  {article.ticker}
                  {article.timeframe ? ` • ${article.timeframe}` : ''}
                </span>
              )}
              {(article.company || article.ticker) && (
                <span className="text-text-muted">
                  {formatAssetName(article.company, article.ticker)}
                </span>
              )}
              {article.editorPick && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2962FF]/10 border border-[#2962FF]/20 text-[#2962FF] text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-3 h-3 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                    <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
                  </svg>
                  Editor&apos;s Pick
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="syne font-extrabold text-2xl sm:text-3xl lg:text-[40px] text-text-primary leading-tight tracking-tight mb-4"
              style={{ wordSpacing: '0.1em' }}
            >
              {article.title}
            </h1>

            {/* Date & Reading Time */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              {article.date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(article.date)}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{getReadingTimeMinutes(article.wordCount)} min read</span>
              </span>
            </div>
          </header>
        </ScrollReveal>

        {/* ── Primary TradingView CTA (Top) ── */}
        {hasUrl && (
          <ScrollReveal delay={0.1}>
            <a
              href={article.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-bg-secondary border border-border rounded-2xl px-5 py-3.5 mb-8 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2962FF]/10 border border-[#2962FF]/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-[#2962FF]" viewBox="0 0 24 24">
                    <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors block">
                    Read on TradingView
                  </span>
                  <span className="text-[11px] text-text-muted">
                    View the original analysis with interactive charts
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5" />
            </a>
          </ScrollReveal>
        )}

        {/* ── Featured Chart Image ── */}
        {article.image && (
          <ScrollReveal delay={0.15}>
            <div className="relative rounded-2xl overflow-hidden border border-border mb-10 bg-bg-secondary">
              <img
                src={article.image}
                alt={`${article.ticker || ''} — ${article.title}`}
                className="w-full h-auto object-cover"
                loading="eager"
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-bg-primary/60 to-transparent pointer-events-none" />
            </div>
          </ScrollReveal>
        )}

        {/* ── Article Body Content ── */}
        <ScrollReveal delay={0.2}>
          <div className="article-content">
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
                {hasUrl && (
                  <a
                    href={article.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-bg-secondary border border-border text-text-primary text-xs font-bold hover:border-accent/50 transition-all"
                  >
                    <span>Read on TradingView</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* ── Bottom TradingView CTA ── */}
        {hasUrl && (
          <ScrollReveal delay={0.25}>
            <div className="mt-12 pt-8 border-t border-border">
              <a
                href={article.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-bg-secondary border border-border rounded-2xl px-5 py-3.5 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2962FF]/10 border border-[#2962FF]/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-[#2962FF]" viewBox="0 0 24 24">
                      <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors block">
                      Read on TradingView
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Interact with the original chart, leave comments, and follow for more
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-all group-hover:translate-x-0.5" />
              </a>
            </div>
          </ScrollReveal>
        )}

        {/* ── Back to Articles ── */}
        <ScrollReveal delay={0.3}>
          <div className="mt-8 text-center">
            <Link
              href="/ideas"
              className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-xs font-mono uppercase tracking-widest transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to All Articles</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
