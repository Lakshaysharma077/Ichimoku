'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function SamuraiBackground() {
  const pathname = usePathname();
  
  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.03] dark:opacity-[0.05]">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] relative"
      >
        <img 
          src="/images/samurai.png" 
          alt="" 
          className="w-full h-full object-contain brightness-0 dark:invert"
        />
      </motion.div>
    </div>
  );
}
