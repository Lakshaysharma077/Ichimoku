'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { signOutUser } from '@/lib/supabase';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import SettingsDropdown from './SettingsDropdown';
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

  const getLogoSrc = () => {
    if (theme === 'signature') return '/navedge.jpeg';
    if (theme === 'dark') return '/navblack.jpeg';
    if (theme === 'light') return '/navwhite.jpeg';
    return '/logo_final.png';
  };

  const isLinkActive = (link: any) =>
    pathname === link.href || (link.dropdown && link.dropdown.some((sub: any) => pathname === sub.href));

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-[100] transition-colors duration-300",
          isScrolled
            ? 'bg-bg-primary/95 backdrop-blur-md'
            : 'bg-transparent'
        )}
      >
        {/* Persistent subtle hairline border, slightly more pronounced on scroll */}
        <div className={clsx(
          "absolute bottom-0 left-0 right-0 h-px transition-colors duration-300",
          isScrolled ? "bg-border" : "bg-border/40"
        )} />

        <nav className="max-w-7xl mx-auto px-6 sm:px-8 h-[76px] flex justify-between lg:grid lg:grid-cols-3 items-center">
          
          {/* ── Logo (Left Aligned) ── */}
          <Link href="/" className="flex items-center gap-3.5 group justify-self-start">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 transition-opacity duration-200 group-hover:opacity-80">
              <img src={getLogoSrc()} alt="Ichimoku Edge" className="object-cover w-full h-full scale-[1.15]" />
            </div>
            <div className="flex flex-col">
              <span className="syne font-bold text-[13px] leading-none tracking-[0.02em] text-text-primary">
                <EditableElement section="navbar" path={['logo', 'text']} content={navbar.logo.text} />
              </span>
              <span className="syne font-medium text-[8.5px] leading-none tracking-[0.24em] text-accent mt-0.5">
                <EditableElement section="navbar" path={['logo', 'subtext']} content={navbar.logo.subtext} />
              </span>
            </div>
          </Link>

          {/* ── Desktop Navigation (Center Aligned) ── */}
          <div className="hidden lg:flex items-center justify-center gap-10 xl:gap-14 justify-self-center">
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
                    "relative group text-[11px] uppercase tracking-[0.08em] transition-colors duration-300 ease-out whitespace-nowrap flex items-center h-[76px] font-mono",
                    link.name.toUpperCase() === 'TOOL' ? "font-bold" : "font-medium",
                    isLinkActive(link)
                      ? "text-accent"
                      : "text-text-secondary hover:text-accent"
                  )}
                >
                  <EditableElement section="navbar" path={['links', navbar.links.indexOf(link).toString(), 'name']} content={link.name} />
                  
                  {link.dropdown && (
                    <ChevronDown className="w-3 h-3 ml-1 opacity-50 transition-transform duration-300 ease-out group-hover:rotate-180" />
                  )}

                  {/* Underline animates left to right */}
                  <span className={clsx(
                    "absolute bottom-[24px] left-0 right-0 h-px bg-accent transition-transform duration-300 ease-out origin-left",
                    isLinkActive(link)
                      ? "scale-x-100 opacity-60"
                      : "scale-x-0 group-hover:scale-x-100 opacity-60"
                  )} />
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {link.dropdown && hoveredLink === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-1.5 z-[110]"
                    >
                      <div className="bg-bg-primary border border-border/60 rounded-md py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-[170px]">
                        {link.dropdown.map((sub: any) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 text-[10px] font-medium tracking-[0.08em] uppercase text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50 transition-colors duration-150 font-mono"
                          >
                            <EditableElement 
                              section="navbar" 
                              path={['links', navbar.links.indexOf(link).toString(), 'dropdown', link.dropdown.indexOf(sub).toString(), 'name']} 
                              content={sub.name} 
                            />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* ── Right Section (Right Aligned) ── */}
          <div className="hidden lg:flex items-center gap-5 justify-self-end">
            
            {/* Utility Group: Globe + Login tightly coupled */}
            <div className="flex items-center gap-4">
              <SettingsDropdown />

              <div className="w-px h-3 bg-border/60" />

              {session ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-medium text-text-primary uppercase tracking-[0.05em] leading-none">{session.user?.name}</span>
                    <span className="text-[8px] text-text-muted uppercase tracking-[0.15em] mt-0.5">{(session.user as any).role}</span>
                  </div>
                  <div className="relative group">
                    <button className="w-7 h-7 rounded-full bg-transparent border border-border/80 overflow-hidden hover:border-accent/40 transition-colors duration-200 flex items-center justify-center">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-text-secondary font-medium text-[9px] uppercase">
                          {session.user?.name?.charAt(0) || "U"}
                        </span>
                      )}
                    </button>
                    
                    {/* Profile Dropdown */}
                    <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-[120]">
                      <div className="bg-bg-primary border border-border/60 rounded-md py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-w-[150px]">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-[10px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary/50 transition-colors duration-150 uppercase tracking-[0.08em] font-mono"
                        >
                          <User className="w-3 h-3" />
                          Profile
                        </Link>
                        <div className="h-px bg-border/60 mx-3 my-0.5" />
                        <button
                          onClick={async () => {
                            await signOutUser();
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-[10px] font-medium text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/5 transition-colors duration-150 uppercase tracking-[0.08em] font-mono"
                        >
                          <LogOut className="w-3 h-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="group flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-text-secondary hover:text-accent transition-colors duration-300 ease-out font-mono"
                >
                  <EditableElement section="navbar" path={['loginButton']} content={navbar.loginButton} />
                  <span className="text-[8.5px] opacity-50 group-hover:opacity-90 transition-all duration-300 ease-out group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors duration-200 justify-self-end"
          >
            <Menu className="w-5 h-5" />
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
