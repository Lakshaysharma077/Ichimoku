'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Youtube, Twitter, LineChart, LogIn } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import MobileDrawer from './MobileDrawer';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';

const navLinks = [
  { name: 'Home', href: '/', label: 'ホーム' },
  { name: 'Ichimoku Kinkō Hyō', href: '/ichimoku', label: '一目均衡表' },
  { name: 'Education', href: '/education', badge: 'Coming Soon' },
  { name: 'Tools', href: '/tools', label: '道具' },
  { name: 'FAQ', href: '/faq', label: 'よくある質問' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between flex-nowrap">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group whitespace-nowrap -ml-1">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
              <img src="/logo.png" alt="Ichimoku Edge Logo" className="object-cover w-full h-full scale-[1.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-[20px] font-black tracking-tight text-text-primary uppercase syne group-hover:text-accent transition-colors duration-300">
                  ICHIMOKU EDGE
                </span>
              </div>
              <span className="text-[10px] shippori-mincho text-text-muted mt-[-3px] tracking-wider">
                「一目均衡表」
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center ${pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                  {link.badge && (
                    <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-amber-500/20 text-amber-500 rounded-full animate-pulse uppercase shrink-0">
                      {link.badge}
                    </span>
                  )}
                </Link>
                {link.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
                    <span className="text-[10px] shippori-mincho text-text-muted whitespace-nowrap">
                      {link.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <Link href="/auth">
              <Button
                size="sm"
                className="group relative overflow-hidden flex items-center gap-2 px-5 !bg-[#fbe178] !text-[#0c101f] rounded-full border-none shadow-[0_0_20px_rgba(251,225,120,0.2)] hover:shadow-[0_0_30px_rgba(251,225,120,0.4)] transition-all duration-500"
              >
                <div className="relative z-10 flex items-center gap-2">
                  <LogIn className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-500" />
                  <span className="font-bold tracking-tight">LOGIN / REGISTER</span>
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              </Button>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-text-primary hover:scale-120 transition-all duration-300">
                <TradingViewIcon className="w-[18px] h-[18px]" />
              </a>
              <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-text-primary hover:scale-120 transition-all duration-300">
                <Youtube className="w-[18px] h-[18px]" />
              </a>
              <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-text-primary hover:scale-120 transition-all duration-300">
                <XIcon className="w-[15px] h-[15px]" />
              </a>
            </div>
            <div className="h-4 w-px bg-border mx-1" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-text-primary hover:bg-bg-secondary rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      </header>

      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
