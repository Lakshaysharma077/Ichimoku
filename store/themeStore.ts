import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'signature';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'signature',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => {
        if (state.theme === 'light') return { theme: 'dark' };
        if (state.theme === 'dark') return { theme: 'signature' };
        return { theme: 'light' };
      }),
    }),
    {
      name: 'ichimoku-theme',
    }
  )
);
