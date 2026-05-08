'use client';

import Link from 'next/link';
import { Youtube } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import FooterThemeSelector from '../ui/FooterThemeSelector';
import XIcon from '../ui/XIcon';
import TradingViewIcon from '../ui/TradingViewIcon';

export default function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          {/* Left grouped columns */}
          <div className="flex flex-col md:flex-row flex-wrap gap-12 lg:gap-16 xl:gap-24">
            {/* Brand */}
            <div className="max-w-xs">
              <Link href="/" className="flex flex-col mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border/50 bg-bg-tertiary mb-4 shadow-xl">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-extrabold syne tracking-tight text-text-primary" style={{ wordSpacing: '0.15em', letterSpacing: '0.02em' }}>
                    ICHIMOKU EDGE
                  </span>
                </div>
                <span className="text-[10px] shippori-mincho text-text-muted">
                  一目均衡表
                </span>
              </Link>
              <div className="flex gap-4">
                <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors">
                  <TradingViewIcon className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors">
                  <XIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Platform</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
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
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-accent transition-colors">Risks Disclaimer</Link></li>
                <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Support</h4>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-accent transition-colors">Report an Issue</Link></li>
              </ul>
            </div>
          </div>

          {/* Right aligned Settings */}
          <div className="lg:w-64">
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6 lg:text-right">Settings</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-2 lg:items-end">
                <span className="text-sm text-text-secondary">Language</span>
                <LanguageSwitcher />
              </div>
              <div className="flex flex-col gap-2 lg:items-end">
                <span className="text-sm text-text-secondary">Display Mode</span>
                <FooterThemeSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar - centered copyright only */}
        <div className="pt-8 border-t border-border flex flex-col items-center text-center text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] space-y-2">
          <p>2026 ICHIMOKU EDGE. ALL RIGHTS RESERVED.</p>
          <p>Educational tools only. Trading involves risk. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
