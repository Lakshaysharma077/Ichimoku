'use client';

import { useThemeStore } from '@/store/themeStore';
import { motion } from 'framer-motion';

export default function TradingViewIndicator() {
  const { theme } = useThemeStore();

  const getFilter = () => {
    switch (theme) {
      case 'signature':
        // Deep black/midnight background with high contrast lines
        return 'invert(1) hue-rotate(180deg) contrast(1.2) brightness(0.9)';
      case 'dark':
        return 'invert(0.9) hue-rotate(180deg) contrast(1.1)';
      default:
        return 'none';
    }
  };

  return (
    <div className="relative group perspective-1000">
      <motion.div
        animate={{ filter: getFilter() }}
        whileHover={{ 
          scale: 1.02,
          rotateY: 2,
          rotateX: -1,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
        }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          filter: { duration: 0.5 }
        }}
        className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black ring-1 ring-white/5"
      >
        {/* Professional Gloss/Shine Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 z-0 p-[1px] bg-gradient-to-br from-accent/50 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <img 
          src="/chart-preview.png" 
          alt="Ichimoku Edge TradingView Indicator" 
          className="w-full h-auto object-cover relative z-0"
        />

        {/* Hover Scanning Light Effect */}
        <div className="absolute inset-0 z-20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />


        {/* Professional Floating Badge - Now Inside to prevent clipping */}
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-4 right-4 z-30 bg-[#fbe178] text-[#0c101f] px-4 py-1.5 rounded-full text-[10px] font-bold syne uppercase tracking-[0.15em] shadow-xl border border-white/20"
        >
          Live Indicator Preview
        </motion.div>
      </motion.div>
    </div>
  );
}
