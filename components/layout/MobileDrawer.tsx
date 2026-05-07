'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Youtube, Twitter } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import Button from '../ui/Button';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: { name: string; href: string; label?: string }[];
}

export default function MobileDrawer({ isOpen, onClose, links }: MobileDrawerProps) {
  const pathname = usePathname();

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
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-extrabold syne text-sm tracking-tighter">ICHIMOKU EDGE</span>
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
              <div className="space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`block py-2 text-lg font-semibold syne transition-colors ${
                      pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{link.name}</span>
                    </div>
                    {link.label && (
                      <span className="block text-xs shippori-mincho text-text-muted mt-1">
                        {link.label}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <Link href="/auth" onClick={onClose}>
                  <Button className="w-full">Login / Register</Button>
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-text-muted font-mono">Language</span>
                <LanguageSwitcher />
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
