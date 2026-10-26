'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SamuraiIntro() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<'idle' | 'active' | 'exit' | 'done'>('idle');
  const [shouldRender, setShouldRender] = useState(false);
  const isSkippingRef = useRef(false);

  // Complete and remove overlay
  const handleComplete = useCallback(() => {
    setPhase('done');
    setShouldRender(false);
  }, []);

  // Instant skip triggered by Skip button or Esc/Space/Enter
  const handleSkip = useCallback(() => {
    if (isSkippingRef.current) return;
    isSkippingRef.current = true;
    setPhase('exit');
    setTimeout(handleComplete, 120);
  }, [handleComplete]);

  // Initial check on mount
  useEffect(() => {
    // Only show on home page '/' and never on admin pages
    if (pathname !== '/' || pathname.startsWith('/admin')) {
      setPhase('done');
      return;
    }

    // Respect prefers-reduced-motion
    const searchParams = new URLSearchParams(window.location.search);
    const forceReplay = searchParams.has('replay') || searchParams.has('intro');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceReplay) {
      setPhase('done');
      return;
    }

    // Preload logo image immediately
    const img = new Image();
    img.src = '/logo_crest.png';

    isSkippingRef.current = false;
    setPhase('active');
    setShouldRender(true);

    // Global replay helper for manual trigger
    const replayHandler = () => {
      isSkippingRef.current = false;
      setPhase('active');
      setShouldRender(true);
    };

    (window as any).replaySamuraiIntro = replayHandler;
    window.addEventListener('replay-intro', replayHandler);

    return () => {
      window.removeEventListener('replay-intro', replayHandler);
    };
  }, [pathname]);

  // Listen for intentional user key presses: Escape, Space, or Enter
  useEffect(() => {
    if (phase === 'done' || phase === 'idle' || !shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.isTrusted) return;
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, shouldRender, handleSkip]);

  // Auto-skip timer sequence:
  // 0.00s - 1.70s: Full, prominent, crystal-clear logo display with golden aura & katana glint (~1.7 seconds)
  // 1.70s - 2.05s: Smooth cinematic fade-out revealing homepage (0.35s)
  // 2.05s: Fully unmounted
  useEffect(() => {
    if (!shouldRender) return;

    // Begin fade-out at 1.70s so the logo is clearly seen, read, and appreciated
    const tExit = setTimeout(() => {
      if (!isSkippingRef.current) {
        setPhase('exit');
      }
    }, 1700);

    // Complete and unmount at 2.05s
    const tComplete = setTimeout(() => {
      handleComplete();
    }, 2050);

    return () => {
      clearTimeout(tExit);
      clearTimeout(tComplete);
    };
  }, [shouldRender, handleComplete]);

  if (!shouldRender || phase === 'done') {
    return null;
  }

  const isExiting = phase === 'exit';

  return (
    <AnimatePresence>
      <motion.div
        key="samurai-intro-overlay"
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{
          opacity: isExiting ? 0 : 1,
        }}
        transition={{
          duration: isSkippingRef.current ? 0.12 : 0.35,
          ease: 'easeOut',
        }}
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none ${
          isExiting ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{
          backgroundColor: '#0c101f',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #12182e 0%, #0c101f 70%, #060913 100%)',
        }}
      >
        {/* Japanese Atmospheric Kanji Calligraphy Watermarks */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 sm:px-16 md:px-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.045, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="shippori-mincho text-8xl sm:text-9xl md:text-[14rem] text-[#fbe178] leading-none select-none"
          >
            一目
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.045, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="shippori-mincho text-8xl sm:text-9xl md:text-[14rem] text-[#fbe178] leading-none select-none"
          >
            均衡
          </motion.div>
        </div>

        {/* Ambient Center Warm Gold Aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.85, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-[400px] h-[400px] sm:w-[560px] sm:h-[560px] rounded-full pointer-events-none blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(251, 225, 120, 0.35) 0%, rgba(251, 225, 120, 0.1) 45%, transparent 70%)',
          }}
        />

        {/* Katana-sharp Gold Horizon Accent Line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.25 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-[#fbe178] to-transparent"
          />
        </div>

        {/* Central Logo Stage - Large, Clear, and Bold */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 6 }}
          animate={{ opacity: 1, scale: 1.0, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Circular Logo Crest Frame */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(251,225,120,0.42)]">
            {/* Outer Gold Ring Border */}
            <div className="absolute inset-0 rounded-full border-2 border-[#fbe178]/80 shadow-[inset_0_0_20px_rgba(251,225,120,0.25)] pointer-events-none z-20" />

            {/* Official Ichimoku Edge Samurai Logo Emblem */}
            <div className="absolute inset-0 rounded-full overflow-hidden bg-[#0c101f] z-10 flex items-center justify-center">
              <img
                src="/logo_crest.png"
                alt="Ichimoku Edge Samurai Logo"
                loading="eager"
                className="w-full h-full object-cover scale-[1.05]"
                draggable={false}
              />
            </div>

            {/* Razor-sharp Katana Blade Light Sheen */}
            <motion.div
              initial={{ x: '-160%', opacity: 0 }}
              animate={{
                x: '170%',
                opacity: [0, 0.95, 0],
              }}
              transition={{
                duration: 0.65,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0 -skew-x-12 pointer-events-none z-30 bg-gradient-to-r from-transparent via-[#fbe178]/70 to-transparent w-[50%]"
            />
          </div>

          {/* Typography Beneath Crest - Bold and Legible */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="flex flex-col items-center mt-6 text-center pointer-events-none"
          >
            <h2 className="syne font-extrabold text-2xl sm:text-3xl tracking-[0.26em] text-[#fbe178] uppercase drop-shadow-[0_2px_18px_rgba(251,225,120,0.45)]">
              ICHIMOKU EDGE
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#fbe178]/70 to-transparent my-2.5" />
            <p className="font-mono text-[10px] sm:text-[11.5px] tracking-[0.35em] text-[#AFA27A] uppercase font-semibold">
              The Samurai Vision • 一目均衡
            </p>
          </motion.div>
        </motion.div>

        {/* Minimal Skip Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="absolute bottom-6 right-6 z-30 flex items-center gap-2"
        >
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#fbe178]/30 bg-[#111627]/80 hover:bg-[#111627] hover:border-[#fbe178]/60 backdrop-blur-md text-[10px] font-mono tracking-widest text-[#fbe178]/90 hover:text-[#fbe178] transition-all duration-200 cursor-pointer group shadow-lg"
            aria-label="Skip intro animation"
          >
            <span>SKIP</span>
            <span className="text-[9px] opacity-60 group-hover:opacity-100">[ESC / SPACE / ENTER]</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
