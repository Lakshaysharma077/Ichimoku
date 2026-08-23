"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import IdeaManager from "@/components/admin/IdeaManager";

export default function AdminIdeasPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [authStatus, router]);

  if (authStatus === "loading") {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </div>
            <h1 className="syne font-extrabold text-3xl lg:text-4xl text-text-primary uppercase tracking-tight">
              Market Analysis &amp; Ideas
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Add new chart screenshots and analysis. New ideas automatically appear on the live website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/admin/content")}
              className="flex items-center gap-2 font-mono text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Content Sections</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push("/admin/payments")}
              className="flex items-center gap-2 font-mono text-xs"
            >
              <span>Payments</span>
            </Button>
          </div>
        </div>

        {/* Ideas Manager */}
        <IdeaManager />
      </div>
    </div>
  );
}
