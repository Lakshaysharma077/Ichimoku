"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Loader2,
  Bookmark,
  Calendar,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import IdeaModal, { IdeaItem } from "./IdeaModal";

export default function IdeaManager() {
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaItem | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(Array.isArray(data.articles) ? data.articles : []);
      }
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleSaveIdea = async (payload: Partial<IdeaItem>) => {
    if (payload.id) {
      // Update
      const res = await fetch("/api/admin/ideas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update idea");
      }

      setActionStatus({ type: "success", text: "Idea updated successfully!" });
    } else {
      // Create new
      const res = await fetch("/api/admin/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to publish idea");
      }

      setActionStatus({ type: "success", text: "New Idea published successfully!" });
    }

    await fetchIdeas();
    setTimeout(() => setActionStatus(null), 4000);
  };

  const handleDeleteIdea = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/admin/ideas?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete idea");
      }

      setActionStatus({ type: "success", text: "Idea deleted successfully!" });
      await fetchIdeas();
    } catch (err: any) {
      setActionStatus({ type: "error", text: err.message || "Failed to delete idea" });
    } finally {
      setIsDeletingId(null);
      setTimeout(() => setActionStatus(null), 4000);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      idea.title.toLowerCase().includes(q) ||
      (idea.ticker && idea.ticker.toLowerCase().includes(q)) ||
      (idea.company && idea.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-bg-secondary/60 border border-border rounded-2xl">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <span>Market Analysis Ideas</span>
            <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent font-mono text-xs">
              {ideas.length} Total
            </span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Publish new analysis with chart screenshots. Automatically displays on the live website.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => {
              setEditingIdea(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Idea</span>
          </Button>

          <button
            onClick={() => fetchIdeas()}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-bg-primary text-text-muted hover:text-text-primary hover:border-accent/40 transition-colors shrink-0"
            title="Refresh ideas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionStatus && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in duration-200 ${
            actionStatus.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{actionStatus.text}</span>
          </div>
          <button onClick={() => setActionStatus(null)} className="text-text-muted hover:text-text-primary">
            ✕
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search published ideas by title, ticker symbol, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
      </div>

      {/* Ideas Grid / List */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
          <p className="text-xs text-text-muted">Loading published ideas...</p>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-bg-primary/20">
          <Sparkles className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-text-primary">No ideas found</p>
          <p className="text-xs text-text-muted mt-1">
            {searchQuery ? "Try a different search query" : "Click 'Add New Idea' above to publish your first idea"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea, index) => (
            <div
              key={idea.id || index}
              className="group relative flex flex-col bg-bg-secondary border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all shadow-sm"
            >
              {/* Thumbnail Image with Badges */}
              <div className="relative aspect-video bg-bg-primary overflow-hidden">
                <img
                  src={idea.image}
                  alt={idea.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* TV Badge */}
                {idea.editorPick && (
                  <div className="absolute top-0 left-2.5 z-10 w-5 h-6 bg-[#2962FF] flex items-center justify-center rounded-b-[2px] shadow-sm">
                    <span className="text-white text-[9px] font-black">TV</span>
                  </div>
                )}

                {/* Latest Idea Tag on First Item */}
                {index === 0 && (
                  <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md bg-accent text-bg-primary font-bold text-[10px] uppercase tracking-wider shadow-md">
                    Latest Idea
                  </span>
                )}
              </div>

              {/* Card Details */}
              <div className="p-4 flex flex-col flex-1">
                {/* Meta Row */}
                <div className="flex items-center justify-between gap-2 text-[11px] text-text-muted font-mono mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-accent/80" />
                    <span>{idea.date}</span>
                  </span>
                  {idea.ticker && (
                    <span className="px-1.5 py-0.5 rounded bg-bg-primary border border-border text-text-secondary font-bold text-[10px]">
                      {idea.ticker} {idea.timeframe ? `• ${idea.timeframe}` : ""}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug mb-2 flex-1">
                  {idea.title}
                </h4>

                {/* Editor's Pick indicator */}
                {idea.editorPick && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#2962FF] uppercase tracking-wider mb-3">
                    <Bookmark className="w-3 h-3 fill-[#2962FF]" />
                    <span>Editor&apos;s Pick</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingIdea(idea);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-primary border border-border text-text-primary hover:border-accent/40 text-xs font-semibold transition-colors"
                      title="Edit Idea"
                    >
                      <Pencil className="w-3 h-3 text-accent" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => idea.id && handleDeleteIdea(idea.id, idea.title)}
                      disabled={isDeletingId === idea.id}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                      title="Delete Idea"
                    >
                      {isDeletingId === idea.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {idea.url ? (
                    <a
                      href={idea.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-bg-primary transition-colors"
                      title="Open on TradingView"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href="/ideas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-bg-primary transition-colors"
                      title="View on Ideas page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <IdeaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingIdea(null);
        }}
        onSave={handleSaveIdea}
        initialData={editingIdea}
      />
    </div>
  );
}
