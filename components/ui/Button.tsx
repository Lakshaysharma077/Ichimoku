'use client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  className,
  variant = 'solid',
  size = 'md',
  onAnimationStart: _onAnimationStart,
  ...props
}: ButtonProps) {
  const variants = {
    solid: 'bg-accent text-bg-primary hover:opacity-90',
    outline: 'border border-border text-text-primary hover:bg-bg-secondary',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm font-semibold',
    lg: 'px-8 py-3.5 text-base font-bold',
  };

  return (
    <motion.button
      whileHover={{ 
        y: -3,
        boxShadow: "0 10px 20px -10px rgba(0,0,0,0.5)"
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center rounded-sm transition-all duration-300 syne uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
