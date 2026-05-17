"use client";

import { useSession, signOut } from "next-auth/react";
import { useEditStore } from "@/lib/store/useEditStore";
import {
  Eye,
  Edit3,
  Save,
  LogOut,
  CheckCircle2,
  Loader2,
  XCircle,
  Keyboard,
  Undo2,
  Redo2,
  GripHorizontal
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

export default function AdminVisualToolbar() {
  const { data: session } = useSession();
  const { isEditMode, setEditMode, pendingChanges, clearChanges } = useEditStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const hasChanges = Object.keys(pendingChanges).length > 0;
  const changesCount = Object.values(pendingChanges).reduce((count: number, section: any) =>
    count + Object.keys(section).length, 0
  );

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    try {
      const sections = Object.keys(pendingChanges);

      for (const section of sections) {
        const res = await fetch(`/api/admin/content/${section}`);
        if (!res.ok) continue;
        const currentData = await res.json();

        const changes = pendingChanges[section];
        const newData = Array.isArray(currentData) ? [...currentData] : { ...currentData };

        Object.entries(changes).forEach(([pathStr, value]) => {
          const path = pathStr.split('.');
          let curr = newData;
          for (let i = 0; i < path.length - 1; i++) {
            if (!curr[path[i]]) curr[path[i]] = {};
            curr = curr[path[i]];
          }
          curr[path[path.length - 1]] = value;
        });

        await fetch(`/api/admin/content/${section}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        });
      }

      clearChanges();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Failed to save changes", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      if (hasChanges) {
        e.preventDefault();
        handleSaveAll();
      }
    }
    if (e.key === 'Escape' && isEditMode) {
      setEditMode(false);
    }
  }, [hasChanges, isEditMode, handleSaveAll]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Block ALL link navigation when edit mode is active
  useEffect(() => {
    if (!isEditMode) return;

    const blockClick = (e: Event) => {
      const target = e.target as HTMLElement;
      // Check if the click is inside an <a> tag
      const anchor = target.closest('a');
      if (anchor) {
        // Don't block clicks on the admin toolbar itself
        const toolbar = target.closest('[data-admin-toolbar]');
        if (toolbar) return;

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    // Block click events in capture phase (before Next.js can handle them)
    // Don't block mousedown — it's needed for contentEditable focus
    document.addEventListener('click', blockClick, true);
    document.addEventListener('auxclick', blockClick, true);

    // Also override pushState/replaceState to prevent programmatic navigation
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    
    history.pushState = function(...args: any[]) {
      return origPush.apply(history, args as any);
    };
    
    history.replaceState = function(...args: any[]) {
      return origReplace.apply(history, args as any);
    };

    return () => {
      document.removeEventListener('click', blockClick, true);
      document.removeEventListener('auxclick', blockClick, true);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [isEditMode]);

  if (!session || (session.user as any).role !== "ADMIN") return null;

  return (
    <>
      {isEditMode && (
        <div className="fixed inset-0 pointer-events-none z-[998]">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
      )}

      <div data-admin-toolbar className={clsx(
        "fixed z-[999] flex items-center gap-2",
        isMobile ? "bottom-4 left-4 right-4" : "bottom-6 left-1/2 -translate-x-1/2",
      )}>
        <div className={clsx(
          "flex items-center gap-2 p-2 bg-[#0D1014]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          isMobile ? "w-full justify-between" : ""
        )}>
          <div className="flex items-center gap-3 px-3 border-r border-white/10 mr-1">
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">
              {session.user?.name?.charAt(0) || "A"}
            </div>
            {!isMobile && (
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Admin</span>
                <span className="text-[11px] text-white font-medium leading-tight">{session.user?.name || "Administrator"}</span>
              </div>
            )}
          </div>

          <div className="flex bg-[#0A0C10] rounded-xl p-0.5 border border-white/5">
            <button
              onClick={() => setEditMode(false)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                !isEditMode ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Eye className="w-3 h-3" />
              {!isMobile && "PREVIEW"}
            </button>
            <button
              onClick={() => setEditMode(true)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                isEditMode ? "bg-accent text-bg-primary shadow-[0_0_20px_rgba(251,225,120,0.2)]" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Edit3 className="w-3 h-3" />
              {!isMobile && "EDIT"}
            </button>
          </div>

          {isEditMode && (
            <>
              <button
                onClick={() => setSaveStatus("idle" === saveStatus && hasChanges ? "confirming" as any : saveStatus)}
                disabled={!hasChanges || isSaving}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all",
                  saveStatus === "success" ? "bg-emerald-500 text-black" :
                  saveStatus === "error" ? "bg-red-500 text-white" :
                  hasChanges ? "bg-accent text-bg-primary hover:scale-105" : "bg-white/5 text-gray-500 cursor-not-allowed"
                )}
              >
                {saveStatus === "saving" ? <Loader2 className="w-3 h-3 animate-spin" /> :
                 saveStatus === "success" ? <CheckCircle2 className="w-3 h-3" /> :
                 saveStatus === "error" ? <XCircle className="w-3 h-3" /> :
                 <Save className="w-3 h-3" />}

                {saveStatus === "success" ? "SAVED!" :
                 saveStatus === "error" ? "ERROR" :
                 saveStatus === "saving" ? "SAVING..." :
                 isMobile ? `${changesCount}` : `SAVE (${changesCount})`}

                {hasChanges && saveStatus === "idle" && (
                  <span className="flex h-1.5 w-1.5 relative ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                  </span>
                )}
              </button>

              {/* Confirmation Modal */}
              <AnimatePresence>
                {saveStatus === "confirming" as any && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-full mb-4 right-0 w-64 bg-[#0D1014] border border-white/10 rounded-2xl p-4 shadow-2xl z-[1000]"
                  >
                    <p className="text-[11px] font-bold text-white mb-4 uppercase tracking-wider">Apply changes to live website?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSaveStatus("idle")}
                        className="flex-1 py-2 rounded-xl bg-white/5 text-gray-400 text-[10px] font-bold hover:bg-white/10 transition-all"
                      >
                        CANCEL
                      </button>
                      <button 
                        onClick={handleSaveAll}
                        className="flex-1 py-2 rounded-xl bg-accent text-bg-primary text-[10px] font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(251,225,120,0.2)]"
                      >
                        CONFIRM
                      </button>
                    </div>
                    <div className="absolute top-full right-8 w-4 h-4 bg-[#0D1014] border-r border-b border-white/10 rotate-45 -translate-y-2 z-[-1]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {!isMobile && isEditMode && (
            <div className="flex items-center gap-0.5 px-2 border-l border-white/10">
              <span className="text-[8px] text-gray-600 uppercase tracking-wider font-mono">
                <Keyboard className="w-2.5 h-2.5 inline mr-0.5" />
                Ctrl+S
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => signOut()}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
