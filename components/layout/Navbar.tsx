'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { signOutUser } from '@/lib/supabase';
import { Menu, X, Youtube, Twitter, LineChart, LogIn, ChevronDown, Share2, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import MobileDrawer from './MobileDrawer';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

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
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between flex-nowrap">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group whitespace-nowrap -ml-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">
              <img src="/logo.png" alt="Ichimoku Edge Logo" className="object-cover w-full h-full scale-[1.2]" />
            </div>
            <div className="flex flex-col leading-[0.85]">
              <span className="text-[15px] sm:text-[17px] font-black text-text-primary uppercase syne group-hover:text-accent transition-colors duration-300">
                <EditableElement section="navbar" path={['logo', 'text']} content={navbar.logo.text} />
              </span>
              <span className="text-[15px] sm:text-[17px] font-black text-accent uppercase syne group-hover:text-text-primary transition-colors duration-300 tracking-[0.08em]">
                <EditableElement section="navbar" path={['logo', 'subtext']} content={navbar.logo.subtext} />
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-8">
            {navbar.links.map((link: any) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <Link
                  href={link.href}
                  className={`text-[14px] font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1 ${pathname === link.href ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                  <span className="relative z-10">
                    <EditableElement section="navbar" path={['links', navbar.links.indexOf(link).toString(), 'name']} content={link.name} />
                  </span>
                  {link.dropdown && (
                    <ChevronDown className={`w-3 h-3 opacity-50 transition-all duration-300 ${hoveredLink === link.name ? 'rotate-180 opacity-100' : ''}`} />
                  )}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-accent rounded-full"
                    />
                  )}
                </Link>

                {/* Standard Dropdown - Premium Liquid Glass */}
                <AnimatePresence>
                  {link.dropdown && hoveredLink === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-0 pt-4 z-[110]"
                    >
                      <div className="bg-bg-secondary backdrop-blur-[60px] border border-border rounded-2xl p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] min-w-[200px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />
                        <div className="relative z-10">
                          {link.dropdown.map((sub: any) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-text-secondary hover:text-accent hover:bg-accent/[0.06] rounded-xl transition-all duration-300 group/sub"
                            >
                              <span className="relative z-10">
                                <EditableElement 
                                  section="navbar" 
                                  path={['links', navbar.links.indexOf(link).toString(), 'dropdown', link.dropdown.indexOf(sub).toString(), 'name']} 
                                  content={sub.name} 
                                />
                              </span>
                              <div className="absolute left-0 w-1 h-0 bg-accent rounded-full group-hover/sub:h-4 transition-all duration-300" />
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
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-4 ml-2">
              {/* Social Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredLink('social')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <button className={clsx(
                  "p-2 rounded-xl transition-all duration-300",
                  hoveredLink === 'social' ? "bg-accent/10 text-accent" : "text-text-secondary hover:text-text-primary"
                )}>
                  <Share2 className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {hoveredLink === 'social' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(10px)' }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full right-0 pt-4 z-[110]"
                    >
                      <div className="bg-bg-secondary backdrop-blur-[60px] border border-border rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.15)] min-w-[220px] overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />
                        <div className="relative z-10 flex flex-col gap-4">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] px-1 opacity-80 shippori-mincho">Community & Social</span>
                          
                          <div className="flex flex-col gap-1">
                            <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/[0.06] transition-all group/item">
                              <div className="w-8 h-8 rounded-lg bg-bg-tertiary/50 flex items-center justify-center group-hover/item:bg-accent/10 group-hover/item:text-accent transition-colors">
                                <TradingViewIcon className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-text-secondary group-hover/item:text-text-primary transition-colors">TradingView</span>
                            </a>

                            <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/[0.06] transition-all group/item">
                              <div className="w-8 h-8 rounded-lg bg-bg-tertiary/50 flex items-center justify-center group-hover/item:bg-accent/10 group-hover/item:text-accent transition-colors">
                                <Youtube className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-text-secondary group-hover/item:text-text-primary transition-colors">YouTube</span>
                            </a>

                            <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" 
                               className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent/[0.06] transition-all group/item">
                              <div className="w-8 h-8 rounded-lg bg-bg-tertiary/50 flex items-center justify-center group-hover/item:bg-accent/10 group-hover/item:text-accent transition-colors">
                                <XIcon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold text-text-secondary group-hover/item:text-text-primary transition-colors">X / Twitter</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />
              <LanguageSwitcher variant="minimal" />
            </div>

            <div className="h-6 w-px bg-white/10 mx-1" />

            {session ? (
              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] font-bold text-text-primary uppercase tracking-tight leading-none">{session.user?.name}</span>
                  <span className="text-[8px] text-text-muted uppercase tracking-widest mt-1">{(session.user as any).role}</span>
                </div>
                <div className="relative group">
                  <button className="w-9 h-9 rounded-full bg-accent/20 border border-accent/20 overflow-hidden hover:border-accent/50 transition-all">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent font-bold text-xs uppercase">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>
                  
                  {/* Simple Dropdown on hover */}
                  <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[120]">
                    <div className="bg-bg-secondary backdrop-blur-xl border border-border rounded-xl p-1.5 shadow-2xl min-w-[160px] flex flex-col gap-0.5">
                      <Link
                        href="/profile"
                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-text-secondary hover:text-accent hover:bg-accent/[0.06] rounded-lg transition-all uppercase tracking-widest"
                      >
                        <User className="w-3.5 h-3.5" />
                        Profile Settings
                      </Link>
                      <div className="h-px bg-border mx-2 my-0.5" />
                      <button
                        onClick={async () => {
                          await signOutUser();
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all uppercase tracking-widest"
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
                  className="group relative flex items-center gap-2.5 px-6 py-2 rounded-full border-white/20 hover:border-accent hover:text-accent transition-all duration-500 bg-transparent"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="font-bold tracking-tight text-[11px]">
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
