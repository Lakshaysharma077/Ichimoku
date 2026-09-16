'use client';

export interface SidebarItem {
  id: string;
  number: string;
  label: string;
}

interface ToolsSidebarProps {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}

/**
 * Shared vertical sidebar navigation.
 * Used for both category navigation (Level 1) and section navigation (Level 2).
 */
export default function ToolsSidebar({ items, activeId, onSelect, ariaLabel = 'Navigation' }: ToolsSidebarProps) {
  return (
    <nav className="tools-sidebar" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`tools-sidebar-item ${activeId === item.id ? 'tools-sidebar-item--active' : ''}`}
        >
          <span className="tools-sidebar-number">{item.number}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
