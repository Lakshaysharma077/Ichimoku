'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sun, Monitor, Moon, Check, Youtube, Link as LinkIcon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';
import { clsx } from 'clsx';
import { useContent } from '@/hooks/useContent';

const languages = [
  { code: 'EN', label: 'English', flag: '🇺🇸' },
  { code: 'JA', label: 'Japan', flag: '🇯🇵' },
];

const THEMES = [
  { key: 'light', icon: Sun, label: 'Light' },
  { key: 'signature', icon: Monitor, label: 'Edge' },
  { key: 'dark', icon: Moon, label: 'Dark' },
] as const;

type ThemeKey = 'light' | 'signature' | 'dark';

export default function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useThemeStore();
  const { socials } = useContent('footer');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Settings Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-10 h-10 rounded-full border border-border/50 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group bg-bg-secondary/50 backdrop-blur-md relative overflow-hidden",
          "hover:border-accent/40 hover:bg-bg-secondary hover:shadow-[0_8px_20px_rgba(0,0,0,0.2),0_0_15px_rgba(var(--accent),0.1)] hover:-translate-y-0.5",
          isOpen ? "border-accent shadow-[0_0_15px_rgba(var(--accent),0.2)] bg-bg-secondary" : ""
        )}
      >
        <Settings 
          className={clsx(
            "w-4 h-4 transition-all duration-700 ease-[0.23,1,0.32,1] group-hover:text-accent group-hover:scale-110",
            isOpen ? "text-accent rotate-90" : "text-text-secondary group-hover:rotate-12"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full right-0 mt-3 w-56 z-[120]"
          >
            {/* Solid theme-aware background (No transparency) */}
            <div className="bg-bg-secondary border border-border/50 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col p-4 gap-5 font-sans">
                
                {/* 1. DISPLAY MODE */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2">
                    DISPLAY MODE
                  </span>
                  <div className="flex items-center gap-1 bg-bg-primary/50 p-1 rounded-lg border border-white/5">
                    {THEMES.map(({ key, icon: Icon, label }) => (
                      <button 
                        key={key}
                        onClick={() => setTheme(key as ThemeKey)}
                        className={clsx(
                          "flex-1 py-1.5 rounded-md flex items-center justify-center transition-all duration-300",
                          theme === key ? "bg-accent/10 border border-accent/20 text-accent shadow-[0_0_8px_rgba(var(--accent),0.1)]" : "text-text-muted hover:text-text-primary hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                  {/* Theme labels row */}
                  <div className="flex items-center">
                    {THEMES.map(({ key, label }) => (
                      <span
                        key={key}
                        className={clsx(
                          'flex-1 text-center text-[8px] uppercase tracking-widest font-bold transition-colors duration-300',
                          theme === key ? 'text-accent' : 'text-text-muted',
                        )}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* 2. LANGUAGE */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2">
                    <span className="text-[10px]">🌐</span> LANGUAGE
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLang(lang)}
                        className="flex items-center justify-between py-1.5 px-2 rounded-md group transition-colors hover:bg-white/5"
                      >
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={`/images/flags/${lang.code === 'EN' ? 'usa' : 'japan'}.png`} 
                            alt="" 
                            className="w-5 h-4 object-contain"
                          />
                          <span className={clsx(
                            "text-[11px] font-medium transition-colors",
                            currentLang.code === lang.code ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                          )}>
                            {lang.label}
                          </span>
                        </div>
                        {currentLang.code === lang.code && (
                          <Check className="w-3 h-3 text-accent" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* 3. SOCIAL */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2">
                    <span className="text-[10px]">💬</span> SOCIAL
                  </span>
                  <div className="flex gap-1.5 px-0.5">
                    {[
                      { icon: XIcon, href: socials.x, title: 'X' },
                      { icon: Youtube, href: socials.youtube, title: 'YouTube' },
                      { icon: TradingViewIcon, href: socials.tradingview, title: 'TradingView' },
                    ].map((social, i) => (
                      <a 
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-bg-primary/50 border border-white/5 flex items-center justify-center text-text-muted transition-all duration-500 ease-[0.23,1,0.32,1] hover:text-accent hover:bg-accent/5 hover:border-accent/20 hover:shadow-[0_0_12px_rgba(var(--accent),0.1)] hover:-translate-y-0.5 group/social"
                        title={social.title}
                      >
                        <social.icon className="w-4 h-4 transition-transform duration-500 group-hover/social:scale-110" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* 4. SHARE */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-2">
                    <span className="text-[10px]">🔗</span> SHARE
                  </span>
                  <button 
                    onClick={handleCopyLink}
                    className={clsx(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-300 group",
                      copied ? "text-accent bg-accent/5" : "text-text-secondary hover:text-accent hover:bg-white/5"
                    )}
                  >
                    {copied ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <LinkIcon className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                    )}
                    <span className="text-[11px] font-medium">{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
