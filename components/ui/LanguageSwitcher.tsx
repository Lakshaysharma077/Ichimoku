'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
  { code: 'EN', label: 'English', flagUrl: 'https://em-content.zobj.net/source/apple/237/flag-for-united-states_1f1fa-1f1f8.png' },
  { code: 'JA', label: 'Japan', flagUrl: 'https://em-content.zobj.net/source/apple/237/flag-for-japan_1f1ef-1f1f5.png' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export default function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const iconSize = variant === 'minimal' ? 'w-[14px] h-[14px]' : 'w-[18px] h-[18px]';
  const fontSize = variant === 'minimal' ? 'text-[11px]' : 'text-[13px]';
  const chevronSize = variant === 'minimal' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const padding = variant === 'minimal' ? 'px-1 py-1' : 'px-2 py-1.5';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Top Bar Selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-1.5 rounded-xl transition-all duration-300 hover:bg-white/5 ${padding}`}
      >
        <Globe 
          className={`${iconSize} transition-all duration-300 ${
            isOpen ? 'text-accent scale-110' : 'text-accent/80 group-hover:text-accent'
          }`} 
        />
        <span className={`${fontSize} font-bold font-mono tracking-wider text-accent`}>
          {currentLang.code}
        </span>
        <ChevronDown 
          className={`${chevronSize} transition-all duration-500 ease-out ${
            isOpen ? 'rotate-180 text-accent' : 'text-accent/60 group-hover:text-accent'
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 mt-3 w-52 overflow-hidden rounded-[20px] bg-bg-secondary/95 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110]"
          >
            {/* Header section */}
            <div className="px-5 py-3.5 border-b border-border/50">
              <p className="text-[10px] font-mono font-bold text-accent/50 uppercase tracking-[0.2em]">
                Select Language
              </p>
            </div>

            {/* Language list */}
            <div className="p-1.5">
              {languages.map((lang) => {
                const isActive = currentLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[14px] transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-transparent' 
                        : 'hover:bg-bg-tertiary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 z-10">
                      <div className={`relative w-8 h-8 transition-all duration-500 ${
                        isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                      }`}
                      >
                        <img 
                          src={lang.flagUrl} 
                          alt={lang.label} 
                          className="absolute inset-0 w-full h-full object-contain drop-shadow-md" 
                        />
                      </div>
                      <span className={`text-[14px] font-medium transition-colors duration-300 ${
                        isActive ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary'
                      }`}>
                        {lang.label}
                      </span>
                    </div>

                    {isActive && (
                      <motion.div 
                        layoutId="active-glow"
                        className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}

                    {isActive ? (
                      <Check className="w-4 h-4 text-accent z-10" strokeWidth={3} />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-text-muted/20 group-hover:bg-accent/30 transition-colors z-10" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Subtle bottom accent */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
