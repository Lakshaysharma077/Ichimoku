'use client';

import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-bg-secondary border border-border rounded-lg overflow-hidden',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
