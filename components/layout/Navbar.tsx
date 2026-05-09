'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Youtube, Twitter, LineChart, LogIn, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import MobileDrawer from './MobileDrawer';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';

const navLinks = [
  { name: 'Philosophy', href: '/', label: 'ホーム' },
  { name: 'Ichimoku', href: '/ichimoku', label: '一目均衡表' },
  { 
    name: 'Resources', 
    href: '/education', 
    label: '教育',
    submenu: [
      { name: 'Ichimoku Glossary', href: '/glossary' }
    ]
  },
  { name: 'Tools', href: '/tools', label: '道具' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
      {/* Background Backdrop Blur Overlay */}
      <AnimatePresence>
        {hoveredLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-bg-primary/20 backdrop-blur-[2px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-4 flex items-center justify-between flex-nowrap">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-4 group whitespace-nowrap -ml-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">
              <img src="/logo.png" alt="Ichimoku Edge Logo" className="object-cover w-full h-full scale-[1.2]" />
            </div>
            <div className="flex flex-col leading-[0.85] pt-0.5">
              <span className="text-[15px] sm:text-[18px] font-black text-text-primary uppercase syne group-hover:text-accent transition-colors duration-300">
                ICHIMOKU
              </span>
              <span className="text-[15px] sm:text-[18px] font-black text-accent uppercase syne group-hover:text-text-primary transition-colors duration-300 tracking-[0.1em]">
                EDGE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {link.submenu && (
                    <ChevronDown className={`w-3 h-3 opacity-50 transition-all duration-300 ${hoveredLink === link.name ? 'rotate-180 opacity-100' : ''}`} />
                  )}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>

                {/* Standard Dropdown - Premium Liquid Glass */}
                <AnimatePresence>
                  {link.submenu && hoveredLink === link.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-0 pt-4 z-[110]"
                    >
                      <div className="bg-bg-secondary/90 backdrop-blur-[60px] border border-border rounded-2xl p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] min-w-[200px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
                        <div className="relative z-10">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center px-4 py-3 text-xs font-bold tracking-widest uppercase text-text-secondary hover:text-accent hover:bg-white/[0.03] rounded-xl transition-all duration-300 group/sub"
                            >
                              <span className="relative z-10">{sub.name}</span>
                              <div className="absolute left-0 w-1 h-0 bg-accent rounded-full group-hover/sub:h-4 transition-all duration-300" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {link.label && !link.submenu && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 transition-all duration-300 transform ${hoveredLink === link.name ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} pointer-events-none`}>
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
                className="group relative overflow-hidden flex items-center gap-2 px-5 !bg-accent !text-bg-primary rounded-full border-none shadow-[0_0_20px_rgba(251,225,120,0.2)] hover:shadow-[0_0_30px_rgba(251,225,120,0.4)] transition-all duration-500"
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
            <div className="flex items-center gap-1.5">
              <div className="relative group/tip flex flex-col items-center">
                <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-accent transition-colors">
                  <TradingViewIcon className="w-[24px] h-[24px]" />
                </a>
                <div className="absolute top-full mt-1 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5">TradingView</span>
                </div>
              </div>
              <div className="relative group/tip flex flex-col items-center">
                <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-accent transition-colors">
                  <Youtube className="w-[21px] h-[21px]" />
                </a>
                <div className="absolute top-full mt-1 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5">YouTube</span>
                </div>
              </div>
              <div className="relative group/tip flex flex-col items-center">
                <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-secondary hover:text-accent transition-colors">
                  <XIcon className="w-[18px] h-[18px]" />
                </a>
                <div className="absolute top-full mt-1 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5">X / Twitter</span>
                </div>
              </div>
            </div>
            <div className="h-4 w-px bg-border mx-1" />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <div className="relative group/tip flex flex-col items-center">
                <LanguageSwitcher />
                <div className="absolute top-full mt-1 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5">Language</span>
                </div>
              </div>
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
