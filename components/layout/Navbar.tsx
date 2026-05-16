'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { signOutUser } from '@/lib/supabase';
import { Menu, X, Youtube, Twitter, LineChart, LogIn, ChevronDown, Share2, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';
import { useThemeStore } from '@/store/themeStore';
import SettingsDropdown from './SettingsDropdown';
import ThemeToggle from '../ui/ThemeToggle';
import MobileDrawer from './MobileDrawer';
import { clsx } from 'clsx';
import { useContent } from '@/hooks/useContent';
import EditableElement from '../admin/EditableElement';

export default function Navbar() {
  const { data: session } = useSession();
  const navbar = useContent('navbar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  // Determine logo based on theme
  const getLogoSrc = () => {
    if (theme === 'signature') return '/navedge.jpeg';
    if (theme === 'dark') return '/navblack.jpeg';
    if (theme === 'light') return '/navwhite.jpeg';
    return '/logo_final.png';
  };

  return (
    <>
      {/* Backdrop blur removed as requested */}


      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isScrolled
          ? 'bg-bg-primary/90 backdrop-blur-2xl py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.15)]'
          : 'bg-transparent py-6'
          }`}
      >
        {/* Thinner Gold Line on Scroll */}
        <div className={clsx(
          "absolute bottom-0 left-0 right-0 h-[1px] bg-accent/30 transition-opacity duration-500",
          isScrolled ? "opacity-100" : "opacity-0"
        )} />
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-nowrap">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group whitespace-nowrap -ml-1">
            <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105">
              <img src={getLogoSrc()} alt="Ichimoku Edge Logo" className="object-cover w-full h-full scale-[1.1]" />
            </div>
            <div className="flex flex-col">
              <span className="syne font-bold text-[18px] leading-none tracking-tight text-text-primary">
                <EditableElement section="navbar" path={['logo', 'text']} content={navbar.logo.text} />
              </span>
              <span className="syne font-bold text-[13px] leading-none tracking-[0.2em] text-accent mt-1">
                <EditableElement section="navbar" path={['logo', 'subtext']} content={navbar.logo.subtext} />
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navbar.links.map((link: any) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className={clsx(
                    "group relative text-[14px] font-medium transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] whitespace-nowrap flex items-center gap-1.5 py-1",
                    pathname === link.href ? "text-accent brightness-110" : "text-text-secondary hover:text-text-primary hover:brightness-110 hover:-translate-y-[1px]"
                  )}
                >
                  <span className="relative z-10">
                    <EditableElement section="navbar" path={['links', navbar.links.indexOf(link).toString(), 'name']} content={link.name} />
                  </span>
                  
                  {/* Premium Gold Underline - Center Outward */}
                  <div className={clsx(
                    "absolute -bottom-1 left-0 right-0 h-[1.5px] bg-accent rounded-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-center",
                    pathname === link.href ? "scale-x-100 opacity-80" : "scale-x-0 group-hover:scale-x-100 opacity-60"
                  )} />
                </Link>

                {/* Standard Dropdown - Premium Liquid Glass */}
                <AnimatePresence>
                  {link.dropdown && hoveredLink === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-6 z-[110]"
                    >
                      <div className="bg-bg-secondary border border-border/50 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-w-[220px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10 flex flex-col gap-1">
                          {link.dropdown.map((sub: any) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center px-4 py-3 text-[11px] font-bold tracking-widest uppercase text-text-secondary hover:text-accent hover:bg-accent/[0.04] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group/sub relative overflow-hidden"
                            >
                              <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/sub:translate-x-1">
                                <EditableElement 
                                  section="navbar" 
                                  path={['links', navbar.links.indexOf(link).toString(), 'dropdown', link.dropdown.indexOf(sub).toString(), 'name']} 
                                  content={sub.name} 
                                />
                              </span>
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-accent rounded-full group-hover/sub:h-1/2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-0 group-hover/sub:opacity-100" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-5">
            <SettingsDropdown />
            <ThemeToggle />

            <div className="h-6 w-px bg-white/10 mx-1" />

            {session ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] font-bold text-text-primary uppercase tracking-tight leading-none">{session.user?.name}</span>
                  <span className="text-[8px] text-text-muted uppercase tracking-widest mt-1">{(session.user as any).role}</span>
                </div>
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 overflow-hidden hover:border-accent hover:shadow-[0_0_15px_rgba(var(--accent),0.2)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent font-bold text-xs uppercase">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>
                  
                  {/* Simple Dropdown on hover */}
                  <div className="absolute top-full right-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-[120]">
                    <div className="bg-bg-secondary/90 backdrop-blur-2xl border border-border/50 rounded-2xl p-2 shadow-[0_30px_60px_rgba(0,0,0,0.2)] min-w-[180px] flex flex-col gap-1">
                      <Link
                        href="/profile"
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-bold text-text-secondary hover:text-accent hover:bg-accent/[0.04] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] uppercase tracking-widest"
                      >
                        <User className="w-3.5 h-3.5" />
                        Profile Settings
                      </Link>
                      <div className="h-px bg-border/50 mx-2 my-1" />
                      <button
                        onClick={async () => {
                          await signOutUser();
                          signOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-bold text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] uppercase tracking-widest"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full !border-[#fbe178]/80 hover:!border-[#fbe178] hover:bg-accent/[0.03] hover:text-accent transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-transparent shadow-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.2),0_0_15px_rgba(var(--accent),0.1)] hover:-translate-y-0.5 overflow-hidden text-accent"
                >
                  {/* Subtle Gold Lighting Sweep */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
                  </div>
                  
                  <LogIn className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110" />
                  <span className="font-bold tracking-tight text-[12px]">
                    <EditableElement section="navbar" path={['loginButton']} content={navbar.loginButton} />
                  </span>
                </Button>
              </Link>
            )}
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
        links={navbar.links}
      />
    </>
  );
}
