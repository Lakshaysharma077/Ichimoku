import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Indicator {
  id: string;
  name: string;
  description: string;
  badgeType: 'FREE' | 'PREMIUM' | '14-DAY TRIAL';
  price: string;
  tvUrl: string;
  category: string[];
  status: 'Published' | 'Draft';
  sortOrder: number;
  rating: number;
  numRatings: number;
}

interface AdminState {
  isAdminMode: boolean;
  setAdminMode: (mode: boolean) => void;
  indicators: Indicator[];
  addIndicator: (indicator: Indicator) => void;
  updateIndicator: (id: string, updates: Partial<Indicator>) => void;
  deleteIndicator: (id: string) => void;
  setIndicators: (indicators: Indicator[]) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdminMode: false,
      setAdminMode: (mode) => set({ isAdminMode: mode }),
      indicators: [],
      addIndicator: (indicator) => set((state) => ({ 
        indicators: [...state.indicators, indicator].sort((a, b) => a.sortOrder - b.sortOrder) 
      })),
      updateIndicator: (id, updates) => set((state) => ({
        indicators: state.indicators.map((ind) => ind.id === id ? { ...ind, ...updates } : ind)
          .sort((a, b) => a.sortOrder - b.sortOrder)
      })),
      deleteIndicator: (id) => set((state) => ({
        indicators: state.indicators.filter((ind) => ind.id !== id)
      })),
      setIndicators: (indicators) => set({ indicators: indicators.sort((a, b) => a.sortOrder - b.sortOrder) }),
    }),
    {
      name: 'ichimoku-admin',
    }
  )
);
