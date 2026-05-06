'use client';

import { motion } from 'framer-motion';

interface KanjiWatermarkProps {
  kanji: string;
  className?: string;
  opacity?: number;
  size?: string;
}

export default function KanjiWatermark({ 
  kanji, 
  className = '', 
  opacity = 0.05, 
  size = '40vw' 
}: KanjiWatermarkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`absolute kanji-watermark shippori-mincho whitespace-nowrap overflow-hidden flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ fontSize: size }}
    >
      {kanji}
    </motion.div>
  );
}
