'use client';

import { motion } from 'framer-motion';
import KanjiWatermark from '../shared/KanjiWatermark';

export default function IchimokuHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid & Cloud Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-[#fbe178]/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex flex-col items-center"
        >
          <span className="shippori-mincho text-accent text-xl lg:text-2xl mb-4 tracking-[0.2em]">一目均衡表</span>
          <h1 className="syne font-extrabold text-text-primary leading-[1.2] lg:leading-[0.85] uppercase">
            <span className="block text-[clamp(3rem,10vw,7rem)] mb-2 lg:mb-0">ICHIMOKU</span>
            <span className="block text-[clamp(2.5rem,8vw,6rem)] text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-accent to-text-primary">KINKŌ HYŌ</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="syne font-bold text-xl lg:text-3xl text-text-muted mb-8"
        >
          See Market Balance at a Glance
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-lg txt-body leading-relaxed">
            A comprehensive institutional framework designed to define trend direction, 
            gauge momentum, and reveal the hidden equilibrium of price and time.
          </p>
        </motion.div>
        
        {/* Animated Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100px" }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="h-1 bg-accent mx-auto mt-12 rounded-full shadow-[0_0_15px_rgba(251,225,120,0.5)]"
        />
      </div>

      {/* Decorative Watermark */}
      <KanjiWatermark kanji="雲" className="bottom-[-10%] left-[-5%] opacity-[0.03]" size="40vw" />
    </section>
  );
}
