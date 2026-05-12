"use client";

import React from 'react';
import { useEditStore } from '@/lib/store/useEditStore';
import { Plus, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface EditableListProps<T> {
  section: string;
  path: string[];
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  newItemTemplate: T;
  className?: string;
  itemClassName?: string;
}

export default function EditableList<T>({
  section,
  path,
  items,
  renderItem,
  newItemTemplate,
  className,
  itemClassName
}: EditableListProps<T>) {
  const { isEditMode, addChange } = useEditStore();

  const handleAdd = () => {
    const newList = [...items, newItemTemplate];
    addChange(section, path, newList);
  };

  const handleRemove = (index: number) => {
    const item = items[index];
    if (window.confirm(`Remove "${(item as any).name || (item as any).question || 'this item'}"?`)) {
      const newList = items.filter((_, i) => i !== index);
      addChange(section, path, newList);
    }
  };

  if (!isEditMode) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={index} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx("relative", className)}>
      {items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">No items yet — click below to add one</p>
        </div>
      )}

      {items.map((item, index) => (
        <div key={index} className={clsx("relative group/item", itemClassName)}>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {renderItem(item, index)}
            </div>

            {isEditMode && (
              <div className="flex items-center gap-1 pt-1 opacity-0 group-hover/item:opacity-100 transition-all duration-200 shrink-0">
                <div className="flex flex-col items-center gap-1 p-1 bg-bg-secondary/80 backdrop-blur-sm border border-white/5 rounded-lg">
                  <button
                    onClick={() => handleRemove(index)}
                    className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                    title="Remove Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {isEditMode && index < items.length - 1 && (
            <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mx-2 my-2" />
          )}
        </div>
      ))}

      {isEditMode && (
        <button
          onClick={handleAdd}
          className="w-full mt-3 py-3 border-2 border-dashed border-white/5 rounded-xl text-gray-500 hover:text-accent hover:border-accent/30 hover:bg-accent/[0.02] transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Add Item</span>
        </button>
      )}
    </div>
  );
}
