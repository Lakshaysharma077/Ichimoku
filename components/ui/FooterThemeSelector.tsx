'use client';

import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';

type Theme = 'light' | 'dark' | 'signature';

const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { id: 'signature', label: 'Ichimoku Edge', icon: <Sparkles className="w-4 h-4" /> },
];

export default function FooterThemeSelector() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center font-mono text-[10px] text-text-muted uppercase tracking-widest bg-bg-secondary/50 px-2 py-1 rounded-lg border border-border/30">
      <div className="flex items-center gap-2.5">
        <button 
          onClick={() => setTheme('signature')}
          className={`hover:text-text-primary transition-colors ${theme === 'signature' ? 'text-accent font-bold' : ''}`}
        >
          Edge
        </button>
        <div className="w-[1px] h-2.5 bg-text-muted/20" />
        <button 
          onClick={() => setTheme('light')}
          className={`hover:text-text-primary transition-colors ${theme === 'light' ? 'text-accent font-bold' : ''}`}
        >
          Light
        </button>
        <div className="w-[1px] h-2.5 bg-text-muted/20" />
        <button 
          onClick={() => setTheme('dark')}
          className={`hover:text-text-primary transition-colors ${theme === 'dark' ? 'text-accent font-bold' : ''}`}
        >
          Dark
        </button>
      </div>
    </div>
  );
}
