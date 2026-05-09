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

        <div className="flex flex-col lg:flex-row justify-between items-stretch gap-12 mb-20">
          {/* Left Group: Brand + Nav Links */}
          <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
            {/* Brand & Socials — flex-col with flex-1 spacer pushes icons to bottom */}
            <div className="flex flex-col min-w-[160px]">
              <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-6 opacity-80">
                Ichimoku Edge
              </h4>

              <Link href="/" className="flex flex-col items-start mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-border/50 bg-bg-tertiary shadow-2xl transition-transform duration-500 hover:scale-105">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                </div>
              </Link>

              {/* This spacer grows to fill available height, pushing icons to bottom */}
              <div className="flex-1" />

              {/* Icons now sit at the same level as Pricing / Cookie Policy */}
              <div className="flex items-center gap-3 mt-auto pb-2.5">
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

            {/* Platform */}
            <div className="flex flex-col">
              <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-6 opacity-80">
                Platform
              </h4>
              <ul className="space-y-1.5 text-[13px] text-text-secondary font-medium">
                <li><Link href="/" className="hover:text-accent transition-colors">Philosophy</Link></li>
                <li><Link href="/ichimoku" className="hover:text-accent transition-colors">Ichimoku</Link></li>
                <li><Link href="/tools" className="hover:text-accent transition-colors">Tools</Link></li>
                <li><Link href="/education" className="hover:text-accent transition-colors">Resources</Link></li>
                <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col">
              <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-6 opacity-80">
                Legal
              </h4>
              <ul className="space-y-1.5 text-[13px] text-text-secondary font-medium">
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-accent transition-colors">Risk Disclaimer</Link></li>
                <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col">
              <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-6 opacity-80">
                Support
              </h4>
              <ul className="space-y-1.5 text-[13px] text-text-secondary font-medium">
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Report an Issue</Link></li>
              </ul>
            </div>
          </div>

          {/* Settings */}
          <div className="flex flex-col">
            <h4 className="syne font-bold text-[11px] uppercase tracking-[0.2em] text-text-primary mb-6 opacity-80">
              Settings
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[13px] text-text-secondary font-medium">Language</span>
                <div className="flex justify-start -ml-1">
                  <LanguageSwitcher variant="minimal" />
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
        <div className="pt-6 border-t border-border flex flex-col items-center text-center text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] space-y-1">
          <p>2026 ICHIMOKU EDGE. ALL RIGHTS RESERVED.</p>
          <p>Educational tools only. Trading involves risk. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}