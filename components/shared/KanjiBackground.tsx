'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const KANJI_ELEMENTS = [
  { char: '均衡', top: '15%', left: '5%', size: '20vw', opacity: 0.03 },
  { char: '雲', top: '65%', right: '8%', size: '25vw', opacity: 0.02 },
  { char: '一目', top: '40%', left: '15%', size: '15vw', opacity: 0.025 },
  { char: '転換', top: '10%', right: '12%', size: '18vw', opacity: 0.015 },
  { char: '基準', top: '80%', left: '10%', size: '22vw', opacity: 0.02 },
];

export default function KanjiBackground() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none">
      {KANJI_ELEMENTS.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: element.opacity }}
          transition={{ duration: 2, delay: index * 0.3 }}
          className="absolute shippori-mincho whitespace-nowrap text-text-primary"
          style={{
            top: element.top,
            left: element.left,
            right: element.right,
            fontSize: element.size,
            filter: 'blur(1px)',
          }}
        >
          {element.char}
        </motion.div>
      ))}
    </div>
  );
}
