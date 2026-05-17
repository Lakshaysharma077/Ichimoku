'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { seedIndicators } from '@/lib/indicators';
import ScrollReveal from '@/components/shared/ScrollReveal';
import FilterBar from '@/components/tools/FilterBar';
import IndicatorCard from '@/components/tools/IndicatorCard';
import AdminPanel from '@/components/tools/AdminPanel';
import EditableElement from '@/components/admin/EditableElement';
import { useContent } from '@/hooks/useContent';
import { Lock } from 'lucide-react';

export default function ToolsPage() {
  const tools = useContent('tools');
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
    <div className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]">

      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <h1 className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-12 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="tools" path={['hero', 'heading']} content={tools.hero.heading} />
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
              <EditableElement section="tools" path={['hero', 'description']} content={tools.hero.description} />
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
            <p className="text-text-muted font-mono uppercase tracking-widest">
              <EditableElement section="tools" path={['noResults']} content={tools.noResults} />
            </p>
          </div>
        )}

        {/* Secret Admin Trigger Link in Footer (hidden but accessible) */}
        <div className="mt-24 pt-12 border-t border-border flex justify-center">
          <button 
            onClick={() => setAdminMode(!isAdminMode)}
            className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] hover:text-accent transition-colors"
          >
            <Lock className="w-3 h-3" />
            <EditableElement section="tools" path={['adminLink', isAdminMode ? 'disable' : 'enable']} content={isAdminMode ? tools.adminLink.disable : tools.adminLink.enable} />
          </button>
        </div>
      </div>
    </div>
  );
}
