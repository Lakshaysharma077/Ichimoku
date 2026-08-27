'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Lock,
  Unlock,
  Star,
  LineChart,
  Layers,
  Sparkles,
  BookOpen,
  HelpCircle,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Pencil,
  Eye,
  TrendingUp,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import IndicatorModal from '@/components/tools/IndicatorModal';
import { IndicatorData } from '@/components/tools/IndicatorCard';

interface ScreenshotItem {
  url: string;
  title?: string;
  caption?: string;
}

export default function IndicatorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const [indicator, setIndicator] = useState<IndicatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [accessProfile, setAccessProfile] = useState<any>({ canAccessPremium: false });

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Admin Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchIndicator = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/indicators/${slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Indicator not found");
        throw new Error("Failed to load indicator details");
      }
      const data = await res.json();
      setIndicator(data.indicator);
    } catch (err: any) {
      setError(err.message || "Failed to load indicator");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchIndicator();
    }
  }, [slug, fetchIndicator]);

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === 'ADMIN') {
        setAccessProfile({ canAccessPremium: true, accessLevel: 'Admin' });
      } else {
        fetch('/api/user/profile')
          .then((r) => r.json())
          .then((data) => {
            if (data.accessProfile) {
              setAccessProfile(data.accessProfile);
            }
          })
          .catch(() => {});
      }
    }
  }, [session]);

  // Parse screenshots and features
  const screenshotsList: ScreenshotItem[] = typeof indicator?.screenshots === 'string'
    ? (() => {
        try {
          const parsed = JSON.parse(indicator.screenshots);
          return Array.isArray(parsed)
            ? parsed.map((item) => (typeof item === 'string' ? { url: item } : item))
            : [];
        } catch {
          return indicator.screenshots ? [{ url: indicator.screenshots }] : [];
        }
      })()
    : Array.isArray(indicator?.screenshots)
    ? indicator.screenshots
    : [];

  const featuresList: string[] = typeof indicator?.features === 'string'
    ? (() => {
        try {
          const parsed = JSON.parse(indicator.features);
          return Array.isArray(parsed) ? parsed : [indicator.features];
        } catch {
          return indicator.features.split('\n').filter(Boolean);
        }
      })()
    : Array.isArray(indicator?.features)
    ? indicator.features
    : [];

  const categoriesList: string[] = typeof indicator?.category === 'string'
    ? (() => {
        try {
          return JSON.parse(indicator.category);
        } catch {
          return [indicator.category];
        }
      })()
    : indicator?.category || [];

  const status = indicator?.accessStatus || 'Premium';
  const isUnlocked = status === 'Free' || accessProfile.canAccessPremium || isAdmin;

  // Build list of valid navigation sections based on non-empty content
  const navSections = [
    { id: 'overview', label: 'Overview', show: Boolean(indicator?.overview || indicator?.description) },
    { id: 'screenshots', label: 'Screenshots', show: screenshotsList.length > 0 },
    { id: 'how-it-works', label: 'How It Works', show: Boolean(indicator?.howItWorks) },
    { id: 'features', label: 'Features', show: featuresList.length > 0 },
    { id: 'how-to-use', label: 'How To Use', show: Boolean(indicator?.howToUse) },
    { id: 'tradingview', label: 'TradingView Access', show: true },
  ].filter((s) => s.show);

  // Scroll spy effect to highlight active sidebar section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const section of navSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navSections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 110;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    if (screenshotsList.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % screenshotsList.length);
  };

  const prevLightboxImage = () => {
    if (screenshotsList.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + screenshotsList.length) % screenshotsList.length);
  };

  const handleSaveIndicator = async (payload: Partial<IndicatorData>) => {
    const res = await fetch("/api/indicators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: indicator?.id, ...payload }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || "Failed to update indicator");
    }
    await fetchIndicator();
  };

  if (loading) {
    return (
      <div className="pt-40 pb-24 min-h-[100svh] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
            Loading indicator documentation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !indicator) {
    return (
      <div className="pt-40 pb-24 min-h-[100svh] max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 rounded-2xl bg-bg-secondary/60 border border-border space-y-4">
          <Info className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="syne font-bold text-2xl text-text-primary">Indicator Not Found</h2>
          <p className="text-sm text-text-secondary">
            {error || "The indicator or tool you requested could not be located."}
          </p>
          <div className="pt-4">
            <Link href="/tools">
              <Button size="sm" variant="solid" className="flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Tools Suite</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-[100svh] relative overflow-hidden bg-bg-primary">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Top Breadcrumb Navigation & Admin Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-border/60 pb-4">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Indicators & Tools</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1.5 font-mono text-xs shadow-[0_0_15px_rgba(251,225,120,0.25)]"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Indicator in Admin</span>
              </Button>
            )}

            {indicator.tvUrl && (
              <a
                href={indicator.tvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-text-secondary hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                <span>TradingView Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Hero Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={status === 'Free' ? 'green' : status === 'Premium' ? 'amber' : 'blue'}>
              {status.toUpperCase()}
            </Badge>

            {status === 'Premium' && !isUnlocked && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>SUBSCRIBER ACCESS ONLY</span>
              </span>
            )}
            {status === 'Premium' && isUnlocked && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" />
                <span>UNLOCKED</span>
              </span>
            )}

            <div className="text-[11px] font-mono text-text-muted flex items-center gap-2">
              <span>•</span>
              <span>{categoriesList.join(' · ')}</span>
            </div>
          </div>

          <h1 className="syne font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary uppercase tracking-tight leading-[1.05] mb-4">
            {indicator.name}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed mb-6">
            {indicator.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-text-muted">
            <div className="flex items-center gap-1.5 text-[#fbe178]">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(indicator.rating || 5) ? 'fill-current' : 'opacity-30'}`} />
                ))}
              </div>
              <span className="font-bold text-text-primary">
                {indicator.rating?.toFixed(1) || "5.0"}
              </span>
              <span className="text-text-muted">({indicator.numRatings || 72} TradingView Boosts / Ratings)</span>
            </div>

            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-accent" />
              <span>Pine Script v5 (TradingView Official)</span>
            </div>

            <div className="flex items-center gap-2 font-bold text-text-primary">
              <span className="px-2 py-0.5 bg-bg-secondary rounded border border-border">
                {indicator.priceLabel || (status === 'Free' ? 'Free Access' : '$22/mo')}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bar Navigation */}
        <div className="lg:hidden sticky top-20 z-30 mb-8 -mx-4 px-4 py-2.5 bg-bg-primary/95 backdrop-blur-md border-y border-border overflow-x-auto no-scrollbar flex items-center gap-2">
          {navSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? 'bg-accent text-bg-primary font-bold shadow-sm'
                  : 'bg-bg-secondary/60 text-text-secondary hover:text-text-primary'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Desktop Layout: Sticky Left Sidebar + Right Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sidebar Menu (Sticky on Desktop) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <Card className="p-4 bg-bg-secondary/60 border-border/80 backdrop-blur-md">
              <div className="text-[11px] font-mono uppercase text-accent font-bold tracking-widest px-3 py-2 border-b border-border/50 mb-2">
                Documentation Navigation
              </div>

              <nav className="space-y-1">
                {navSections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-mono uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-accent/15 text-accent font-bold border border-accent/40 shadow-[0_0_12px_rgba(251,225,120,0.15)]'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary/60'
                      }`}
                    >
                      <span>{sec.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Action Widget */}
              <div className="mt-6 pt-4 border-t border-border/60 space-y-3">
                <div className="text-[11px] font-mono text-text-muted">
                  Access Status: <strong className="text-text-primary">{status}</strong>
                </div>

                {isUnlocked ? (
                  <a
                    href={indicator.tvUrl || "https://www.tradingview.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button size="sm" variant="solid" className="w-full flex items-center justify-center gap-2 font-mono text-xs">
                      <span>Access on TradingView</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                ) : (
                  <Link href="/pricing" className="block w-full">
                    <Button size="sm" variant="solid" className="w-full flex items-center justify-center gap-2 font-mono text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock with Pro Subscription</span>
                    </Button>
                  </Link>
                )}
              </div>
            </Card>

            {/* Quick Specs Card */}
            <Card className="p-4 bg-bg-secondary/40 border-border/60 text-xs font-mono space-y-2.5">
              <div className="text-[10px] uppercase text-text-muted tracking-widest font-bold">
                Indicator Specifications
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 text-text-secondary">
                <span>Platform:</span>
                <span className="text-text-primary font-bold">TradingView</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 text-text-secondary">
                <span>Language:</span>
                <span className="text-text-primary font-bold">Pine Script v5</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40 text-text-secondary">
                <span>Calculations:</span>
                <span className="text-text-primary font-bold">Classic + Equilibrium</span>
              </div>
              <div className="flex justify-between py-1 text-text-secondary">
                <span>Publisher:</span>
                <span className="text-accent font-bold">IchimokuEdge</span>
              </div>
            </Card>
          </div>

          {/* Right Main Content Pane */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. Screenshots Showcase Section */}
            {screenshotsList.length > 0 && (
              <section id="screenshots" className="scroll-mt-32 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-bold tracking-wider">
                    <Eye className="w-4 h-4" />
                    <span>Visual High-Resolution Charts</span>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">
                    Click any chart to zoom full-screen
                  </span>
                </div>

                {/* Primary Large Screenshot */}
                <div 
                  onClick={() => openLightbox(0)}
                  className="relative group rounded-2xl overflow-hidden border border-border/80 bg-bg-secondary/60 cursor-zoom-in transition-all duration-300 hover:border-accent/50 shadow-2xl"
                >
                  <div className="relative w-full aspect-[16/9] min-h-[280px] sm:min-h-[420px]">
                    <Image
                      src={screenshotsList[0].url}
                      alt={screenshotsList[0].title || indicator.name}
                      fill
                      priority
                      className="object-contain object-center bg-black/40 group-hover:scale-[1.01] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                      <div>
                        <h4 className="syne font-bold text-base text-white">
                          {screenshotsList[0].title || indicator.name}
                        </h4>
                        {screenshotsList[0].caption && (
                          <p className="text-xs text-text-secondary mt-1 max-w-xl">
                            {screenshotsList[0].caption}
                          </p>
                        )}
                      </div>
                      <span className="p-2.5 rounded-xl bg-accent text-bg-primary font-bold text-xs flex items-center gap-1.5 shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                        <span>Enlarge Chart</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Screenshots Grid if > 1 */}
                {screenshotsList.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {screenshotsList.slice(1).map((shot, idx) => (
                      <div
                        key={idx + 1}
                        onClick={() => openLightbox(idx + 1)}
                        className="group relative rounded-xl overflow-hidden border border-border/60 bg-bg-secondary/40 cursor-zoom-in hover:border-accent/40 transition-all shadow-md"
                      >
                        <div className="relative w-full aspect-[16/10]">
                          <Image
                            src={shot.url}
                            alt={shot.title || `Screenshot ${idx + 2}`}
                            fill
                            className="object-contain bg-black/30 group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 400px"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-lg bg-bg-primary/90 text-accent text-xs font-mono font-bold flex items-center gap-1.5 border border-border">
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>View Full Size</span>
                            </span>
                          </div>
                        </div>
                        {shot.title && (
                          <div className="p-3 border-t border-border/40">
                            <p className="text-xs font-bold text-text-primary truncate">{shot.title}</p>
                            {shot.caption && (
                              <p className="text-[10px] text-text-muted truncate mt-0.5">{shot.caption}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 2. Overview Section */}
            {(indicator.overview || indicator.description) && (
              <section id="overview" className="scroll-mt-32 space-y-4">
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-bold tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Overview & Indicator Purpose</span>
                </div>

                <Card className="p-6 sm:p-8 bg-bg-secondary/40 border-border/80 space-y-4 leading-relaxed">
                  <h2 className="syne font-bold text-2xl text-text-primary">
                    About {indicator.name}
                  </h2>

                  <div className="text-sm sm:text-base text-text-secondary space-y-4 whitespace-pre-line leading-relaxed">
                    {indicator.overview || indicator.description}
                  </div>
                </Card>
              </section>
            )}

            {/* 3. How It Works Section */}
            {indicator.howItWorks && (
              <section id="how-it-works" className="scroll-mt-32 space-y-4">
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-bold tracking-wider">
                  <Layers className="w-4 h-4" />
                  <span>Architecture & Calculation Model</span>
                </div>

                <Card className="p-6 sm:p-8 bg-bg-secondary/40 border-border/80 space-y-6">
                  <h2 className="syne font-bold text-2xl text-text-primary">
                    How It Works
                  </h2>

                  <div className="text-sm sm:text-base text-text-secondary space-y-4 whitespace-pre-line leading-relaxed">
                    {indicator.howItWorks}
                  </div>
                </Card>
              </section>
            )}

            {/* 4. Features Section */}
            {featuresList.length > 0 && (
              <section id="features" className="scroll-mt-32 space-y-4">
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-bold tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Engineered Capabilities</span>
                </div>

                <Card className="p-6 sm:p-8 bg-bg-secondary/40 border-border/80 space-y-6">
                  <h2 className="syne font-bold text-2xl text-text-primary">
                    Key Features
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {featuresList.map((feat, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-bg-primary/60 border border-border/60 flex items-start gap-3 hover:border-accent/30 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* 5. How To Use Section */}
            {indicator.howToUse && (
              <section id="how-to-use" className="scroll-mt-32 space-y-4">
                <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-bold tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Trader&apos;s Guide & Instructions</span>
                </div>

                <Card className="p-6 sm:p-8 bg-bg-secondary/40 border-border/80 space-y-6">
                  <h2 className="syne font-bold text-2xl text-text-primary">
                    How To Use On TradingView
                  </h2>

                  <div className="text-sm sm:text-base text-text-secondary space-y-4 whitespace-pre-line leading-relaxed">
                    {indicator.howToUse}
                  </div>
                </Card>
              </section>
            )}

            {/* 6. TradingView Access & Gating Section */}
            <section id="tradingview" className="scroll-mt-32 space-y-4">
              <div className="flex items-center gap-2 text-accent font-mono text-xs uppercase font-bold tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>TradingView Script Access</span>
              </div>

              {isUnlocked ? (
                <Card className="p-8 bg-gradient-to-br from-bg-secondary via-[#0F172A] to-bg-secondary border-accent/40 shadow-[0_0_30px_rgba(251,225,120,0.08)] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                        <Unlock className="w-3.5 h-3.5" />
                        Access Granted
                      </span>
                      <h3 className="syne font-extrabold text-2xl text-text-primary uppercase">
                        Add to Your TradingView Charts
                      </h3>
                      <p className="text-sm text-text-secondary mt-1 max-w-xl">
                        Open the official script on TradingView, add it to your favorite indicators, and apply it directly to your trading charts.
                      </p>
                    </div>

                    <a
                      href={indicator.tvUrl || "https://www.tradingview.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button size="lg" variant="solid" className="flex items-center gap-2 font-mono text-sm shadow-[0_0_20px_rgba(251,225,120,0.3)]">
                        <span>Open on TradingView</span>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 bg-gradient-to-br from-amber-500/10 via-bg-secondary to-bg-secondary border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.08)] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Premium Subscriber Access
                      </span>
                      <h3 className="syne font-extrabold text-2xl text-text-primary uppercase">
                        Unlock {indicator.name}
                      </h3>
                      <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
                        This institutional Pine Script v5 indicator is included in all active Ichimoku Edge subscriptions. Start with a 7-day trial or upgrade to full access to unlock immediately.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5 shrink-0">
                      <Link href="/pricing">
                        <Button size="lg" variant="solid" className="w-full flex items-center justify-center gap-2 font-mono text-sm">
                          <span>Start 7-Day Free Trial</span>
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href="/pricing" className="text-center text-[11px] font-mono text-text-muted hover:text-accent transition-colors">
                        View all subscription plans →
                      </Link>
                    </div>
                  </div>
                </Card>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Full-Screen Zoomable Lightbox Modal */}
      {lightboxOpen && screenshotsList.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between z-10">
            <div>
              <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider block">
                {indicator.name} • Full Resolution View ({currentImageIndex + 1} / {screenshotsList.length})
              </span>
              <h3 className="syne font-bold text-lg text-white">
                {screenshotsList[currentImageIndex]?.title || "High-Resolution Chart Analysis"}
              </h3>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="Close full-screen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Image Container */}
          <div className="relative flex-1 flex items-center justify-center my-4">
            {screenshotsList.length > 1 && (
              <button
                onClick={prevLightboxImage}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-accent hover:text-bg-primary transition-all border border-white/10"
                title="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-full max-h-[82vh] flex items-center justify-center">
              <Image
                src={screenshotsList[currentImageIndex]?.url}
                alt={screenshotsList[currentImageIndex]?.title || "Screenshot"}
                fill
                className="object-contain select-none"
                sizes="100vw"
                priority
              />
            </div>

            {screenshotsList.length > 1 && (
              <button
                onClick={nextLightboxImage}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-accent hover:text-bg-primary transition-all border border-white/10"
                title="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Caption */}
          <div className="text-center z-10 max-w-3xl mx-auto">
            {screenshotsList[currentImageIndex]?.caption && (
              <p className="text-xs sm:text-sm text-text-secondary bg-black/60 px-4 py-2 rounded-xl border border-white/10">
                {screenshotsList[currentImageIndex]?.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {isAdmin && (
        <IndicatorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveIndicator}
          initialData={indicator}
        />
      )}
    </div>
  );
}
