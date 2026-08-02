'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import FilterBar from '@/components/tools/FilterBar';
import IndicatorCard, { IndicatorData } from '@/components/tools/IndicatorCard';
import IndicatorModal from '@/components/tools/IndicatorModal';
import EditableElement from '@/components/admin/EditableElement';
import { useContent } from '@/hooks/useContent';
import { Lock, ShieldCheck, RefreshCw, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ToolsPage() {
  const tools = useContent('tools');
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const [indicators, setIndicators] = useState<IndicatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [accessProfile, setAccessProfile] = useState<any>({ canAccessPremium: false });

  // Admin Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<IndicatorData | null>(null);

  const fetchIndicators = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/indicators");
      if (res.ok) {
        const data = await res.json();
        setIndicators(data.indicators || []);
      }
    } catch (err) {
      console.error("Failed to fetch indicators:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();
  }, []);

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === 'ADMIN') {
        setAccessProfile({ canAccessPremium: true, accessLevel: 'Admin' });
      } else {
        fetch('/api/user/profile')
          .then((r) => r.json())
          .then((data) => {
            if (data.user?.subscriptions?.some((s: any) => s.status === 'ACTIVE')) {
              setAccessProfile({ canAccessPremium: true, accessLevel: 'Active Subscriber' });
            }
          })
          .catch(() => {});
      }
    }
  }, [session]);

  const handleSaveIndicator = async (payload: Partial<IndicatorData>) => {
    if (payload.id) {
      // PATCH update
      const res = await fetch("/api/indicators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to update indicator");
      }
    } else {
      // POST create
      const res = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create indicator");
      }
    }
    await fetchIndicators();
  };

  const handleDeleteIndicator = async (id: string) => {
    if (!confirm("Are you sure you want to delete this indicator/tool?")) return;
    try {
      const res = await fetch(`/api/indicators?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Failed to delete indicator");
        return;
      }
      await fetchIndicators();
    } catch (err: any) {
      alert(`Error deleting indicator: ${err.message}`);
    }
  };

  const filteredIndicators = indicators.filter((ind) => {
    if (activeFilter === "All") return true;

    const catList = typeof ind.category === "string"
      ? (() => { try { return JSON.parse(ind.category); } catch { return [ind.category]; } })()
      : ind.category || [];

    const matchesCategory = catList.some((c: string) => c.toLowerCase().includes(activeFilter.toLowerCase()));
    const matchesStatus = ind.accessStatus?.toLowerCase() === activeFilter.toLowerCase();

    return matchesCategory || matchesStatus;
  });

  return (
    <div className="pt-40 pb-24 relative overflow-hidden min-h-[100svh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-accent font-bold tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Pine Script v5 Indicator Suite</span>
              </span>

              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingIndicator(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 font-mono text-xs shadow-[0_0_15px_rgba(251,225,120,0.3)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Tool / Indicator</span>
                  </Button>
                )}

                <button
                  onClick={fetchIndicators}
                  className="text-xs font-mono text-text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Tools</span>
                </button>
              </div>
            </div>

            <h1 className="syne font-extrabold text-4xl lg:text-[56px] text-text-primary mb-6 uppercase tracking-tight leading-[0.9]" style={{ wordSpacing: '0.2em' }}>
              <EditableElement section="tools" path={['hero', 'heading']} content={tools.hero.heading} />
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl leading-relaxed">
              <EditableElement section="tools" path={['hero', 'description']} content={tools.hero.description} />
            </p>
          </div>
        </ScrollReveal>

        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-text-muted font-mono uppercase">Loading indicators...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIndicators.map((ind, i) => {
              const isUnlocked = ind.accessStatus === 'Free' || accessProfile.canAccessPremium || isAdmin;

              return (
                <ScrollReveal key={ind.id} delay={i * 0.05}>
                  <IndicatorCard 
                    indicator={ind} 
                    isAdmin={isAdmin}
                    isUnlocked={isUnlocked}
                    onEdit={(item) => {
                      setEditingIndicator(item);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteIndicator}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {filteredIndicators.length === 0 && !loading && (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="text-text-muted font-mono uppercase tracking-widest">
              <EditableElement section="tools" path={['noResults']} content={tools.noResults} />
            </p>
          </div>
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      <IndicatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIndicator}
        initialData={editingIndicator}
      />
    </div>
  );
}
