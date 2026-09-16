'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import ToolsSidebar, { SidebarItem } from '@/components/tools/ToolsNav';
import ToolDocContent from '@/components/tools/ToolSection';
import IndicatorModal from '@/components/tools/IndicatorModal';
import { IndicatorData } from '@/components/tools/IndicatorCard';
import { useContent } from '@/hooks/useContent';
import EditableElement from '@/components/admin/EditableElement';
import { Plus, RefreshCw, Pencil, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/shared/ScrollReveal';

/* ─── Helpers ─── */

function parseCategories(category: any): string[] {
  if (!category) return [];
  if (Array.isArray(category)) return category;
  if (typeof category === 'string') {
    try {
      const parsed = JSON.parse(category);
      return Array.isArray(parsed) ? parsed : [category];
    } catch {
      return [category];
    }
  }
  return [];
}

function getAccessLabel(indicator: IndicatorData): string {
  const s = indicator.accessStatus || 'Premium';
  if (s === 'Free') return 'Complimentary';
  if (s === 'Coming Soon') return 'Coming Soon';
  if (s === 'Deprecated') return 'Discontinued';
  if (s === 'Beta') return 'Trial';
  return 'Subscription';
}

/** Derive unique category groups from indicators for the left sidebar */
function buildCategoryNav(indicators: IndicatorData[]): { items: SidebarItem[]; groups: Record<string, IndicatorData[]> } {
  // Group by access-based category: Core Tool (Free), Premium, Coming Soon, etc.
  const coreTools: IndicatorData[] = [];
  const premiumTools: IndicatorData[] = [];
  const otherTools: IndicatorData[] = [];

  for (const ind of indicators) {
    const s = ind.accessStatus || 'Premium';
    if (s === 'Free') coreTools.push(ind);
    else if (s === 'Premium') premiumTools.push(ind);
    else otherTools.push(ind);
  }

  const items: SidebarItem[] = [];
  const groups: Record<string, IndicatorData[]> = {};
  let counter = 1;

  // "All" always first
  items.push({ id: 'all', number: String(counter++).padStart(2, '0'), label: 'All Tools' });
  groups['all'] = indicators;

  if (coreTools.length > 0) {
    items.push({ id: 'core', number: String(counter++).padStart(2, '0'), label: 'Core' });
    groups['core'] = coreTools;
  }

  if (premiumTools.length > 0) {
    items.push({ id: 'premium', number: String(counter++).padStart(2, '0'), label: 'Premium' });
    groups['premium'] = premiumTools;
  }

  if (otherTools.length > 0) {
    items.push({ id: 'other', number: String(counter++).padStart(2, '0'), label: 'Other' });
    groups['other'] = otherTools;
  }

  return { items, groups };
}

/** Build documentation section nav from indicator data */
function buildDocSections(indicator: IndicatorData): SidebarItem[] {
  const sections: SidebarItem[] = [];
  let c = 1;

  sections.push({ id: 'overview', number: String(c++).padStart(2, '0'), label: 'Overview' });


  if (indicator.howItWorks) {
    sections.push({ id: 'methodology', number: String(c++).padStart(2, '0'), label: 'Methodology' });
  }

  const hasFeatures = (() => {
    if (Array.isArray(indicator.features) && indicator.features.length > 0) return true;
    if (typeof indicator.features === 'string' && indicator.features.trim().length > 2) {
      try { const p = JSON.parse(indicator.features); return Array.isArray(p) && p.length > 0; } catch { return true; }
    }
    return false;
  })();
  if (hasFeatures) {
    sections.push({ id: 'features', number: String(c++).padStart(2, '0'), label: 'Features' });
  }

  if (indicator.howToUse) {
    sections.push({ id: 'usage', number: String(c++).padStart(2, '0'), label: 'Usage' });
  }

  const hasScreenshots = (() => {
    if (!indicator.screenshots) return false;
    if (typeof indicator.screenshots === 'string') {
      try { const p = JSON.parse(indicator.screenshots); return Array.isArray(p) && p.length > 0; } catch { return false; }
    }
    return Array.isArray(indicator.screenshots) && indicator.screenshots.length > 0;
  })();
  if (hasScreenshots) {
    sections.push({ id: 'examples', number: String(c++).padStart(2, '0'), label: 'Examples' });
  }

  sections.push({ id: 'access', number: String(c++).padStart(2, '0'), label: 'Access' });

  return sections;
}

/* ─── Main Page ─── */

export default function ToolsPage() {
  const tools = useContent('tools');
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessProfile, setAccessProfile] = useState<any>({ canAccessPremium: false });

  // Level 1 state
  const [activeCategory, setActiveCategory] = useState('all');

  // Level 2 state
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorData | null>(null);

  // Trial
  const [trialInfo, setTrialInfo] = useState<{ isTrial: boolean; daysRemaining: number } | null>(null);

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/indicators');
      if (res.ok) {
        const data = await res.json();
        setIndicators(data.indicators || []);
      }
    } catch (err) {
      console.error('Failed to fetch indicators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIndicators(); }, []);

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === 'ADMIN') {
        setAccessProfile({ canAccessPremium: true, accessLevel: 'Admin' });
      } else {
        fetch('/api/user/profile')
          .then((r) => r.json())
          .then((data) => {
            if (data.accessProfile) setAccessProfile(data.accessProfile);
            if (data.subscriptionInfo?.isTrial) {
              setTrialInfo({
                isTrial: true,
                daysRemaining: data.subscriptionInfo.trialDaysRemaining ?? 14,
              });
            }
          })
          .catch(() => {});
      }
    }
  }, [session]);

  // CRUD handlers
  const handleSaveIndicator = async (payload: Partial<IndicatorData>) => {
    if (payload.id) {
      const res = await fetch('/api/indicators', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to update'); }
    } else {
      const res = await fetch('/api/indicators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create'); }
    }
    await fetchIndicators();
  };

  const handleDeleteIndicator = async (id: string) => {
    if (!confirm('Delete this indicator?')) return;
    try {
      const res = await fetch(`/api/indicators?id=${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); alert(d.error || 'Failed to delete'); return; }
      if (selectedIndicator?.id === id) setSelectedIndicator(null);
      await fetchIndicators();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSelectIndicator = (ind: IndicatorData) => {
    setSelectedIndicator(ind);
    setActiveSection('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToIndex = () => {
    setSelectedIndicator(null);
    setActiveSection('overview');
  };

  // Derived data
  const { items: categoryItems, groups: categoryGroups } = buildCategoryNav(indicators);
  const filteredIndicators = categoryGroups[activeCategory] || indicators;
  const docSections = selectedIndicator ? buildDocSections(selectedIndicator) : [];

  return (
    <div className="pt-36 pb-24 relative min-h-[100svh]">
      {/* Subtle Background Watermark */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-[0.015] overflow-hidden -z-10 select-none">
        <span className="font-bold text-[20vw] tracking-tighter whitespace-nowrap syne">
          一目均衡表
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Trial Banner */}
        {trialInfo?.isTrial && (
          <div className="mb-8 py-3 px-4 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest block text-text-primary">
                Trial Active — {trialInfo.daysRemaining} {trialInfo.daysRemaining === 1 ? 'Day' : 'Days'} Remaining
              </span>
              <span className="text-[11px] text-text-muted">
                Website tools & scanners unlocked. TradingView whitelisting queued for review.
              </span>
            </div>
            <a
              href="/checkout?plan=Samurai"
              className="px-4 py-2 border border-border hover:border-accent/40 text-text-primary font-mono text-[10px] font-bold uppercase tracking-widest transition-colors shrink-0"
            >
              Upgrade →
            </a>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* LEVEL 1: Tool Library                                 */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {!selectedIndicator && (
          <>
            {/* Header */}
            <div className="mb-10 flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase text-text-muted tracking-[0.2em] block mb-3">
                  Pine Script v5 Indicator Suite
                </span>
                <h1 className="syne font-bold text-3xl lg:text-[38px] text-text-primary uppercase tracking-tight leading-[1]">
                  <EditableElement section="tools" path={['hero', 'heading']} content={tools.hero.heading} />
                </h1>
                <p className="text-[13px] text-text-secondary max-w-md leading-relaxed mt-4">
                  <EditableElement section="tools" path={['hero', 'description']} content={tools.hero.description} />
                </p>
              </div>

              {/* Admin controls */}
              <div className="flex items-center gap-3 pt-2">
                {isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => { setEditingIndicator(null); setIsModalOpen(true); }}
                    className="flex items-center gap-1.5 font-mono text-xs opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </Button>
                )}
                <button
                  onClick={fetchIndicators}
                  className="text-text-muted hover:text-text-primary transition-colors opacity-30 hover:opacity-100"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-5 h-5 border-2 border-border border-t-text-muted rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Loading</p>
              </div>
            ) : indicators.length === 0 ? (
              <div className="text-center py-24 border-t border-border">
                <p className="text-text-muted font-mono uppercase tracking-widest text-xs">
                  <EditableElement section="tools" path={['noResults']} content={tools.noResults} />
                </p>
              </div>
            ) : (
              /* 2-Column: Category Nav + Indicator List */
              <div className="tools-split">
                {/* LEFT: Category navigation */}
                <ToolsSidebar
                  items={categoryItems}
                  activeId={activeCategory}
                  onSelect={setActiveCategory}
                  ariaLabel="Tool categories"
                />

                {/* RIGHT: Indicator rows */}
                <div className="tools-main">
                  <div className="border-t border-border">
                    {filteredIndicators.map((ind, i) => {
                      const number = String(i + 1).padStart(2, '0');
                      const accessLabel = getAccessLabel(ind);
                      
                      let previewImage = '';
                      if (ind.screenshots) {
                        if (typeof ind.screenshots === 'string') {
                          try {
                            const parsed = JSON.parse(ind.screenshots);
                            if (Array.isArray(parsed) && parsed.length > 0) previewImage = parsed[0].url;
                          } catch { /* ignore */ }
                        } else if (Array.isArray(ind.screenshots) && ind.screenshots.length > 0) {
                          previewImage = ind.screenshots[0].url;
                        }
                      }

                      return (
                        <ScrollReveal key={ind.id} delay={i * 0.05}>
                          <motion.div
                            className="tool-row group relative -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl border border-transparent hover:border-border/50 hover:bg-bg-secondary/40"
                            onClick={() => handleSelectIndicator(ind)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98, opacity: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          >
                            <div className="tool-row-left">
                              <div className="tool-row-number opacity-50 group-hover:opacity-100 transition-opacity">{number}</div>
                              <div className="tool-row-name syne text-text-primary group-hover:text-accent transition-colors">{ind.name}</div>
                              <div className="tool-row-desc text-text-secondary group-hover:text-text-primary/90 transition-colors">{ind.description}</div>
                              <div className="tool-row-meta mt-4 text-[10px] font-mono tracking-widest text-text-muted/70 group-hover:text-text-muted transition-colors">{accessLabel}</div>

                              {/* Admin inline controls */}
                              {isAdmin && (
                                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setEditingIndicator(ind); setIsModalOpen(true); }}
                                    className="p-1.5 text-text-muted hover:text-accent bg-bg-secondary hover:bg-bg-tertiary rounded transition-colors"
                                    title="Edit"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteIndicator(ind.id); }}
                                    className="p-1.5 text-text-muted hover:text-rose-500 bg-bg-secondary hover:bg-bg-tertiary rounded transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                              {previewImage && (
                                <div className="tool-row-image-container hidden sm:block">
                                  <div className="tool-row-image-wrapper border border-border/40 shadow-xl group-hover:border-accent/40 group-hover:shadow-[0_10px_40px_-10px_rgba(251,225,120,0.15)] transition-all duration-500">
                                    <img src={previewImage} alt={ind.name} className="tool-row-image" loading="lazy" />
                                  </div>
                                </div>
                              )}
                              <div className="w-8 h-8 shrink-0 rounded-full border border-border/50 flex items-center justify-center text-text-muted group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300 shadow-sm group-hover:shadow-[0_0_15px_rgba(251,225,120,0.2)]">
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </motion.div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* LEVEL 2: Indicator Documentation                      */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {selectedIndicator && (
          <>
            {/* Back */}
            <button onClick={handleBackToIndex} className="tools-back mb-8">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Tools</span>
            </button>

            {/* Indicator header */}
            <div className="tools-doc-header">
              <div className="flex items-start justify-between">
                <div>
                  <div className="tools-doc-header-meta">
                    {parseCategories(selectedIndicator.category).slice(0, 3).join(' · ')}
                  </div>
                  <h1 className="tools-doc-header-name syne">{selectedIndicator.name}</h1>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 pt-1 opacity-30 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingIndicator(selectedIndicator); setIsModalOpen(true); }}
                      className="p-1.5 text-text-muted hover:text-accent transition-colors"
                      title="Edit indicator"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 2-Column: Section Nav + Content */}
            <div className="tools-split">
              <ToolsSidebar
                items={docSections}
                activeId={activeSection}
                onSelect={setActiveSection}
                ariaLabel="Documentation sections"
              />

              <div className="tools-main">
                <ToolDocContent
                  indicator={selectedIndicator}
                  sectionId={activeSection}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Admin Modal */}
      <IndicatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIndicator}
        initialData={editingIndicator}
      />
    </div>
  );
}
