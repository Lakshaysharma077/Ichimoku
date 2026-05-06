'use client';

import { motion } from 'framer-motion';

const filters = ["All", "Free", "Premium", "Trial", "Ichimoku", "Dashboard"];

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function FilterBar({ activeFilter, setActiveFilter }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-12">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className="relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300"
        >
          <span className={`relative z-10 ${activeFilter === filter ? 'text-bg-primary' : 'text-text-secondary hover:text-text-primary'}`}>
            {filter}
          </span>
          {activeFilter === filter && (
            <motion.div
              layoutId="filter-pill"
              className="absolute inset-0 bg-accent rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {activeFilter !== filter && (
            <div className="absolute inset-0 border border-border rounded-full hover:border-text-muted transition-colors" />
          )}
        </button>
      ))}
    </div>
  );
}
