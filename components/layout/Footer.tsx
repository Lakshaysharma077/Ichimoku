'use client';

import React from 'react';
import Link from 'next/link';
import { Youtube } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import FooterThemeSelector from '../ui/FooterThemeSelector';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';

export default function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-border pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
          {/* Brand & Links Group (Left) */}
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-10">
            {/* Brand & Socials */}
            <div className="flex flex-col min-w-[180px]">
              <Link href="/" className="flex flex-col mb-8">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-border/50 bg-bg-tertiary mb-6 shadow-2xl">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <div className="flex flex-col leading-[0.85]">
                  <span className="text-xl font-black syne text-text-primary uppercase">
                    ICHIMOKU
                  </span>
                  <span className="text-xl font-black syne text-accent uppercase tracking-[0.1em]">
                    EDGE
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <div className="relative group/tip flex flex-col items-center">
                  <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-bg-secondary/50 rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/5 hover:border-accent/20">
                    <TradingViewIcon className="w-[24px] h-[24px] text-text-primary/90" />
                  </a>
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                    <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-md rounded border border-white/5">TradingView</span>
                  </div>
                </div>
                <div className="relative group/tip flex flex-col items-center">
                  <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-bg-secondary/50 rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/5 hover:border-accent/20">
                    <Youtube className="w-[22px] h-[22px] text-text-primary/90" strokeWidth={1.5} />
                  </a>
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                    <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-md rounded border border-white/5">YouTube</span>
                  </div>
                </div>
                <div className="relative group/tip flex flex-col items-center">
                  <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-bg-secondary/50 rounded-xl hover:bg-bg-tertiary transition-all duration-300 border border-white/5 hover:border-accent/20">
                    <XIcon className="w-[21px] h-[21px] text-text-primary/90" />
                  </a>
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                    <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-md rounded border border-white/5">X / Twitter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Group: Platform, Legal, Support */}
            <div className="flex flex-col md:flex-row gap-12 lg:gap-4 pt-2">
              {/* Platform */}
              <div className="min-w-[110px]">
                <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-5 opacity-80">Platform</h4>
                <ul className="space-y-2 text-[13px] text-text-secondary font-medium">
                  <li><Link href="/" className="hover:text-accent transition-colors">Philosophy</Link></li>
                  <li><Link href="/ichimoku" className="hover:text-accent transition-colors">Ichimoku</Link></li>
                  <li><Link href="/tools" className="hover:text-accent transition-colors">Tools</Link></li>
                  <li><Link href="/education" className="hover:text-accent transition-colors">Resources</Link></li>
                  <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div className="min-w-[130px]">
                <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-5 opacity-80">Legal</h4>
                <ul className="space-y-2 text-[13px] text-text-secondary font-medium">
                  <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-accent transition-colors">Risk Disclaimer</Link></li>
                  <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link></li>
                  <li><Link href="/cookies" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div className="min-w-[130px]">
                <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-5 opacity-80">Support</h4>
                <ul className="space-y-2 text-[13px] text-text-secondary font-medium">
                  <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
                  <li><Link href="#" className="hover:text-accent transition-colors">Report an Issue</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Settings (Isolated Right) */}
          <div className="flex flex-col items-start pt-2 lg:translate-x-8">
            <div className="w-full lg:w-auto">
              <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-5 opacity-80">Settings</h4>
              <div className="grid grid-cols-[110px_1fr] gap-y-4 items-center">
                <span className="text-[10px] font-mono text-text-muted/50 uppercase tracking-widest whitespace-nowrap">Language</span>
                <div className="flex justify-start">
                  <LanguageSwitcher variant="minimal" />
                </div>
                
                <span className="text-[10px] font-mono text-text-muted/50 uppercase tracking-widest whitespace-nowrap">Display Mode</span>
                <div className="flex justify-start">
                  <FooterThemeSelector />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar - centered copyright only */}
        <div className="pt-6 border-t border-border flex flex-col items-center text-center text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] space-y-1">
          <p>2026 ICHIMOKU EDGE. ALL RIGHTS RESERVED.</p>
          <p>Educational tools only. Trading involves risk. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
