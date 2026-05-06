'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { seedIndicators } from '@/lib/indicators';
import KanjiWatermark from '@/components/shared/KanjiWatermark';
import ScrollReveal from '@/components/shared/ScrollReveal';
import FilterBar from '@/components/tools/FilterBar';
import IndicatorCard from '@/components/tools/IndicatorCard';
import AdminPanel from '@/components/tools/AdminPanel';
import { Lock } from 'lucide-react';

export default function ToolsPage() {
  const { indicators, setIndicators, isAdminMode, setAdminMode, deleteIndicator } = useAdminStore();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (indicators.length === 0) {
      setIndicators(seedIndicators);
    }
  }, []);

  const filteredIndicators = indicators.filter((ind) => {
    if (activeFilter === "All") return ind.status === 'Published' || isAdminMode;
    const matchesFilter = 
      ind.badgeType.toLowerCase().includes(activeFilter.toLowerCase()) || 
      ind.category.some(c => c.toLowerCase().includes(activeFilter.toLowerCase()));
    
    return matchesFilter && (ind.status === 'Published' || isAdminMode);
  });

  // Ctrl+Shift+A to toggle admin mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setAdminMode(!isAdminMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminMode]);

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-screen">
      <KanjiWatermark kanji="道具" className="bottom-10 left-[-5%] opacity-[0.04]" size="30vw" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-5xl lg:text-7xl text-text-primary mb-4 uppercase tracking-tighter leading-[0.9]">
              Tools & Indicators
            </h1>
            <p className="shippori-mincho text-2xl text-text-muted mb-6">
              「道具と指標」
            </p>
            <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
              Precision-built Pine Script indicators for TradingView. Each tool is battle-tested on real markets.
            </p>
          </div>
        </ScrollReveal>

        {isAdminMode && <AdminPanel />}

        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndicators.map((ind, i) => (
            <ScrollReveal key={ind.id} delay={i * 0.05}>
              <IndicatorCard 
                indicator={ind} 
                isAdmin={isAdminMode} 
                onDelete={deleteIndicator}
              />
            </ScrollReveal>
          ))}
        </div>

        {filteredIndicators.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="text-text-muted font-mono uppercase tracking-widest">No indicators found for this category.</p>
          </div>
        )}

        {/* Secret Admin Trigger Link in Footer (hidden but accessible) */}
        <div className="mt-24 pt-12 border-t border-border flex justify-center">
          <button 
            onClick={() => setAdminMode(!isAdminMode)}
            className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] hover:text-accent transition-colors"
          >
            <Lock className="w-3 h-3" />
            {isAdminMode ? "Disable Admin Mode" : "Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}
