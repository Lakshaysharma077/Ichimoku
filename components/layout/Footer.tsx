'use client';

import React from 'react';
import Link from 'next/link';
import { Youtube } from 'lucide-react';
import { usePathname } from 'next/navigation';
import FooterThemeSelector from '../ui/FooterThemeSelector';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';
import { useThemeStore } from '@/store/themeStore';
import { useContent } from '@/hooks/useContent';
import EditableElement from '../admin/EditableElement';

export default function Footer() {
  const pathname = usePathname();
  const footer = useContent('footer');
  const { theme } = useThemeStore();

  if (pathname.startsWith('/admin')) return null;

  // Determine logo based on theme
  const getLogoSrc = () => {
    if (theme === 'signature') return '/edgefoot.jpeg';
    if (theme === 'dark') return '/blackfoot.jpeg';
    if (theme === 'light') return '/whitefoot.jpeg';
    return footer.brand.logo;
  };

  return (
    <footer className="bg-bg-primary border-t border-border pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-12 mb-10">
          {/* Left Group: Brand + Nav Links */}
          <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-10 xl:gap-14">
            {/* Brand & Socials — flex-col with flex-1 spacer pushes icons to bottom */}
            <div className="flex flex-col min-w-[160px] lg:min-w-[170px]">
              <Link href="/" className="flex flex-col items-start mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden transition-transform duration-500 hover:scale-105">
                  <img src={getLogoSrc()} alt="Ichimoku Edge Logo" className="w-full h-full object-cover scale-[1.1]" />
                </div>
              </Link>

              {/* Icons now sit at the bottom, aligned with Pricing link */}
              <div className="flex items-center gap-3 mt-auto pb-1">
                <a
                  href="https://www.tradingview.com/u/IchimokuEdge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg-secondary/50 rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/5 hover:border-accent/20"
                >
                  <TradingViewIcon className="w-[20px] h-[20px] text-text-primary/90" />
                </a>
                <a
                  href="https://www.youtube.com/@IchimokuEdge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg-secondary/50 rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/5 hover:border-accent/20"
                >
                  <Youtube className="w-[18px] h-[18px] text-text-primary/90" strokeWidth={1.5} />
                </a>
                <a
                  href="https://x.com/IchimokuEdge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-bg-secondary/50 rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/5 hover:border-accent/20"
                >
                  <XIcon className="w-[17px] h-[17px] text-text-primary/90" />
                </a>
              </div>
            </div>

            {/* Nav Sections - Grouped with consistent gap */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-10 xl:gap-14">
              {footer.sections.map((section: any, idx: number) => (
                <div key={idx} className="flex flex-col min-w-[120px] xl:min-w-[130px]">
                  <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-4 opacity-80">
                    <EditableElement section="footer" path={['sections', idx.toString(), 'title']} content={section.title} />
                  </h4>
                  <ul className="space-y-1.5 text-[13px] text-text-secondary font-medium">
                    {section.links.map((link: any, lIdx: number) => (
                      <li key={lIdx}>
                        <Link href={link.href} className="hover:text-accent transition-colors">
                          <EditableElement section="footer" path={['sections', idx.toString(), 'links', lIdx.toString(), 'name']} content={link.name} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="flex flex-col">
            <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-4 opacity-80">
              Settings
            </h4>
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-2">
                <span className="text-[13px] text-text-secondary font-medium">Language</span>
                <div className="flex justify-start">
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[13px] text-text-secondary font-medium">Display Mode</span>
                <div className="flex justify-start">
                  <FooterThemeSelector separators />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-border flex flex-col items-center text-center text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] space-y-1">
          <p>
            <EditableElement section="footer" path={['brand', 'copyright']} content={footer.brand.copyright} />
          </p>
          <p>
            <EditableElement section="footer" path={['brand', 'tagline']} content={footer.brand.tagline} />
          </p>
        </div>
      </div>
    </footer>
  );
}