'use client';

import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Sun, Moon, Star } from 'lucide-react';

type Theme = 'light' | 'dark' | 'signature';

const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { id: 'signature', label: 'Ichimoku Edge', icon: <Star className="w-4 h-4" /> },
];

export default function FooterThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((t) => (
        <motion.button
          key={t.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(t.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 border ${
            theme === t.id
              ? 'bg-accent/15 text-accent border-accent/30 shadow-[0_0_12px_rgba(251,225,120,0.1)]'
              : 'bg-bg-secondary text-text-muted border-border hover:text-text-primary hover:border-text-muted/30'
          }`}
          aria-label={`Switch to ${t.label} theme`}
        >
          {t.icon}
          <span className="font-mono uppercase tracking-wider">{t.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
