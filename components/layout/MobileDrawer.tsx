'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Youtube } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import Button from '../ui/Button';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: readonly { 
    readonly name: string; 
    readonly href: string; 
    readonly label?: string;
    readonly submenu?: readonly { readonly name: string; readonly href: string }[];
    readonly dropdown?: readonly { readonly name: string; readonly href: string }[];
  }[];
}

export default function MobileDrawer({ isOpen, onClose, links }: MobileDrawerProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-[300px] bg-bg-primary shadow-2xl lg:hidden flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-border">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 bg-bg-tertiary">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-[1.2]" />
                </div>
                <div className="flex flex-col leading-[0.9] gap-0.5">
                  <span className="font-black syne text-[13px] tracking-tight text-text-primary uppercase">ICHIMOKU</span>
                  <span className="font-black syne text-[13px] tracking-[0.1em] text-accent uppercase">EDGE</span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={onClose}
                  className="p-2 text-text-primary hover:bg-bg-secondary rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                {links.map((link) => (
                  <div key={link.name} className="flex flex-col">
                    {(link.dropdown || link.submenu) ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => setOpenSubmenu(openSubmenu === link.name ? null : link.name)}
                          className={`flex items-center justify-between py-3 text-lg font-semibold syne transition-colors ${
                            openSubmenu === link.name ? 'text-accent' : 'text-text-secondary'
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span>{link.name}</span>
                            {link.label && (
                              <span className="text-[10px] shippori-mincho text-text-muted tracking-wider leading-none mt-1">
                                {link.label}
                              </span>
                            )}
                          </div>
                          <motion.div
                            animate={{ rotate: openSubmenu === link.name ? 180 : 0 }}
                          >
                            <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {openSubmenu === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-bg-secondary/30 rounded-xl px-4"
                            >
                              {(link.dropdown || link.submenu)!.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.href}
                                  onClick={onClose}
                                  className="block py-4 text-sm font-bold text-text-secondary hover:text-accent uppercase tracking-widest border-b border-white/5 last:border-0"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={`block py-3 text-lg font-semibold syne transition-colors ${
                          pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{link.name}</span>
                          {link.label && (
                            <span className="text-[10px] shippori-mincho text-text-muted tracking-wider leading-none mt-1">
                              {link.label}
                            </span>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <Link href="/auth" onClick={onClose}>
                  <Button className="w-full">Login / Register</Button>
                </Link>
              </div>

              <div className="flex flex-row items-center justify-between pt-4">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Language</span>
                <LanguageSwitcher variant="minimal" />
              </div>
            </div>

            <div className="p-8 border-t border-border bg-bg-secondary flex justify-center gap-8">
              <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors">
                <TradingViewIcon className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-text-primary transition-colors">
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
