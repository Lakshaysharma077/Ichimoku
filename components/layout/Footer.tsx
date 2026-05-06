'use client';

import Link from 'next/link';
import { Youtube, Twitter, LineChart } from 'lucide-react';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import XIcon from '../ui/XIcon';

export default function Footer() {
  return (
    <footer className="bg-bg-primary border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex flex-col mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border/50 bg-bg-tertiary mb-4 shadow-xl">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold syne tracking-tighter text-text-primary">
                  ICHIMOKU EDGE
                </span>
              </div>
              <span className="text-[10px] shippori-mincho text-text-muted">
                「一目均衡表」
              </span>
            </Link>
            <div className="shippori-mincho text-text-secondary text-sm space-y-1 mb-6">
              <p>"Mastery through Discipline"</p>
              <p>「規律を通じた熟達」</p>
            </div>
            <div className="flex gap-4">
              <a href="https://www.youtube.com/@IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://x.com/IchimokuEdge" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors">
                <XIcon className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.tradingview.com/u/IchimokuEdge/" target="_blank" rel="noopener noreferrer" className="p-2 bg-bg-secondary rounded-full hover:bg-bg-tertiary transition-colors">
                <LineChart className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="/" className="hover:text-accent transition-colors">Philosophy</Link></li>
              <li><Link href="/ichimoku" className="hover:text-accent transition-colors">Ichimoku Kinkō Hyō</Link></li>
              <li><Link href="/tools" className="hover:text-accent transition-colors">Tools</Link></li>
              <li><Link href="/education" className="hover:text-accent transition-colors">Education</Link></li>
              <li><Link href="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Discord Community</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">TradingView Profile</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Status Page</Link></li>
            </ul>
          </div>

          {/* Controls */}
          <div>
            <h4 className="syne font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Settings</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-text-muted uppercase">Language</span>
                <LanguageSwitcher />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-text-muted uppercase">Theme</span>
                <ThemeToggle />
              </div>
              <p className="text-xs text-text-muted leading-relaxed italic">
                Built for disciplined traders worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-text-muted uppercase tracking-widest">
          <p>© 2024 Ichimoku Edge. All rights reserved.</p>
          <p>🇨🇦 Canada — Billed in CAD</p>
          <div className="flex items-center gap-4">
            <span>Payments by Stripe & Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
