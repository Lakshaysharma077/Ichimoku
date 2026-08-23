"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Plus, Loader2, Upload, Trash2, Image as ImageIcon, Sparkles, Layers, BookOpen, HelpCircle } from "lucide-react";
import Button from "../ui/Button";
import { IndicatorData } from "./IndicatorCard";

interface ScreenshotItem {
  url: string;
  title?: string;
  caption?: string;
}

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
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [overview, setOverview] = useState("");
  const [howItWorks, setHowItWorks] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [accessStatus, setAccessStatus] = useState("Premium");
  const [priceLabel, setPriceLabel] = useState("$22/mo");
  const [tvUrl, setTvUrl] = useState("");
  const [category, setCategory] = useState("ICHIMOKU, TREND");
  const [status, setStatus] = useState("Published");
  const [sortOrder, setSortOrder] = useState(0);

  const [activeTab, setActiveTab] = useState<"general" | "docs" | "media">("general");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setDescription(initialData.description || "");
      setThumbnail(initialData.thumbnail || "");
      
      // Parse screenshots
      if (typeof initialData.screenshots === "string") {
        try {
          const parsed = JSON.parse(initialData.screenshots);
          setScreenshots(Array.isArray(parsed) ? parsed : [{ url: initialData.screenshots }]);
        } catch {
          setScreenshots(initialData.screenshots ? [{ url: initialData.screenshots }] : []);
        }
      } else if (Array.isArray(initialData.screenshots)) {
        setScreenshots(initialData.screenshots);
      } else {
        setScreenshots([]);
      }

      setOverview(initialData.overview || "");
      setHowItWorks(initialData.howItWorks || "");

      // Parse features
      if (typeof initialData.features === "string") {
        try {
          const parsed = JSON.parse(initialData.features);
          setFeatures(Array.isArray(parsed) ? parsed : [initialData.features]);
        } catch {
          setFeatures(initialData.features ? initialData.features.split("\n").filter(Boolean) : []);
        }
      } else if (Array.isArray(initialData.features)) {
        setFeatures(initialData.features);
      } else {
        setFeatures([]);
      }

      setHowToUse(initialData.howToUse || "");
      setAccessStatus(initialData.accessStatus || "Premium");
      setPriceLabel(initialData.priceLabel || "$22/mo");
      setTvUrl(initialData.tvUrl || "");
      setStatus(initialData.status || "Published");

      const catVal = typeof initialData.category === "string"
        ? (() => { try { return JSON.parse(initialData.category).join(", "); } catch { return initialData.category; } })()
        : (initialData.category || []).join(", ");
      setCategory(catVal);
      setSortOrder((initialData as any).sortOrder || 0);
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setThumbnail("");
      setScreenshots([]);
      setOverview("");
      setHowItWorks("");
      setFeatures([]);
      setHowToUse("");
      setAccessStatus("Premium");
      setPriceLabel("$22/mo");
      setTvUrl("");
      setStatus("Published");
      setCategory("ICHIMOKU, TREND");
      setSortOrder(0);
    }
    setActiveTab("general");
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Handle Thumbnail File Upload
  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to upload image");
      }
      const data = await res.json();
      setThumbnail(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload thumbnail");
    } finally {
      setUploading(false);
    }
  };

  // Handle Screenshot Upload
  const handleUploadScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const newShots: ScreenshotItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          newShots.push({
            url: data.url,
            title: files[i].name.replace(/\.[^/.]+$/, ""),
            caption: "High-resolution chart snapshot",
          });
        }
      }
      setScreenshots((prev) => [...prev, ...newShots]);
    } catch (err: any) {
      setError(err.message || "Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures((prev) => [...prev, featureInput.trim()]);
    setFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddManualScreenshot = () => {
    setScreenshots((prev) => [
      ...prev,
      { url: "", title: "New Chart Screenshot", caption: "" },
    ]);
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateScreenshot = (index: number, field: keyof ScreenshotItem, value: string) => {
    setScreenshots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

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

      const generatedSlug =
        slug.trim() ||
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      await onSave({
        id: initialData?.id,
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        thumbnail: thumbnail.trim() || undefined,
        screenshots: screenshots.filter((s) => s.url.trim().length > 0),
        overview: overview.trim() || undefined,
        howItWorks: howItWorks.trim() || undefined,
        features: features.filter(Boolean),
        howToUse: howToUse.trim() || undefined,
        accessStatus,
        priceLabel: priceLabel.trim(),
        tvUrl: tvUrl.trim(),
        category: catArray,
        status,
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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#0F172A] border border-border rounded-2xl p-6 relative flex flex-col max-h-[92vh] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div>
            <h3 className="syne font-bold text-lg text-text-primary uppercase tracking-tight">
              {initialData ? "Edit Indicator / Documentation" : title}
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Changes reflect immediately on the Tools page and dedicated detail page.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary bg-bg-primary rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "general"
                ? "bg-accent text-bg-primary font-bold"
                : "text-text-secondary hover:text-text-primary bg-bg-primary/40"
            }`}
          >
            1. General & Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("docs")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "docs"
                ? "bg-accent text-bg-primary font-bold"
                : "text-text-secondary hover:text-text-primary bg-bg-primary/40"
            }`}
          >
            2. Documentation Content
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "media"
                ? "bg-accent text-bg-primary font-bold"
                : "text-text-secondary hover:text-text-primary bg-bg-primary/40"
            }`}
          >
            3. Screenshots & Media ({screenshots.length})
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {/* TAB 1: General Info */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-text-primary mb-1">Indicator / Tool Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ichimoku Kinkō Hyō - (一目均衡表)"
                  className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">URL Slug (e.g. /tools/slug)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="ichimoku-kinko-hyo"
                    className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft (Hidden from Public)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">Access Level</label>
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
                  <label className="block font-bold text-text-primary mb-1">Price Tag Display</label>
                  <input
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="e.g. Free Access or $22/mo"
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
                  placeholder="ICHIMOKU, CORE, EQUILIBRIUM, PINE SCRIPT V5"
                  className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">TradingView Script Link (URL)</label>
                <input
                  type="url"
                  value={tvUrl}
                  onChange={(e) => setTvUrl(e.target.value)}
                  placeholder="https://www.tradingview.com/script/4EpIOEMu-Ichimoku-Kinko-Hyo/"
                  className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1">Short Description (Card Summary)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Enter high-level summary of the indicator..."
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Documentation Content */}
          {activeTab === "docs" && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-text-primary mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-accent" />
                  <span>Overview & Indicator Purpose (Markdown)</span>
                </label>
                <textarea
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  rows={4}
                  placeholder="Detailed overview of the indicator philosophy, Hosoda equilibrium background, etc."
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-accent" />
                  <span>How It Works & Calculation Breakdown (Markdown)</span>
                </label>
                <textarea
                  value={howItWorks}
                  onChange={(e) => setHowItWorks(e.target.value)}
                  rows={5}
                  placeholder="Explain Tenkan, Kijun, Cloud, Flat Levels, Confluence calculations..."
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent font-mono text-xs"
                />
              </div>

              {/* Key Features List */}
              <div className="space-y-2">
                <label className="block font-bold text-text-primary mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Key Features ({features.length})</span>
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a new feature bullet point..."
                    className="flex-1 bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-xl font-bold font-mono transition-colors"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-bg-primary border border-border/50 text-xs"
                    >
                      <span className="text-text-secondary truncate max-w-[85%]">{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-text-primary mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-accent" />
                  <span>How To Use Guide & Steps (Markdown)</span>
                </label>
                <textarea
                  value={howToUse}
                  onChange={(e) => setHowToUse(e.target.value)}
                  rows={4}
                  placeholder="Step 1, Step 2, Trading strategy tips on TradingView..."
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Media & Screenshots */}
          {activeTab === "media" && (
            <div className="space-y-5">
              {/* Thumbnail Setting */}
              <div className="p-3.5 rounded-xl border border-border/80 bg-bg-primary/50 space-y-2">
                <label className="block font-bold text-text-primary">Card Thumbnail Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="/ichimokuedgeth.png or image URL"
                    className="flex-1 bg-bg-primary border border-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-accent"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadThumbnail}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 bg-bg-secondary hover:bg-bg-tertiary border border-border rounded-xl text-text-primary flex items-center gap-1.5 font-mono"
                  >
                    <Upload className="w-3.5 h-3.5 text-accent" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Screenshots List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-text-primary flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-accent" />
                    <span>Full-Size Chart Screenshots ({screenshots.length})</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={screenshotInputRef}
                      onChange={handleUploadScreenshot}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => screenshotInputRef.current?.click()}
                      disabled={uploading}
                      className="px-2.5 py-1 bg-accent/15 hover:bg-accent/25 text-accent rounded-lg font-mono text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Screenshots</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddManualScreenshot}
                      className="px-2.5 py-1 bg-bg-secondary hover:bg-bg-tertiary text-text-primary rounded-lg font-mono text-[11px] font-bold border border-border transition-colors"
                    >
                      + Add URL
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {screenshots.map((shot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-border/70 bg-bg-primary/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-text-muted">
                          Screenshot #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="text-red-400 hover:text-red-500 p-1"
                          title="Remove screenshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={shot.url}
                          onChange={(e) => handleUpdateScreenshot(idx, "url", e.target.value)}
                          placeholder="Image URL or /path.png"
                          className="w-full bg-bg-primary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-accent text-xs"
                        />
                        <input
                          type="text"
                          value={shot.title || ""}
                          onChange={(e) => handleUpdateScreenshot(idx, "title", e.target.value)}
                          placeholder="Screenshot Title (e.g. Cloud Overview)"
                          className="w-full bg-bg-primary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-accent text-xs"
                        />
                      </div>

                      <input
                        type="text"
                        value={shot.caption || ""}
                        onChange={(e) => handleUpdateScreenshot(idx, "caption", e.target.value)}
                        placeholder="Caption description shown in lightbox..."
                        className="w-full bg-bg-primary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-accent text-xs"
                      />
                    </div>
                  ))}

                  {screenshots.length === 0 && (
                    <p className="text-center py-6 text-text-muted text-xs border border-dashed border-border rounded-xl">
                      No screenshots added yet. Upload files or click &quot;+ Add URL&quot;.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
            <span className="text-[11px] font-mono text-text-muted">
              {uploading ? "Uploading media files..." : "Ready to save"}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-bg-primary hover:bg-bg-secondary text-text-secondary rounded-xl font-bold font-mono transition-all"
              >
                Cancel
              </button>
              <Button size="sm" type="submit" disabled={saving || uploading} className="flex items-center gap-1.5">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{initialData ? "Save Indicator" : "Create Indicator"}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
