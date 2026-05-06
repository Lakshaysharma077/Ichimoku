'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const stats = [
  { value: 1200, label: 'Active Traders', suffix: '+' },
  { value: 12, label: 'Indicators & Scripts', suffix: '+' },
  { value: 4.9, label: 'TradingView Rating', suffix: '★' },
  { value: 14, label: 'Free Trial, No Card', suffix: ' Days' },
];

function Counter({ value, suffix }: { value: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = (end - start) / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="w-full bg-bg-secondary py-12 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center text-center px-8 ${
                i !== stats.length - 1 ? 'lg:border-r border-border' : ''
              }`}
            >
              <h3 className="syne font-bold text-3xl lg:text-4xl text-text-primary mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
