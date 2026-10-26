'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Search, ArrowRight, Clock, BookOpen } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import Link from 'next/link';

const COOKIE_NAME = 'read_ideas';

/** Get set of read idea IDs from browser cookies */
function getReadIdeaIdsFromCookies(): Set<string> {
  if (typeof document === 'undefined') return new Set();
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const [name, val] = c.trim().split('=');
    if (name === COOKIE_NAME && val) {
      try {
        const parsed = JSON.parse(decodeURIComponent(val));
        if (Array.isArray(parsed)) return new Set(parsed);
      } catch {
        return new Set(val.split(',').map(s => s.trim()).filter(Boolean));
      }
    }
  }
  return new Set();
}

/** Save read idea ID to browser cookie */
function saveReadIdeaIdToCookies(ideaId: string) {
  if (typeof document === 'undefined' || !ideaId) return;
  const current = getReadIdeaIdsFromCookies();
  current.add(ideaId);
  const arr = Array.from(current);
  const cookieVal = encodeURIComponent(JSON.stringify(arr));
  document.cookie = `${COOKIE_NAME}=${cookieVal}; path=/; max-age=31536000; SameSite=Lax`;
}

/** Format ISO date string to readable format */
function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Calculate estimated reading time in minutes (~200 words/min) */
function getReadingTimeMinutes(wordCount?: number): number {
  const words = typeof wordCount === 'number' && wordCount > 0 ? wordCount : 1000;
  return Math.max(1, Math.ceil(words / 200));
}

/** Standardize asset / market name to use USDT uniformly */
function formatAssetName(company?: string, ticker?: string): string {
  const raw = company || ticker || '';
  return raw
    .replace(/\bTetherUS\b/gi, 'USDT')
    .replace(/\bTether US\b/gi, 'USDT')
    .replace(/\bTether\b/gi, 'USDT')
    .trim();
}

/** Generate slug from article data */
function getArticleSlug(article: any): string {
  if (article.slug) return article.slug;
  return (article.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const ideas = useContent('ideas');

  // Dynamically sort articles newest-first by date
  const allArticles = useMemo(() => {
    const raw = Array.isArray(ideas?.articles) ? [...ideas.articles] : [];
    return raw.sort((a: any, b: any) => {
      const dateA = new Date(a.date || 0).getTime() || 0;
      const dateB = new Date(b.date || 0).getTime() || 0;
      return dateB - dateA;
    });
  }, [ideas?.articles]);

  // Cookie-based read status state
  const [readIdeaIds, setReadIdeaIds] = useState<Set<string>>(new Set());

  // Load read ideas from browser cookie on mount
  useEffect(() => {
    setReadIdeaIds(getReadIdeaIdsFromCookies());
  }, []);

  const handleArticleClick = (articleId: string) => {
    if (!articleId) return;
    saveReadIdeaIdToCookies(articleId);
    setReadIdeaIds(prev => new Set(prev).add(articleId));
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allArticles;
    return allArticles.filter(
      (a: any) =>
        (a.ticker && a.ticker.toLowerCase().includes(q)) ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.company && a.company.toLowerCase().includes(q))
    );
  }, [allArticles, searchQuery]);

  const featured = searchQuery ? null : (filtered[0] as any) ?? null;
  const gridItems = searchQuery ? filtered : filtered.slice(1);

  return (
    <div className="pt-36 pb-20 relative overflow-hidden min-h-[100svh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <ScrollReveal>
            <h1
              className="syne font-extrabold text-3xl sm:text-4xl lg:text-[46px] text-text-primary mb-4 uppercase tracking-tight leading-[0.95]"
              style={{ wordSpacing: '0.15em' }}
            >
              {ideas.hero.heading}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
              {ideas.hero.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* ── Header: Label + Search ── */}
        <ScrollReveal delay={0.1}>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.14em]">
                {ideas.sectionLabel}
              </span>
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-text-muted bg-bg-secondary/40 border border-[#2962FF]/20 rounded-full px-2 py-0.5 shadow-sm">
                <svg className="w-3 h-3 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                  <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"/>
                </svg>
                <span>EDITORS&apos; PICK = Selected by TradingView editors</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-bg-secondary border border-border rounded-xl px-3 py-1.5 w-60 max-w-full transition-all focus-within:border-accent/50 focus-within:shadow-[0_0_0_3px_rgba(251,225,120,0.08)]">
              <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <input
                type="text"
                placeholder={ideas.searchPlaceholder || "Search asset / ticker..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-text-primary text-xs placeholder:text-text-muted"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Card (Latest Idea) ── */}
        <AnimatePresence mode="wait">
          {featured && (
            <ScrollReveal delay={0.15}>
              <motion.div
                key={featured.id || "featured"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <div className="group relative grid grid-cols-1 md:grid-cols-[1.35fr_1fr] border border-border rounded-2xl overflow-hidden bg-bg-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-accent/40 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.35)]">
                  {/* Top subtle accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-accent via-accent/40 to-transparent" />

                  {/* 1. Chart / Image */}
                  <Link
                    href={`/ideas/${getArticleSlug(featured)}`}
                    onClick={() => handleArticleClick(featured.id)}
                    className="relative block overflow-hidden min-h-[220px] md:min-h-[260px] bg-bg-primary"
                  >
                    <div className="relative h-full">
                      <img
                        src={featured.image}
                        alt={`${featured.ticker || ''} — ${featured.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.025]"
                      />

                      {/* TV ribbon mark on upper-left (only for Editor's Pick) */}
                      {featured.editorPick && (
                        <div className="absolute top-0 left-2.5 z-10 w-5 h-6 bg-[#2962FF] flex items-center justify-center rounded-b-[2px] shadow-[0_2px_8px_rgba(41,98,255,0.4)]">
                          <span className="text-white text-[9px] font-black tracking-tighter">TV</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 md:p-7 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      {/* 1. LAST PUBLISHED Badge */}
                      <span className="inline-flex items-center gap-1.5 text-[0.64rem] font-bold tracking-[0.14em] uppercase text-accent">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(251,225,120,0.18)]" />
                        LAST PUBLISHED
                      </span>

                      {/* 2. Title — immediately below the image / badge */}
                      <Link
                        href={`/ideas/${getArticleSlug(featured)}`}
                        onClick={() => handleArticleClick(featured.id)}
                        className="block group/title"
                      >
                        <h2 className="syne font-bold text-xl sm:text-2xl text-text-primary group-hover/title:text-accent leading-snug transition-colors line-clamp-3">
                          {featured.title}
                        </h2>
                      </Link>

                      {/* 3. 2-Row Metadata Section (Row 1: Asset • Date, Row 2: Reading Time • Unread) */}
                      <div className="flex flex-col gap-1 text-xs text-text-muted">
                        {/* Row 1: Asset • Date */}
                        <div className="flex items-center gap-1.5 truncate">
                          {(featured.company || featured.ticker) && (
                            <span className="truncate">{formatAssetName(featured.company, featured.ticker)}</span>
                          )}
                          {(featured.company || featured.ticker) && featured.date && <span>•</span>}
                          {featured.date && <span className="shrink-0">{formatDate(featured.date)}</span>}
                        </div>

                        {/* Row 2: Reading Time • Unread */}
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-text-muted shrink-0" />
                            <span>{getReadingTimeMinutes(featured.wordCount)} min</span>
                          </span>
                          {!readIdeaIds.has(featured.id) && (
                            <>
                              <span>•</span>
                              <span className="text-[10.5px] tracking-wide text-text-muted">Unread</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CTAs: Read on TradingView (primary) + Read on Ichimoku Edge (secondary) */}
                    <div className="space-y-2 pt-1">
                      {/* Primary: Read on TradingView */}
                      {featured.url && (
                        <a
                          href={featured.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleArticleClick(featured.id)}
                          className="inline-flex items-center justify-between w-full bg-bg-primary border border-border rounded-2xl px-4 py-2.5 transition-all duration-200 hover:border-accent/50 hover:bg-bg-primary/90 group/cta shadow-sm"
                        >
                          <span className="text-xs sm:text-[0.82rem] font-bold text-text-primary group-hover/cta:text-accent transition-colors">
                            {ideas.ctaText || "Read on TradingView"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-text-primary group-hover/cta:text-accent transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                        </a>
                      )}

                      {/* Secondary: Read on Ichimoku Edge */}
                      <Link
                        href={`/ideas/${getArticleSlug(featured)}`}
                        onClick={() => handleArticleClick(featured.id)}
                        className="inline-flex items-center justify-between w-full bg-transparent border border-border/60 rounded-2xl px-4 py-2 transition-all duration-200 hover:border-accent/40 hover:bg-bg-primary/50 group/cta2"
                      >
                        <span className="text-[11px] sm:text-xs text-text-muted group-hover/cta2:text-text-primary transition-colors flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 shrink-0" />
                          {ideas.secondaryCtaText || "Read on Ichimoku Edge"}
                        </span>
                        <ArrowRight className="w-3 h-3 text-text-muted group-hover/cta2:text-text-primary transition-transform duration-200 group-hover/cta2:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          )}
        </AnimatePresence>

        {/* ── Grid Cards ── */}
        <AnimatePresence mode="wait">
          {gridItems.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
            >
              {gridItems.map((article: any, i: number) => {
                const isUnread = !readIdeaIds.has(article.id);
                const articleSlug = getArticleSlug(article);
                return (
                  <ScrollReveal key={article.id || i} delay={0.05 + i * 0.04} className="h-full">
                    <div className="group relative flex flex-col h-full border border-border rounded-2xl overflow-hidden bg-bg-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.35)]">
                      {/* Top accent hairline */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-accent/50 via-accent/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* 1. Chart / image */}
                      <Link
                        href={`/ideas/${articleSlug}`}
                        onClick={() => handleArticleClick(article.id)}
                        className="relative block aspect-[16/10] overflow-hidden bg-bg-primary shrink-0"
                      >
                        <img
                          src={article.image}
                          alt={`${article.ticker || ''} — ${article.title}`}
                          className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.025]"
                          loading="lazy"
                        />

                        {/* TV ribbon mark on upper-left (only for Editor's Pick) */}
                        {article.editorPick && (
                          <div className="absolute top-0 left-2 z-10 w-5 h-6 bg-[#2962FF] flex items-center justify-center rounded-b-[2px] shadow-[0_2px_8px_rgba(41,98,255,0.4)]">
                            <span className="text-white text-[9px] font-black tracking-tighter">TV</span>
                          </div>
                        )}
                      </Link>

                      {/* Content Body */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                        <div className="space-y-2.5">
                          {/* 2. Title — immediately below the image */}
                          <Link
                            href={`/ideas/${articleSlug}`}
                            onClick={() => handleArticleClick(article.id)}
                            className="block group/title"
                          >
                            <h3 className="syne font-bold text-[1.05rem] text-text-primary group-hover/title:text-accent leading-snug line-clamp-2 transition-colors">
                              {article.title}
                            </h3>
                          </Link>

                          {/* 3. 2-Row Metadata Section (Row 1: Asset • Date, Row 2: Reading Time • Unread) */}
                          <div className="flex flex-col gap-1 text-xs text-text-muted">
                            {/* Row 1: Asset • Date */}
                            <div className="flex items-center gap-1.5 truncate">
                              {(article.company || article.ticker) && (
                                <span className="truncate">{formatAssetName(article.company, article.ticker)}</span>
                              )}
                              {(article.company || article.ticker) && article.date && <span>•</span>}
                              {article.date && <span className="shrink-0">{formatDate(article.date)}</span>}
                            </div>

                            {/* Row 2: Reading Time • Unread */}
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-text-muted shrink-0" />
                                <span>{getReadingTimeMinutes(article.wordCount)} min</span>
                              </span>
                              {isUnread && (
                                <>
                                  <span>•</span>
                                  <span className="text-[10.5px] tracking-wide text-text-muted">Unread</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* CTAs: Read on TradingView (primary) + Read on Ichimoku Edge (secondary) */}
                        <div className="space-y-1.5 pt-1">
                          {/* Primary: Read on TradingView */}
                          {article.url && (
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleArticleClick(article.id)}
                              className="inline-flex items-center justify-between w-full bg-bg-primary border border-border rounded-2xl px-4 py-2.5 transition-all duration-200 hover:border-accent/50 hover:bg-bg-primary/90 group/cta shadow-sm"
                            >
                              <span className="text-xs sm:text-[0.82rem] font-bold text-text-primary group-hover/cta:text-accent transition-colors">
                                {ideas.ctaText || "Read on TradingView"}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-text-primary group-hover/cta:text-accent transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                            </a>
                          )}

                          {/* Secondary: Read on Ichimoku Edge */}
                          <Link
                            href={`/ideas/${articleSlug}`}
                            onClick={() => handleArticleClick(article.id)}
                            className="inline-flex items-center justify-center w-full text-[10.5px] text-text-muted hover:text-text-primary transition-colors py-1 gap-1.5 group/cta2"
                          >
                            <BookOpen className="w-3 h-3 shrink-0" />
                            <span>{ideas.secondaryCtaText || "Read on Ichimoku Edge"}</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <p className="text-text-muted text-base">{ideas.noResults}</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-accent text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
