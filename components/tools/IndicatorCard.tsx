'use client';

import Link from "next/link";
import Image from "next/image";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Star, LineChart, Pencil, Trash2, Lock, Unlock, Clock, AlertTriangle, ArrowRight } from "lucide-react";

export interface IndicatorData {
  id: string;
  name: string;
  slug?: string;
  description: string;
  thumbnail?: string;
  screenshots?: any;
  overview?: string;
  howItWorks?: string;
  features?: any;
  howToUse?: string;
  accessStatus: "Free" | "Premium" | "Coming Soon" | "Beta" | "Deprecated" | string;
  priceLabel?: string;
  tvUrl?: string;
  category: string[] | string;
  sortOrder?: number;
  rating?: number;
  numRatings?: number;
  badgeType?: string;
  status?: string;
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
  const detailHref = `/tools/${indicator.slug || indicator.id}`;

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
    <Card className={`relative group h-full flex flex-col overflow-hidden transition-all duration-300 hover:border-accent/40 ${status === 'Deprecated' ? 'opacity-50' : ''}`}>
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-1 z-30">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(indicator);
            }}
            className="p-1.5 bg-bg-primary/90 backdrop-blur-md border border-border rounded-lg hover:bg-bg-tertiary transition-colors text-text-primary shadow-md"
            title="Edit Status & Details"
          >
            <Pencil className="w-3.5 h-3.5 text-accent" />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(indicator.id);
            }}
            className="p-1.5 bg-bg-primary/90 backdrop-blur-md border border-border rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-colors text-text-primary shadow-md"
            title="Delete Indicator"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Thumbnail Banner if available */}
      {indicator.thumbnail ? (
        <Link href={detailHref} className="block relative w-full h-44 bg-bg-primary/60 border-b border-border/60 overflow-hidden">
          <Image
            src={indicator.thumbnail}
            alt={indicator.name}
            fill
            className="object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-black/30" />
          
          {/* Access Status Badge on image */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <Badge variant={getBadgeVariant(status)}>
              {status.toUpperCase()}
            </Badge>
            {status === 'Premium' && !isUnlocked && (
              <span className="p-1 rounded bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[10px] font-mono flex items-center gap-1 font-bold shadow-sm">
                <Lock className="w-3 h-3" />
                <span>LOCKED</span>
              </span>
            )}
            {status === 'Premium' && isUnlocked && (
              <span className="p-1 rounded bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1 font-bold shadow-sm">
                <Unlock className="w-3 h-3" />
                <span>UNLOCKED</span>
              </span>
            )}
          </div>
        </Link>
      ) : (
        /* Access Status Badge without image */
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
      )}

      <div className={`p-6 flex-1 flex flex-col justify-between ${!indicator.thumbnail ? 'pt-14' : 'pt-4'}`}>
        <div>
          <div className="flex flex-col mb-3">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1">
              {categoriesList.join(' · ')}
            </span>
            <Link href={detailHref} className="group-hover:text-accent transition-colors">
              <h3 className="syne font-bold text-lg text-text-primary group-hover:text-accent transition-colors leading-snug">
                {indicator.name}
              </h3>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-5 line-clamp-3">
            {indicator.description}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-0.5 text-[#fbe178]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(indicator.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
              ))}
            </div>
            <span className="text-[10px] font-mono text-text-muted font-bold">
              {indicator.rating?.toFixed(1) || "5.0"} ({indicator.numRatings || 72} REVIEWS)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <LineChart className="w-4 h-4 text-accent shrink-0" />
            <span>TradingView Pine Script v5</span>
          </div>
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
        ) : (
          <Link href={detailHref}>
            <Button size="sm" variant={status === 'Free' || isUnlocked ? "solid" : "outline"} className="flex items-center gap-1.5">
              <span>{status === 'Free' || isUnlocked ? "View Docs & Script" : "View Indicator"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
