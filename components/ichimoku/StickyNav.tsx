'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'overview', name: 'Overview' },
  { id: 'why', name: 'Why Traders Use It' },
  { id: 'components', name: 'Components' },
  { id: 'kumo', name: 'The Kumo' },
  { id: 'concepts', name: 'Key Concepts' },
  { id: 'faq', name: 'FAQ' },
];

export default function StickyNav() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="sticky top-24 z-50 mb-12 lg:mb-0">
      {/* Mobile Horizontal Tabs */}
      <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-4 px-4 py-4 bg-bg-primary/80 backdrop-blur-md border-b border-border">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeSection === section.id 
                ? 'bg-[#fbe178] text-[#0c101f]' 
                : 'bg-bg-secondary text-text-muted border border-border'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Desktop Vertical Nav */}
      <div className="hidden lg:flex flex-col gap-6 pl-8 border-l border-border/50">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center text-left"
          >
            <div className={`absolute -left-[33px] w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === section.id 
                ? 'bg-[#fbe178] scale-150 shadow-[0_0_10px_#fbe178]' 
                : 'bg-border scale-100 group-hover:bg-text-muted'
            }`} />
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
              activeSection === section.id 
                ? 'text-[#fbe178]' 
                : 'text-text-muted group-hover:text-text-primary'
            }`}>
              {section.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
