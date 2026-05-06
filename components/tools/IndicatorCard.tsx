'use client';

import { Indicator, useAdminStore } from "@/store/adminStore";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Star, LineChart, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

interface IndicatorCardProps {
  indicator: Indicator;
  isAdmin?: boolean;
  onEdit?: (ind: Indicator) => void;
  onDelete?: (id: string) => void;
}

export default function IndicatorCard({ indicator, isAdmin, onEdit, onDelete }: IndicatorCardProps) {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'FREE': return 'green';
      case 'PREMIUM': return 'amber';
      case '14-DAY TRIAL': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Card className={`relative group h-full flex flex-col ${isAdmin && indicator.status === 'Draft' ? 'opacity-60' : ''}`}>
      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <button 
            onClick={() => onEdit?.(indicator)}
            className="p-1.5 bg-bg-primary border border-border rounded hover:bg-bg-tertiary transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete?.(indicator.id)}
            className="p-1.5 bg-bg-primary border border-border rounded hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <div className="p-1.5 bg-bg-primary border border-border rounded cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3.5 h-3.5 text-text-muted" />
          </div>
        </div>
      )}

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge variant={getBadgeVariant(indicator.badgeType)}>
          {indicator.badgeType}
        </Badge>
      </div>

      <div className="p-6 pt-12 flex-1">
        <div className="flex flex-col mb-4">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em] mb-1">
            {indicator.category.join(' · ')}
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
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(indicator.rating) ? 'fill-current' : 'opacity-30'}`} />
            ))}
          </div>
          <span className="text-[10px] font-mono text-text-muted">({indicator.numRatings} RATINGS)</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
          <LineChart className="w-4 h-4 text-accent" />
          <span>TradingView Pine Script v5</span>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-bg-tertiary/30">
        <span className="text-sm font-bold syne text-text-primary">{indicator.price}</span>
        <Button size="sm" variant={indicator.badgeType === 'FREE' ? 'outline' : 'solid'}>
          {indicator.badgeType === 'FREE' ? 'Get Script' : 'View Details'}
        </Button>
      </div>

      {isAdmin && (
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-bg-primary border border-border rounded text-[8px] font-mono uppercase tracking-widest flex items-center gap-1">
          {indicator.status === 'Published' ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
          {indicator.status}
        </div>
      )}
    </Card>
  );
}
