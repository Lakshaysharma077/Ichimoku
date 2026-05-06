'use client';

import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Prevent hydration mismatch by only rendering once mounted
  if (!mounted) {
    return <div className="min-h-screen bg-[#0c101f]" />;
  }

  return <>{children}</>;
}
