"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Save,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
  DollarSign,
  HelpCircle,
  BookOpen,
  Sliders,
  Wrench,
  Plus,
  Trash2,
  Pencil,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  LineChart,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import IndicatorModal from "@/components/tools/IndicatorModal";
import { IndicatorData } from "@/components/tools/IndicatorCard";
import IdeaManager from "@/components/admin/IdeaManager";

// ─── Visual Field Renderers ───────────────────────────────────

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <label className="text-xs font-bold text-text-primary capitalize">
        {label.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
      </label>
      {hint && <p className="text-[10px] text-text-muted mt-0.5">{hint}</p>}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  hint,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <div className="mb-4">
      <FieldLabel label={label} hint={hint} />
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <FieldLabel label={label} hint={hint} />
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}

function BoolInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <FieldLabel label={label} />
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? "bg-accent" : "bg-bg-primary border border-border"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
            value ? "translate-x-5 bg-bg-primary" : "translate-x-0 bg-text-muted"
          }`}
        />
      </button>
    </div>
  );
}

function FieldGroup({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-5 border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-bg-secondary/60 hover:bg-bg-secondary text-left transition-colors"
      >
        {icon}
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex-1">
          {title}
        </span>
        {open ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {open && <div className="p-4 bg-bg-secondary/20">{children}</div>}
    </div>
  );
}

function AutoFields({
  data,
  path,
  onChange,
  depth = 0,
}: {
  data: any;
  path: string;
  onChange: (path: string, value: any) => void;
  depth?: number;
}) {
  if (data === null || data === undefined) return null;

  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="relative border border-border/40 rounded-xl p-3 bg-bg-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
                Item {idx + 1}
              </span>
              <button
                onClick={() => {
                  const newArr = [...data];
                  newArr.splice(idx, 1);
                  onChange(path, newArr);
                }}
                className="p-1 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-500 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {typeof item === "object" && item !== null ? (
              <AutoFields data={item} path={`${path}.${idx}`} onChange={onChange} depth={depth + 1} />
            ) : (
              <TextInput
                label={`Value`}
                value={String(item)}
                onChange={(v) => onChange(`${path}.${idx}`, v)}
              />
            )}
          </div>
        ))}
        <button
          onClick={() => {
            const template =
              data.length > 0 && typeof data[0] === "object"
                ? Object.fromEntries(Object.keys(data[0]).map((k) => [k, ""]))
                : "";
            onChange(path, [...data, template]);
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent/10 text-accent text-xs font-bold hover:bg-accent/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add New Item
        </button>
      </div>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data);
    return (
      <div className="space-y-1">
        {entries.map(([key, value]) => {
          const fieldPath = path ? `${path}.${key}` : key;
          const friendlyLabel = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ");

          if (typeof value === "boolean") {
            return (
              <BoolInput
                key={fieldPath}
                label={friendlyLabel}
                value={value}
                onChange={(v) => onChange(fieldPath, v)}
              />
            );
          }

          if (typeof value === "number") {
            return (
              <NumberInput
                key={fieldPath}
                label={friendlyLabel}
                value={value}
                onChange={(v) => onChange(fieldPath, v)}
              />
            );
          }

          if (typeof value === "string") {
            const isUrl =
              value.startsWith("http") || value.startsWith("/") || key.toLowerCase().includes("href") || key.toLowerCase().includes("url") || key.toLowerCase().includes("image");
            const isLong = value.length > 80;
            return (
              <TextInput
                key={fieldPath}
                label={friendlyLabel}
                value={value}
                onChange={(v) => onChange(fieldPath, v)}
                hint={isUrl ? "🔗 URL or path" : undefined}
                multiline={isLong}
              />
            );
          }

          if (Array.isArray(value) || typeof value === "object") {
            return (
              <FieldGroup
                key={fieldPath}
                title={friendlyLabel}
                icon={
                  Array.isArray(value) ? (
                    <GripVertical className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-accent" />
                  )
                }
                defaultOpen={depth < 1}
              >
                <AutoFields data={value} path={fieldPath} onChange={onChange} depth={depth + 1} />
              </FieldGroup>
            );
          }

          return null;
        })}
      </div>
    );
  }

  return null;
}

// ─── Main Page ────────────────────────────────────────────────

export default function AdminContentPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();

  const sections = [
    { key: "hero", label: "Hero Section", icon: Sparkles, desc: "Main homepage headline, tagline, buttons" },
    { key: "ideas", label: "Market Analysis / Ideas", icon: LineChart, desc: "Publish new TradingView ideas, charts & analysis" },
    { key: "ichimoku", label: "Ichimoku Page", icon: Layers, desc: "Education content & component descriptions" },
    { key: "pricing", label: "Pricing Tiers", icon: DollarSign, desc: "Plan names, prices, features" },
    { key: "faq", label: "FAQ Section", icon: HelpCircle, desc: "Questions, answers, categories" },
    { key: "resources", label: "Resources Hub", icon: BookOpen, desc: "Education page & YouTube links" },
    { key: "indicators", label: "Indicators & Tools", icon: Sliders, desc: "Manage live indicators, add & remove scripts" },
    { key: "tools", label: "Tools Suite Page", icon: Wrench, desc: "Tools page headlines & layout settings" },
  ];

  const [activeSection, setActiveSection] = useState("hero");
  const [contentData, setContentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Indicators / Tools Database Items
  const [dbIndicators, setDbIndicators] = useState<IndicatorData[]>([]);
  const [loadingDbTools, setLoadingDbTools] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IndicatorData | null>(null);

  const fetchDbIndicators = useCallback(async () => {
    setLoadingDbTools(true);
    try {
      const res = await fetch("/api/indicators");
      if (res.ok) {
        const data = await res.json();
        setDbIndicators(data.indicators || []);
      }
    } catch (err) {
      console.error("Failed fetching indicators:", err);
    } finally {
      setLoadingDbTools(false);
    }
  }, []);

  const fetchSectionData = useCallback(
    async (sectionKey: string) => {
      setLoading(true);
      setStatusMessage(null);
      try {
        const res = await fetch(`/api/admin/content/${sectionKey}`);
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to load section content");
        }
        const data = await res.json();
        setContentData(data);
      } catch (err: any) {
        setStatusMessage({ type: "error", text: err.message || "Error fetching section content." });
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/admin/login");
    } else if (authStatus === "authenticated") {
      fetchSectionData(activeSection);
      if (activeSection === "indicators" || activeSection === "tools") {
        fetchDbIndicators();
      }
    }
  }, [authStatus, activeSection, fetchSectionData, fetchDbIndicators, router]);

  const handleFieldChange = (path: string, value: any) => {
    setContentData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cursor = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = isNaN(Number(keys[i])) ? keys[i] : Number(keys[i]);
        if (!cursor[k]) cursor[k] = {};
        cursor = cursor[k];
      }
      const lastKey = isNaN(Number(keys[keys.length - 1]))
        ? keys[keys.length - 1]
        : Number(keys[keys.length - 1]);
      cursor[lastKey] = value;
      return newData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/content/${activeSection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData),
      });
      if (!res.ok) throw new Error("Failed to update content on server.");
      setStatusMessage({
        type: "success",
        text: `✅ ${sections.find((s) => s.key === activeSection)?.label} updated successfully!`,
      });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Error saving changes." });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveIndicatorItem = async (payload: Partial<IndicatorData>) => {
    if (payload.id) {
      const res = await fetch("/api/indicators", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update tool/indicator");
    } else {
      const res = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create tool/indicator");
    }
    await fetchDbIndicators();
  };

  const handleDeleteIndicatorItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this indicator/tool?")) return;
    try {
      const res = await fetch(`/api/indicators?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Failed to delete item");
        return;
      }
      await fetchDbIndicators();
    } catch (err: any) {
      alert(`Error deleting item: ${err.message}`);
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="pt-40 pb-24 min-h-[100svh] flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted font-mono uppercase tracking-widest">Checking admin authorization...</p>
        </div>
      </div>
    );
  }

  const activeSec = sections.find((s) => s.key === activeSection);

  return (
    <div className="pt-36 pb-24 min-h-[100svh] relative overflow-hidden">
      {/* Radial Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent font-bold tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Content Management System</span>
            </div>
            <h1 className="syne font-extrabold text-3xl lg:text-4xl text-text-primary uppercase tracking-tight">
              Edit Live Content & Tools
            </h1>
            <p className="text-text-secondary text-sm">
              Add, edit, or remove indicators, tools, text, and pricing live. No coding required.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/admin/payments")}
              className="flex items-center gap-2 font-mono text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Payments Dashboard</span>
            </Button>
          </div>
        </div>

        {/* Section Tabs & Editor Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Selector */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-xs font-mono uppercase text-text-muted font-bold tracking-widest px-2 mb-3">
              Content Sections
            </div>
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.key;
              return (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-accent text-bg-primary font-bold shadow-[0_0_15px_rgba(251,225,120,0.25)]"
                      : "bg-bg-secondary/40 hover:bg-bg-secondary text-text-secondary border border-border/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div>
                    <div className="text-xs font-bold">{sec.label}</div>
                    {!isActive && (
                      <div className="text-[10px] text-text-muted mt-0.5">{sec.desc}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual Editor */}
          <div className="lg:col-span-3 space-y-6">
            {/* Dedicated Ideas & Market Analysis Manager when ideas tab selected */}
            {activeSection === "ideas" ? (
              <IdeaManager />
            ) : (
              <>
            {/* Dedicated Tools & Indicators Manager Block when indicators or tools tab selected */}
            {(activeSection === "indicators" || activeSection === "tools") && (
              <Card className="p-6 bg-bg-secondary/60 border-accent/30 shadow-[0_0_20px_rgba(251,225,120,0.05)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-wider mb-1">
                      <Sliders className="w-4 h-4" />
                      <span>Live Tools & Indicators Database</span>
                    </div>
                    <h3 className="syne font-bold text-lg text-text-primary uppercase">
                      Manage Live Tools & Pine Scripts ({dbIndicators.length} Total)
                    </h3>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingItem(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 font-mono text-xs shadow-[0_0_15px_rgba(251,225,120,0.3)]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Tool / Indicator</span>
                  </Button>
                </div>

                {loadingDbTools ? (
                  <div className="py-8 text-center space-y-2">
                    <div className="w-6 h-6 border-3 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-text-muted font-mono">Loading tools database...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {dbIndicators.map((ind) => (
                      <div
                        key={ind.id}
                        className="bg-bg-primary border border-border/80 rounded-xl p-3.5 flex flex-col justify-between gap-2 hover:border-accent/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 text-accent">
                              {ind.accessStatus || "Premium"}
                            </span>
                            <span className="text-[10px] font-mono text-text-muted">
                              {ind.priceLabel || "$22/mo"}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-text-primary mt-1 line-clamp-1">{ind.name}</h4>
                          <p className="text-[11px] text-text-secondary line-clamp-2 mt-0.5">{ind.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-mono">
                          <span className="text-text-muted truncate max-w-[140px]">
                            {ind.tvUrl ? "🔗 TradingView Script" : "No TV URL"}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingItem(ind);
                                setIsModalOpen(true);
                              }}
                              className="px-2 py-1 bg-bg-secondary hover:bg-bg-tertiary rounded text-text-primary flex items-center gap-1 transition-colors"
                              title="Edit item"
                            >
                              <Pencil className="w-3 h-3 text-accent" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteIndicatorItem(ind.id)}
                              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded flex items-center gap-1 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Standard Visual Section Editor */}
            <Card className="p-6 bg-bg-secondary/40 border-border/80">
              {/* Editor Header */}
              <div className="flex items-center justify-between mb-5 border-b border-border pb-4">
                <div>
                  <h3 className="syne font-bold text-lg text-text-primary uppercase">
                    {activeSec?.label} Content
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {activeSec?.desc} — Changes go live instantly after saving.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchSectionData(activeSection)}
                    className="flex items-center gap-1.5 text-xs font-mono"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>Reset</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex items-center gap-1.5 text-xs font-mono"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save & Publish</span>
                  </Button>
                </div>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs mb-5 flex items-center gap-2 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border border-red-500/30 text-red-400"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* Fields */}
              {loading ? (
                <div className="py-24 text-center space-y-3">
                  <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-text-muted font-mono uppercase">Loading content...</p>
                </div>
              ) : contentData ? (
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  <AutoFields data={contentData} path="" onChange={handleFieldChange} />
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-text-muted text-sm">No content loaded. Select a section from the left.</p>
                </div>
              )}
            </Card>
            </>
            )}
          </div>
        </div>
      </div>

      {/* Indicator Add/Edit Modal */}
      <IndicatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveIndicatorItem}
        initialData={editingItem}
      />
    </div>
  );
}
