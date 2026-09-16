'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sun, Monitor, Moon, Check, Youtube, Link as LinkIcon, Sparkles } from 'lucide-react';
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
  { key: 'signature', icon: Sparkles, label: 'Edge' },
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
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-8 h-8 flex items-center justify-center transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group relative",
          "hover:opacity-80"
        )}
        aria-label="Settings"
      >
        <Globe 
          className={clsx(
            "w-[17px] h-[17px] transition-all duration-300 ease-out",
            isOpen ? "text-accent rotate-12" : "text-text-secondary group-hover:text-accent group-hover:rotate-12"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full right-0 pt-3 w-56 z-[120]"
          >
            <div className="bg-bg-secondary border border-border rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.25)] overflow-hidden relative">
              
              <div className="relative z-10 flex flex-col p-4 gap-4 font-sans">
                
                {/* 1. THEME */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] font-mono">
                    THEME
                  </span>
                  <div className="flex gap-1">
                    {THEMES.map((t) => {
                      const Icon = t.icon;
                      const isActive = theme === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setTheme(t.key as ThemeKey)}
                          className={clsx(
                            "flex-1 flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group/theme",
                            isActive 
                              ? "bg-accent/[0.08] border border-accent/20" 
                              : "border border-transparent hover:bg-bg-primary/50 hover:border-border/30"
                          )}
                        >
                          <Icon className={clsx(
                            "w-3.5 h-3.5 transition-colors duration-200",
                            isActive ? "text-accent" : "text-text-muted group-hover/theme:text-text-secondary"
                          )} />
                          <span className={clsx(
                            "text-[9px] font-bold uppercase tracking-[0.1em] transition-colors duration-200",
                            isActive ? "text-accent" : "text-text-muted group-hover/theme:text-text-secondary"
                          )}>
                            {t.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-border/50 w-full" />

                {/* 2. LANGUAGE */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] font-mono">
                    LANGUAGE
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLang(lang)}
                        className="flex items-center justify-between py-1.5 px-2 rounded-md group transition-colors hover:bg-bg-primary/50"
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

                <div className="h-px bg-border/50 w-full" />

                {/* 3. SOCIAL */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] font-mono">
                    SOCIAL
                  </span>
                  <div className="flex gap-1.5 px-0.5">
                    {[
                      { icon: TradingViewIcon, href: socials.tradingview, title: 'TradingView' },
                      { icon: Youtube, href: socials.youtube, title: 'YouTube' },
                      { icon: XIcon, href: socials.x, title: 'X' },
                      { 
                        icon: () => (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                          </svg>
                        ), 
                        href: socials.discord, 
                        title: 'Discord' 
                      },
                    ].map((social, i) => (
                      <a 
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-bg-primary/50 border border-border/30 flex items-center justify-center text-text-muted transition-all duration-200 ease-[0.23,1,0.32,1] hover:text-accent hover:border-accent/20 group/social"
                        title={social.title}
                      >
                        <social.icon className="w-4 h-4 transition-transform duration-200 group-hover/social:scale-110" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border/50 w-full" />

                {/* 4. SHARE */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] font-mono">
                    SHARE
                  </span>
                  <button 
                    onClick={handleCopyLink}
                    className={clsx(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-300 group",
                      copied ? "text-accent bg-accent/5" : "text-text-secondary hover:text-accent hover:bg-bg-primary/50"
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
