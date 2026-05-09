'use client';

import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

export default function FooterThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center font-mono text-[9px] text-text-muted uppercase tracking-widest bg-bg-secondary/30 px-1 py-0.5 rounded-full border border-border">
      <div className="flex items-center relative gap-1">
        <button 
          onClick={() => setTheme('signature')}
          className={`relative px-2 py-1 rounded-full transition-all duration-300 hover:text-text-primary ${theme === 'signature' ? 'text-accent font-bold' : ''}`}
        >
          <span className="relative z-10">Edge</span>
          {theme === 'signature' && (
            <motion.div 
              layoutId="footer-active-pill"
              className="absolute inset-0 bg-text-primary/10 border border-border rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
        <div className="w-px h-3.5 bg-border" />
        <button 
          onClick={() => setTheme('light')}
          className={`relative px-2 py-1 rounded-full transition-all duration-300 hover:text-text-primary ${theme === 'light' ? 'text-accent font-bold' : ''}`}
        >
          <span className="relative z-10">Light</span>
          {theme === 'light' && (
            <motion.div 
              layoutId="footer-active-pill"
              className="absolute inset-0 bg-text-primary/10 border border-border rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
        <div className="w-px h-3.5 bg-border" />
        <button 
          onClick={() => setTheme('dark')}
          className={`relative px-2 py-1 rounded-full transition-all duration-300 hover:text-text-primary ${theme === 'dark' ? 'text-accent font-bold' : ''}`}
        >
          <span className="relative z-10">Dark</span>
          {theme === 'dark' && (
            <motion.div 
              layoutId="footer-active-pill"
              className="absolute inset-0 bg-text-primary/10 border border-border rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
