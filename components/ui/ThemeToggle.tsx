'use client';

import { useThemeStore } from '@/store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  const getIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-[15.5px] h-[15.5px]" />;
      case 'dark': return <Moon className="w-[15.5px] h-[15.5px]" />;
      case 'signature': return <Sparkles className="w-[15.5px] h-[15.5px]" />;
    }
  };

  return (
    <div className="relative group flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-bg-secondary text-text-primary transition-colors flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Hover Info */}
      <div className="absolute top-full mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-50">
        <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5">
          ( Edge / Light / Dark )
        </span>
      </div>
    </div>
  );
}
