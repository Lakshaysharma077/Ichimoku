"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Bookmark,
  Calendar,
  Layers,
  FileText,
  Link as LinkIcon,
  Eye,
} from "lucide-react";
import Button from "@/components/ui/Button";

export interface IdeaItem {
  id?: string;
  slug?: string;
  ticker?: string;
  timeframe?: string;
  company?: string;
  title: string;
  date?: string;
  image: string;
  url?: string;
  editorPick?: boolean;
  wordCount?: number;
  content?: string;
  status?: string;
}

interface IdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Partial<IdeaItem>) => Promise<void>;
  initialData?: IdeaItem | null;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function IdeaModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: IdeaModalProps) {
  const [formData, setFormData] = useState<Partial<IdeaItem>>({
    title: "",
    image: "",
    url: "",
    ticker: "",
    timeframe: "1D",
    company: "",
    date: new Date().toISOString().split("T")[0],
    editorPick: false,
    slug: "",
    content: "",
    status: "published",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'content'>('details');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        title: initialData.title || "",
        image: initialData.image || "",
        url: initialData.url || "",
        ticker: initialData.ticker || "",
        timeframe: initialData.timeframe || "1D",
        company: initialData.company || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        editorPick: Boolean(initialData.editorPick),
        wordCount: initialData.wordCount,
        slug: initialData.slug || "",
        content: initialData.content || "",
        status: initialData.status || "published",
      });
    } else {
      setFormData({
        title: "",
        image: "",
        url: "",
        ticker: "",
        timeframe: "1D",
        company: "",
        date: new Date().toISOString().split("T")[0],
        editorPick: false,
        slug: "",
        content: "",
        status: "published",
      });
    }
    setUploadError(null);
    setSaveError(null);
    setActiveTab('details');
  }, [initialData, isOpen]);

  // Auto-generate slug from title if slug is empty
  useEffect(() => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title || ""),
      }));
    }
  }, [formData.title, formData.slug]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const result = await res.json();
      if (result.url) {
        setFormData((prev) => ({
          ...prev,
          image: result.url,
        }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setSaveError("Please enter an Idea Title");
      return;
    }
    if (!formData.image?.trim()) {
      setSaveError("Please upload a chart screenshot or provide an image URL");
      return;
    }

    // Ensure slug is set
    if (!formData.slug?.trim()) {
      formData.slug = generateSlug(formData.title || "");
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setSaveError(err.message || "Failed to save idea");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg-primary/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                {initialData?.id ? "Edit Market Analysis Idea" : "Add New Market Analysis Idea"}
              </h2>
              <p className="text-xs text-text-muted">
                Upload a chart screenshot, title, and optional TradingView link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border bg-bg-primary/30">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'details'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Details & Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'content'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Article Content
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {saveError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* ═══ DETAILS TAB ═══ */}
          {activeTab === 'details' && (
            <>
              {/* 1. Screenshot Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                  Chart Screenshot / Image <span className="text-red-400">*</span>
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center ${
                    formData.image
                      ? "border-accent/40 bg-bg-primary/40"
                      : "border-border hover:border-accent/40 bg-bg-primary/20"
                  }`}
                >
                  {formData.image ? (
                    <div className="relative group rounded-xl overflow-hidden aspect-video max-h-56 mx-auto bg-bg-primary">
                      <img
                        src={formData.image}
                        alt="Chart preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-accent text-bg-primary text-xs font-bold hover:brightness-110 transition-all"
                        >
                          Replace Screenshot
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs font-bold hover:bg-red-500 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-1">
                        {isUploading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6" />
                        )}
                      </div>
                      <p className="text-sm font-semibold text-text-primary">
                        Drag and drop chart screenshot here, or{" "}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-accent hover:underline"
                        >
                          browse files
                        </button>
                      </p>
                      <p className="text-xs text-text-muted">Supports PNG, JPEG, WebP up to 10MB</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {uploadError && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {uploadError}
                  </p>
                )}

                {/* Direct Image URL input fallback */}
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Or paste an image URL (e.g. https://s3.tradingview.com/...)"
                    value={formData.image || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-bg-primary/60 border border-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* 2. Idea Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5">
                  Idea Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bitcoin Bulls Face a Major Test at $79K"
                  value={formData.title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      title: newTitle,
                      // Auto-update slug only if slug was auto-generated or empty
                      slug: prev.slug && prev.slug !== generateSlug(prev.title || '') ? prev.slug : generateSlug(newTitle),
                    }));
                  }}
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-medium"
                />
              </div>

              {/* 2b. URL Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>URL Slug</span>
                  <span className="text-[10px] text-text-muted font-normal lowercase">(auto-generated from title)</span>
                </label>
                <div className="flex items-center gap-0">
                  <span className="bg-bg-tertiary border border-border border-r-0 rounded-l-xl px-3 py-2 text-xs text-text-muted font-mono select-none">
                    /ideas/
                  </span>
                  <input
                    type="text"
                    placeholder="article-url-slug"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                    className="flex-1 bg-bg-primary border border-border rounded-r-xl px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* 3. TradingView Link (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5 flex items-center gap-1.5">
                  <span>TradingView URL</span>
                  <span className="text-[10px] text-text-muted font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.tradingview.com/chart/BTCUSD/..."
                  value={formData.url || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono text-xs"
                />
              </div>

              {/* 4. Ticker, Timeframe, & Company (Optional Meta) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary mb-1">
                    Ticker Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BTCUSD"
                    value={formData.ticker || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ticker: e.target.value.toUpperCase() }))}
                    className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary mb-1">
                    Timeframe
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1W, 1D, 4h"
                    value={formData.timeframe || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, timeframe: e.target.value }))}
                    className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={formData.date || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* 5. Company / Description (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary mb-1">
                  Company / Market Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bitcoin / U.S. Dollar"
                  value={formData.company || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                />
              </div>

              {/* 6. Status & Editor's Pick */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Publication Status */}
                <div className="p-3.5 bg-bg-primary/40 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Status</p>
                      <p className="text-[10px] text-text-muted">Publish or save as draft</p>
                    </div>
                  </div>
                  <select
                    value={formData.status || "published"}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="bg-bg-primary border border-border rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Editor's Pick Toggle */}
                <div className="p-3.5 bg-bg-primary/40 border border-border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2962FF]/10 text-[#2962FF] flex items-center justify-center">
                      <Bookmark className="w-4 h-4 fill-[#2962FF]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary">Editor&apos;s Pick</p>
                      <p className="text-[10px] text-text-muted">TV ribbon badge</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.editorPick)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, editorPick: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2962FF]" />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* ═══ CONTENT TAB ═══ */}
          {activeTab === 'content' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Article Body</span>
                  <span className="text-[10px] text-text-muted font-normal lowercase ml-1">(HTML supported)</span>
                </label>
                <p className="text-[11px] text-text-muted mb-3">
                  Paste the full article content here. Supports HTML: headings (&lt;h2&gt;, &lt;h3&gt;), paragraphs (&lt;p&gt;), lists (&lt;ul&gt;, &lt;ol&gt;), blockquotes, images (&lt;img&gt;), bold (&lt;strong&gt;), italic (&lt;em&gt;), and links (&lt;a&gt;).
                </p>
                <textarea
                  placeholder="<h2>Market Overview</h2>&#10;<p>This analysis focuses on...</p>"
                  value={formData.content || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={16}
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent font-mono text-xs leading-relaxed resize-y min-h-[300px]"
                />
                {formData.content && (
                  <p className="text-[10px] text-text-muted mt-1.5 font-mono">
                    {formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
                  </p>
                )}
              </div>

              {/* Content Preview */}
              {formData.content && formData.content.trim() && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                    Preview
                  </label>
                  <div className="bg-bg-primary border border-border rounded-xl p-5 max-h-[300px] overflow-y-auto">
                    <div
                      className="article-body"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isSaving || isUploading}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{initialData?.id ? "Update Idea" : "Publish Idea"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
