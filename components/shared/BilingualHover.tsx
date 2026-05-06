'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface BilingualHoverProps {
  english: string;
  japanese: string;
  className?: string;
}

export default function BilingualHover({ english, japanese, className = '' }: BilingualHoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative cursor-help inline-block font-bold ${className}`}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.span
            key="english"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            {english}
          </motion.span>
        ) : (
          <motion.span
            key="japanese"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="shippori-mincho text-accent inline-block"
          >
            {japanese}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
