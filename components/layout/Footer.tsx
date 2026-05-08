'use client';

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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/" className="flex flex-col mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-border/50 bg-bg-tertiary mb-6 shadow-2xl">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold syne tracking-tight text-text-primary" style={{ wordSpacing: '0.15em', letterSpacing: '0.02em' }}>
                  ICHIMOKU EDGE
                </span>
              </div>
              <span className="text-[10px] shippori-mincho text-text-muted mt-1">
                一目均衡表
              </span>
            </Link>
            <div className="flex gap-3">
              <div className="relative group/tip flex flex-col items-center">
                <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors border border-white/5">
                  <TradingViewIcon className="w-[18px] h-[18px]" />
                </a>
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-md rounded border border-white/5">TradingView</span>
                </div>
              </div>
              <div className="relative group/tip flex flex-col items-center">
                <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors border border-white/5">
                  <Youtube className="w-[18px] h-[18px]" />
                </a>
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-md rounded border border-white/5">YouTube</span>
                </div>
              </div>
              <div className="relative group/tip flex flex-col items-center">
                <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors border border-white/5">
                  <XIcon className="w-[18px] h-[18px]" />
                </a>
                <div className="absolute bottom-full mb-2 opacity-0 group-hover/tip:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover/tip:translate-y-0 pointer-events-none z-50">
                  <span className="text-[9px] whitespace-nowrap text-text-muted font-bold tracking-tighter uppercase px-1.5 py-0.5 bg-bg-primary/80 backdrop-blur-md rounded border border-white/5">X / Twitter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Platform</h4>
            <ul className="space-y-4 text-[13px] text-text-secondary">
              <li><Link href="/" className="hover:text-accent transition-colors">Philosophy</Link></li>
              <li><Link href="/ichimoku" className="hover:text-accent transition-colors">Ichimoku</Link></li>
              <li><Link href="/tools" className="hover:text-accent transition-colors">Tools</Link></li>
              <li><Link href="/education" className="hover:text-accent transition-colors">Resources</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Legal</h4>
            <ul className="space-y-4 text-[13px] text-text-secondary">
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-accent transition-colors">Risk Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Support</h4>
            <ul className="space-y-4 text-[13px] text-text-secondary">
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Report an Issue</Link></li>
            </ul>
          </div>

          {/* Settings */}
          <div className="flex flex-col items-start lg:col-start-5">
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Settings</h4>
            <div className="w-full space-y-4">
              <div className="flex flex-row items-center justify-between lg:justify-start lg:gap-8">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider whitespace-nowrap">Language</span>
                <LanguageSwitcher variant="minimal" />
              </div>
              <div className="flex flex-row items-center justify-between lg:justify-start lg:gap-4">
                <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider whitespace-nowrap">Display Mode</span>
                <FooterThemeSelector />
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
