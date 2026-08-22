'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Search, ArrowRight, Clock } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useThemeStore } from '@/store/themeStore';

/** Format ISO date string to readable format */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useThemeStore();
  const ideas = useContent('ideas');

  // Split: first = featured, rest = grid
  const allArticles = ideas.articles;
  const [readTimes, setReadTimes] = useState<Record<string, number>>({});

  // Helper to switch image based on theme (e.g. for light mode vs dark/edge)
  const getArticleImage = (article: any) => {
    if (theme === 'light' && article.imageLight) {
      return article.imageLight;
    }
    if ((theme === 'dark' || theme === 'signature') && article.imageDark) {
      return article.imageDark;
    }
    return article.image;
  };

  // Load times from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const times: Record<string, number> = {};
      allArticles.forEach((article: any) => {
        const stored = localStorage.getItem(`read_time_${article.id}`);
        if (stored) {
          times[article.id] = parseInt(stored, 10);
        }
      });
      setReadTimes(times);
    }
  }, [allArticles]);

  // Track window focus events to calculate reading time
  useEffect(() => {
    const handleFocus = () => {
      const clickedId = sessionStorage.getItem('clicked_article_id');
      const clickedTimeStr = sessionStorage.getItem('clicked_article_time');
      if (clickedId && clickedTimeStr) {
        const clickTime = parseInt(clickedTimeStr, 10);
        const elapsed = Date.now() - clickTime;
        if (elapsed > 1000) {
          // Cap elapsed time to 30 mins to avoid background tab artifacts
          const cappedElapsed = Math.min(elapsed, 30 * 60 * 1000);
          const prevTime = parseInt(localStorage.getItem(`read_time_${clickedId}`) || '0', 10);
          const newTime = prevTime + cappedElapsed;
          localStorage.setItem(`read_time_${clickedId}`, newTime.toString());
          setReadTimes(prev => ({
            ...prev,
            [clickedId]: newTime
          }));
        }
        sessionStorage.removeItem('clicked_article_id');
        sessionStorage.removeItem('clicked_article_time');
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleArticleClick = (articleId: string) => {
    sessionStorage.setItem('clicked_article_id', articleId);
    sessionStorage.setItem('clicked_article_time', Date.now().toString());
  };

  const formatReadingTime = (articleId: string) => {
    const timeMs = readTimes[articleId];
    if (!timeMs) return 'Not visited yet';

    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `Visited for ${minutes}m ${seconds}s`;
    }
    return `Visited for ${seconds}s`;
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allArticles;
    return allArticles.filter(
      (a: any) =>
        a.ticker.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
    );
  }, [allArticles, searchQuery]);

  const featured = searchQuery ? null : (filtered[0] as any) ?? null;
  const gridItems = searchQuery ? filtered : filtered.slice(1);

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        {/* ── Hero ── */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <h1
              className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-6 uppercase tracking-tight leading-[0.9]"
              style={{ wordSpacing: '0.2em' }}
            >
              {ideas.hero.heading}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {ideas.hero.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* ── Header: Label + Search ── */}
        <ScrollReveal delay={0.1}>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="text-[11px] font-mono font-bold text-text-muted uppercase tracking-[0.15em]">
                {ideas.sectionLabel}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted bg-bg-secondary/40 border border-[#2962FF]/20 rounded-full px-2.5 py-0.5 shadow-sm">
                <svg className="w-3.5 h-3.5 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                  <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"/>
                </svg>
                <span>EDITORS&apos; PICK = Selected by TradingView editors</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-bg-secondary border border-border rounded-xl px-4 py-2.5 w-64 max-w-full transition-all focus-within:border-accent/50 focus-within:shadow-[0_0_0_3px_rgba(251,225,120,0.08)]">
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <input
                type="text"
                placeholder={ideas.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-text-primary text-sm placeholder:text-text-muted"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Card (latest idea) ── */}
        <AnimatePresence mode="wait">
          {featured && (
            <ScrollReveal delay={0.15}>
              <motion.div
                key="featured"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <div className="group relative grid grid-cols-1 md:grid-cols-[1.55fr_1fr] border border-border rounded-2xl overflow-hidden bg-bg-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_22px_48px_-16px_rgba(0,0,0,0.35)]">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-accent via-accent/40 to-transparent" />

                  {/* Image */}
                  <a
                    href={featured.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleArticleClick(featured.id)}
                    className="relative block overflow-hidden min-h-[240px]"
                  >
                    <div className="relative h-full">
                      <img
                        src={getArticleImage(featured)}
                        alt={`${featured.ticker} — ${featured.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]"
                      />
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

                      {/* TV ribbon mark on upper-left (only for Editor's Pick) */}
                      {featured.editorPick && (
                        <div className="absolute top-0 left-3 z-10 w-6 h-7 bg-[#2962FF] flex items-center justify-center rounded-b-[2px] shadow-[0_2px_8px_rgba(41,98,255,0.4)]">
                          <span className="text-white text-[10px] font-black tracking-tighter">TV</span>
                        </div>
                      )}
                    </div>
                  </a>

                  {/* Body */}
                  <div className="p-8 flex flex-col justify-center gap-2">
                    <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(251,225,120,0.18)]" />
                      {ideas.featuredLabel}
                    </span>
                    <span className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-text-muted flex items-center gap-2">
                      <span>{formatDate(featured.date)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-text-muted">
                        <Clock className="w-3.5 h-3.5 text-accent/80 shrink-0" />
                        {readTimes[featured.id] ? (
                          <span className="text-[#2962FF] font-bold">
                            {formatReadingTime(featured.id)}
                          </span>
                        ) : (
                          <span className="text-text-muted/60">Not visited yet</span>
                        )}
                      </span>
                    </span>
                    {featured.company && (
                      <span className="text-[0.82rem] font-medium text-text-secondary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                        {featured.company}
                      </span>
                    )}
                    <h2 className="text-[1.55rem] font-bold text-text-primary leading-snug mt-1">
                      {featured.title}
                    </h2>

                    {/* Editors' Pick Badge (only if editorPick is true) */}
                    {featured.editorPick && (
                      <div className="flex items-center gap-1.5 text-[0.74rem] font-bold tracking-[0.06em] uppercase text-[#2962FF] mt-2 mb-1">
                        <svg className="w-3.5 h-3.5 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                          <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"/>
                        </svg>
                        <span>EDITORS&apos; PICK</span>
                      </div>
                    )}

                    {/* Action: Read on TradingView */}
                    <a
                      href={featured.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleArticleClick(featured.id)}
                      className="mt-4 inline-flex items-center gap-3 bg-bg-primary border border-border rounded-xl px-3 py-2 transition-all duration-200 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)] group/cta"
                    >
                      <span className="relative w-16 h-10 rounded-md overflow-hidden bg-bg-tertiary shrink-0">
                        <img src={getArticleImage(featured)} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </span>
                      <span className="text-[0.88rem] font-bold tracking-tight text-text-primary flex items-center gap-1.5">
                        {ideas.ctaText}
                        <ArrowRight className="w-3.5 h-3.5 text-accent transition-transform duration-200 group-hover/cta:translate-x-1" />
                      </span>
                    </a>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {gridItems.map((article: any, i: number) => (
                <ScrollReveal key={article.id} delay={0.1 + i * 0.06}>
                  <div className="group relative flex flex-col border border-border rounded-2xl overflow-hidden bg-bg-primary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]">
                    {/* Top accent hairline */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-accent/50 via-accent/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Scan sweep on hover */}
                    <div className="absolute top-0 left-0 w-[40%] h-[2px] z-20 bg-gradient-to-r from-transparent via-accent/80 to-transparent opacity-0 group-hover:animate-[scanSweep_0.9s_ease_forwards] pointer-events-none" />

                    {/* Image */}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleArticleClick(article.id)}
                      className="relative block aspect-video overflow-hidden bg-bg-tertiary"
                    >
                      <img
                        src={getArticleImage(article)}
                        alt={`${article.ticker} — ${article.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035] saturate-[0.96] brightness-[0.97] group-hover:saturate-100 group-hover:brightness-100"
                        loading="lazy"
                      />
                      {/* Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

                      {/* TV ribbon mark on upper-left (only for Editor's Pick) */}
                      {article.editorPick && (
                        <div className="absolute top-0 left-2.5 z-10 w-6 h-7 bg-[#2962FF] flex items-center justify-center rounded-b-[2px] shadow-[0_2px_8px_rgba(41,98,255,0.4)]">
                          <span className="text-white text-[10px] font-black tracking-tighter">TV</span>
                        </div>
                      )}
                    </a>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-text-muted mb-1 flex items-center gap-2">
                        <span>{formatDate(article.date)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 text-text-muted">
                          <Clock className="w-3.5 h-3.5 text-accent/80 shrink-0" />
                          {readTimes[article.id] ? (
                            <span className="text-[#2962FF] font-bold">
                              {formatReadingTime(article.id)}
                            </span>
                          ) : (
                            <span className="text-text-muted/60">Not visited yet</span>
                          )}
                        </span>
                      </span>
                      {article.company && (
                        <span className="text-[0.82rem] font-medium text-text-secondary mb-2 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-accent/60" />
                          {article.company}
                        </span>
                      )}
                      <h3 className="text-[1.05rem] font-semibold text-text-primary leading-snug mb-3">
                        {article.title}
                      </h3>

                      {/* Editors' Pick Badge (only for articles with editorPick: true) */}
                      {article.editorPick && (
                        <div className="flex items-center gap-1.5 text-[0.72rem] font-bold tracking-[0.06em] uppercase text-[#2962FF] mb-3 mt-auto">
                          <svg className="w-3.5 h-3.5 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                            <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"/>
                          </svg>
                          <span>EDITORS&apos; PICK</span>
                        </div>
                      )}

                      {/* Action */}
                      <div className={article.editorPick ? "" : "mt-auto"}>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleArticleClick(article.id)}
                          className="inline-flex items-center gap-3 bg-bg-primary border border-border rounded-xl px-3 py-2 w-full transition-all duration-200 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)] group/cta"
                        >
                          <span className="relative w-16 h-10 rounded-md overflow-hidden bg-bg-tertiary shrink-0">
                            <img src={getArticleImage(article)} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </span>
                          <span className="text-[0.88rem] font-semibold tracking-tight text-text-primary flex items-center gap-1.5">
                            {ideas.ctaText}
                            <ArrowRight className="w-3.5 h-3.5 text-accent transition-transform duration-200 group-hover/cta:translate-x-1" />
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <p className="text-text-muted text-lg">{ideas.noResults}</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-accent text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
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
