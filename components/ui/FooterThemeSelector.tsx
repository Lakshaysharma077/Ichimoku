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
    <div className="flex items-center font-mono text-[10px] text-text-muted uppercase tracking-widest bg-bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
      <span className="mr-2">[</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setTheme('signature')}
          className={`hover:text-text-primary transition-colors ${theme === 'signature' ? 'text-accent font-bold' : ''}`}
        >
          Edge
        </button>
        <span className="opacity-30">/</span>
        <button 
          onClick={() => setTheme('light')}
          className={`hover:text-text-primary transition-colors ${theme === 'light' ? 'text-accent font-bold' : ''}`}
        >
          Light
        </button>
        <span className="opacity-30">/</span>
        <button 
          onClick={() => setTheme('dark')}
          className={`hover:text-text-primary transition-colors ${theme === 'dark' ? 'text-accent font-bold' : ''}`}
        >
          Dark
        </button>
      </div>
      <span className="ml-2">]</span>
    </div>
  );
}
