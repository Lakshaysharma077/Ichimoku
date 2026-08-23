'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Search, ArrowRight, Clock, Clock4 } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

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

/** Calculate estimated reading time based on article word count (~200 words/min) */
function getReadingTime(wordCount?: number): string {
  const words = typeof wordCount === 'number' && wordCount > 0 ? wordCount : 1000;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `Reading time: ${minutes} min`;
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

  const [readTimes, setReadTimes] = useState<Record<string, number>>({});

  // Load times from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const times: Record<string, number> = {};
      allArticles.forEach((article: any) => {
        if (article.id) {
          const stored = localStorage.getItem(`read_time_${article.id}`);
          if (stored) {
            times[article.id] = parseInt(stored, 10);
          }
        }
      });
      setReadTimes(times);
    }
  }, [allArticles]);

  // Track window focus events to calculate visited time
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

  const formatVisitedTime = (articleId: string) => {
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
                placeholder={ideas.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-text-primary text-xs placeholder:text-text-muted"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Card (latest idea) ── */}
        <AnimatePresence mode="wait">
          {featured && (
            <ScrollReveal delay={0.15}>
              <motion.div
                key={featured.id || "featured"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-7"
              >
                <div className="group relative grid grid-cols-1 md:grid-cols-[1.35fr_1fr] border border-border rounded-2xl overflow-hidden bg-bg-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.35)]">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-accent via-accent/40 to-transparent" />

                  {/* Image */}
                  <a
                    href={featured.url || featured.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleArticleClick(featured.id)}
                    className="relative block overflow-hidden min-h-[200px] md:min-h-[220px] bg-bg-primary"
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
                  </a>

                  {/* Body */}
                  <div className="p-6 flex flex-col justify-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[0.64rem] font-bold tracking-[0.14em] uppercase text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(251,225,120,0.18)]" />
                      {ideas.featuredLabel}
                    </span>

                    {/* Metadata: Date • Estimated Reading time • Visited time */}
                    <div className="text-[0.68rem] font-bold tracking-[0.05em] uppercase text-text-muted flex items-center flex-wrap gap-y-1 gap-x-1.5">
                      <span>{formatDate(featured.date)}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-text-muted">
                        <Clock4 className="w-3 h-3 text-accent/80 shrink-0" />
                        <span>{getReadingTime(featured.wordCount)}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-text-muted">
                        <Clock className="w-3 h-3 text-accent/80 shrink-0" />
                        {readTimes[featured.id] ? (
                          <span className="text-[#2962FF] font-bold">
                            {formatVisitedTime(featured.id)}
                          </span>
                        ) : (
                          <span className="text-text-muted/60">Not visited yet</span>
                        )}
                      </span>
                    </div>

                    {featured.company && (
                      <span className="text-[0.76rem] font-medium text-text-secondary flex items-center gap-1.5 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-accent/60" />
                        {featured.company}
                      </span>
                    )}
                    <h2 className="text-[1.25rem] font-bold text-text-primary leading-snug mt-0.5 line-clamp-2">
                      {featured.title}
                    </h2>

                    {/* Editors' Pick Badge (only if editorPick is true) */}
                    {featured.editorPick && (
                      <div className="flex items-center gap-1.5 text-[0.7rem] font-bold tracking-[0.06em] uppercase text-[#2962FF] mt-1">
                        <svg className="w-3 h-3 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                          <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"/>
                        </svg>
                        <span>EDITORS&apos; PICK</span>
                      </div>
                    )}

                    {/* Action */}
                    <a
                      href={featured.url || featured.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleArticleClick(featured.id)}
                      className="mt-3 inline-flex items-center gap-2.5 bg-bg-primary border border-border rounded-xl px-3 py-1.5 transition-all duration-200 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_-6px_rgba(0,0,0,0.4)] group/cta"
                    >
                      <span className="relative w-12 h-8 rounded-md overflow-hidden bg-bg-primary shrink-0">
                        <img src={featured.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </span>
                      <span className="text-[0.82rem] font-bold tracking-tight text-text-primary flex items-center gap-1.5">
                        {featured.url ? ideas.ctaText : "View Market Chart"}
                        <ArrowRight className="w-3 h-3 text-accent transition-transform duration-200 group-hover/cta:translate-x-1" />
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
            >
              {gridItems.map((article: any, i: number) => (
                <ScrollReveal key={article.id || i} delay={0.1 + i * 0.05} className="h-full">
                  <div className="group relative flex flex-col h-full border border-border rounded-xl overflow-hidden bg-bg-primary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_14px_30px_-10px_rgba(0,0,0,0.35)]">
                    {/* Top accent hairline */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-gradient-to-r from-accent/50 via-accent/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Scan sweep on hover */}
                    <div className="absolute top-0 left-0 w-[40%] h-[2px] z-20 bg-gradient-to-r from-transparent via-accent/80 to-transparent opacity-0 group-hover:animate-[scanSweep_0.9s_ease_forwards] pointer-events-none" />

                    {/* Image */}
                    <a
                      href={article.url || article.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleArticleClick(article.id)}
                      className="relative block aspect-video overflow-hidden bg-bg-primary shrink-0"
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
                    </a>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Metadata: Date • Estimated Reading time • Visited time */}
                      <div className="text-[0.66rem] font-bold tracking-[0.05em] uppercase text-text-muted mb-1.5 flex items-center flex-wrap gap-y-1 gap-x-1.5">
                        <span>{formatDate(article.date)}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-text-muted">
                          <Clock4 className="w-3 h-3 text-accent/80 shrink-0" />
                          <span>{getReadingTime(article.wordCount)}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-text-muted">
                          <Clock className="w-3 h-3 text-accent/80 shrink-0" />
                          {readTimes[article.id] ? (
                            <span className="text-[#2962FF] font-bold">
                              {formatVisitedTime(article.id)}
                            </span>
                          ) : (
                            <span className="text-text-muted/60">Not visited yet</span>
                          )}
                        </span>
                      </div>

                      {/* Company */}
                      <div className="min-h-[1.1rem] mb-1 flex items-center">
                        {article.company ? (
                          <span className="text-[0.76rem] font-medium text-text-secondary flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                            <span className="truncate">{article.company}</span>
                          </span>
                        ) : null}
                      </div>

                      {/* Title: consistent line clamp and fixed min height */}
                      <h3 className="text-[0.92rem] font-semibold text-text-primary leading-snug mb-2 line-clamp-2 min-h-[2.4rem]">
                        {article.title}
                      </h3>

                      {/* Bottom section anchored with mt-auto */}
                      <div className="mt-auto pt-2 flex flex-col gap-2">
                        {/* Editors' Pick Badge Row (fixed height so cards align identically) */}
                        <div className="h-4 flex items-center">
                          {article.editorPick ? (
                            <div className="flex items-center gap-1 text-[0.66rem] font-bold tracking-[0.06em] uppercase text-[#2962FF]">
                              <svg className="w-3 h-3 fill-[#2962FF] shrink-0" viewBox="0 0 24 24">
                                <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z"/>
                              </svg>
                              <span>EDITORS&apos; PICK</span>
                            </div>
                          ) : null}
                        </div>

                        {/* Action CTA button */}
                        <a
                          href={article.url || article.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleArticleClick(article.id)}
                          className="inline-flex items-center gap-2.5 bg-bg-primary border border-border rounded-lg px-2.5 py-1.5 w-full transition-all duration-200 hover:border-accent/50 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_-6px_rgba(0,0,0,0.4)] group/cta"
                        >
                          <span className="relative w-11 h-7 rounded overflow-hidden bg-bg-primary shrink-0">
                            <img src={article.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </span>
                          <span className="text-[0.8rem] font-semibold tracking-tight text-text-primary flex items-center gap-1">
                            {article.url ? ideas.ctaText : "View Market Chart"}
                            <ArrowRight className="w-3 h-3 text-accent transition-transform duration-200 group-hover/cta:translate-x-1" />
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
