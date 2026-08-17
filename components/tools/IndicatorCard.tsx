'use client';

import Link from "next/link";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Star, LineChart, Pencil, Trash2, GripVertical, Lock, Unlock, Clock, AlertTriangle } from "lucide-react";

export interface IndicatorData {
  id: string;
  name: string;
  slug?: string;
  description: string;
  accessStatus: "Free" | "Premium" | "Coming Soon" | "Beta" | "Deprecated" | string;
  priceLabel?: string;
  tvUrl?: string;
  category: string[] | string;
  rating?: number;
  numRatings?: number;
  badgeType?: string;
}

interface IndicatorCardProps {
  indicator: IndicatorData;
  isAdmin?: boolean;
  isUnlocked?: boolean;
  onEdit?: (ind: IndicatorData) => void;
  onDelete?: (id: string) => void;
}

export default function IndicatorCard({
  indicator,
  isAdmin,
  isUnlocked = false,
  onEdit,
  onDelete,
}: IndicatorCardProps) {
  const status = indicator.accessStatus || "Premium";

  const categoriesList = typeof indicator.category === "string"
    ? (() => { try { return JSON.parse(indicator.category); } catch { return [indicator.category]; } })()
    : indicator.category || [];

  const getBadgeVariant = (st: string) => {
    switch (st) {
      case 'Free': return 'green';
      case 'Premium': return 'amber';
      case 'Beta': return 'blue';
      case 'Coming Soon': return 'gray';
      case 'Deprecated': return 'rose';
      default: return 'gray';
    }
  };

  return (
    <Card className={`relative group h-full flex flex-col ${status === 'Deprecated' ? 'opacity-50' : ''}`}>
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <button 
            onClick={() => onEdit?.(indicator)}
            className="p-1.5 bg-bg-primary border border-border rounded hover:bg-bg-tertiary transition-colors text-text-primary"
            title="Edit Status & Details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete?.(indicator.id)}
            className="p-1.5 bg-bg-primary border border-border rounded hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-text-primary"
            title="Delete Indicator"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Access Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Badge variant={getBadgeVariant(status)}>
          {status.toUpperCase()}
        </Badge>
        {status === 'Premium' && !isUnlocked && (
          <span className="p-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>LOCKED</span>
          </span>
        )}
        {status === 'Premium' && isUnlocked && (
          <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
            <Unlock className="w-3 h-3" />
            <span>UNLOCKED</span>
          </span>
        )}
      </div>

      <div className="p-6 pt-12 flex-1">
        <div className="flex flex-col mb-4">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1">
            {categoriesList.join(' · ')}
          </span>
          <h3 className="syne font-bold text-lg text-text-primary group-hover:text-accent transition-colors">
            {indicator.name}
          </h3>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
          {indicator.description}
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1 text-[#fbe178]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(indicator.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
            ))}
          </div>
          <span className="text-[10px] font-mono text-text-muted">({indicator.numRatings || 120} RATINGS)</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <LineChart className="w-4 h-4 text-accent" />
          <span>TradingView Pine Script v5</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-tertiary/30">
        <span className="text-sm font-bold syne text-text-primary">
          {indicator.priceLabel || (status === 'Free' ? 'Free Access' : '$22/mo')}
        </span>

        {status === 'Coming Soon' ? (
          <Button size="sm" variant="outline" disabled className="flex items-center gap-1 font-mono text-xs">
            <Clock className="w-3 h-3" />
            <span>Coming Soon</span>
          </Button>
        ) : status === 'Deprecated' ? (
          <Button size="sm" variant="outline" disabled className="flex items-center gap-1 font-mono text-xs">
            <AlertTriangle className="w-3 h-3" />
            <span>Deprecated</span>
          </Button>
        ) : status === 'Free' || isUnlocked ? (
          <a
            href={indicator.tvUrl || "https://www.tradingview.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="solid">
              Access Script →
            </Button>
          </a>
        ) : (
          <Link href="/pricing">
            <Button size="sm" variant="outline">
              Subscribe to Unlock
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
