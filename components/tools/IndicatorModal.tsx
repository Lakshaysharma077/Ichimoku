"use client";

import { useState, useEffect } from "react";
import { X, Save, Plus, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { IndicatorData } from "./IndicatorCard";

interface IndicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<IndicatorData>) => Promise<void>;
  initialData?: IndicatorData | null;
  title?: string;
}

export default function IndicatorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Add New Indicator / Tool",
}: IndicatorModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accessStatus, setAccessStatus] = useState("Premium");
  const [priceLabel, setPriceLabel] = useState("$29/mo");
  const [tvUrl, setTvUrl] = useState("");
  const [category, setCategory] = useState("ICHIMOKU, TREND");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setAccessStatus(initialData.accessStatus || "Premium");
      setPriceLabel(initialData.priceLabel || "$29/mo");
      setTvUrl(initialData.tvUrl || "");
      const catVal = typeof initialData.category === "string"
        ? (() => { try { return JSON.parse(initialData.category).join(", "); } catch { return initialData.category; } })()
        : (initialData.category || []).join(", ");
      setCategory(catVal);
      setSortOrder((initialData as any).sortOrder || 0);
    } else {
      setName("");
      setDescription("");
      setAccessStatus("Premium");
      setPriceLabel("$29/mo");
      setTvUrl("");
      setCategory("ICHIMOKU, TREND");
      setSortOrder(0);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const catArray = category
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);

      await onSave({
        id: initialData?.id,
        name: name.trim(),
        description: description.trim(),
        accessStatus,
        priceLabel: priceLabel.trim(),
        tvUrl: tvUrl.trim(),
        category: catArray,
        ...(sortOrder ? { sortOrder } : {}),
      } as any);

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save indicator");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-[#0F172A] border border-border rounded-2xl p-6 relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="syne font-bold text-lg text-text-primary uppercase tracking-tight">
            {initialData ? "Edit Tool / Indicator" : title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary bg-bg-primary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-text-primary mb-1">Tool / Indicator Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ichimoku Edge Pro Scanner"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-text-primary mb-1">Access Status</label>
              <select
                value={accessStatus}
                onChange={(e) => setAccessStatus(e.target.value)}
                className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="Free">Free</option>
                <option value="Premium">Premium</option>
                <option value="Beta">Beta (Trial)</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Price Tag</label>
              <input
                type="text"
                value={priceLabel}
                onChange={(e) => setPriceLabel(e.target.value)}
                placeholder="e.g. Free Access or $29/mo"
                className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1">Categories (Comma separated)</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ICHIMOKU, TREND, SCALPING"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1">TradingView Script Link (URL)</label>
            <input
              type="url"
              value={tvUrl}
              onChange={(e) => setTvUrl(e.target.value)}
              placeholder="https://www.tradingview.com/script/..."
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text-primary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Enter detailed description of what this indicator or tool does..."
              className="w-full bg-bg-primary border border-border rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary rounded-xl font-bold font-mono transition-all"
            >
              Cancel
            </button>
            <Button size="sm" type="submit" disabled={saving} className="flex items-center gap-1.5">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{initialData ? "Save Changes" : "Add Tool / Indicator"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
