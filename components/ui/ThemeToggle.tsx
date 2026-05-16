'use client';

import { useThemeStore } from '@/store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-[18px] h-[18px]" />;
      case 'dark': return <Moon className="w-[18px] h-[18px]" />;
      case 'signature': return <Sparkles className="w-[18px] h-[18px]" />;
    }
  };

  return (
    <div className="relative group flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="w-8 h-8 rounded-full border !border-[#fbe178]/40 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group bg-bg-secondary/30 backdrop-blur-md relative overflow-hidden hover:!border-[#fbe178]/80 hover:bg-bg-secondary hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center text-accent/60 group-hover:text-accent transition-colors"
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Hover Info - Premium Pill Frame */}
      <div className="absolute top-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none z-50">
        <div className="bg-bg-primary border border-border px-3 py-1.5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center gap-2 whitespace-nowrap">
          <span className={`text-[9px] font-black syne uppercase tracking-wider ${theme === 'signature' ? 'text-accent' : 'text-text-muted/50'}`}>
            Edge
          </span>
          <div className="w-px h-3 bg-border mx-0.5" />
          <span className={`text-[9px] font-black syne uppercase tracking-wider ${theme === 'light' ? 'text-accent' : 'text-text-muted/50'}`}>
            Light
          </span>
          <div className="w-px h-3 bg-border mx-0.5" />
          <span className={`text-[9px] font-black syne uppercase tracking-wider ${theme === 'dark' ? 'text-accent' : 'text-text-muted/50'}`}>
            Dark
          </span>
        </div>
      </div>
    </div>
  );
}
