'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import EditableElement from '../admin/EditableElement';
import { useEditStore } from '@/lib/store/useEditStore';

function Counter({ value, suffix }: { value: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = Number(value) || 0;
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
      {Number.isInteger(Number(value)) ? Math.floor(Number(count)) : Number(count).toFixed(1)}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  const stats = useContent('stats');
  const { isEditMode } = useEditStore();
  return (
    <section className="w-full py-12 border-y border-border/30 bg-bg-primary/20 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {Array.isArray(stats) && stats.map((stat, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center justify-center text-center px-8 ${
                i !== stats.length - 1 ? 'lg:border-r border-border' : ''
              }`}
            >
              <h3 className="syne font-bold text-3xl lg:text-4xl text-text-primary mb-2">
                {!isEditMode ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <div className="flex items-baseline">
                    <EditableElement section="stats" path={[i.toString(), 'value']} content={stat.value.toString()} />
                    <EditableElement section="stats" path={[i.toString(), 'suffix']} content={stat.suffix || ''} />
                  </div>
                )}
              </h3>
              <span className="txt-label tracking-[0.2em]">
                <EditableElement section="stats" path={[i.toString(), 'label']} content={stat.label} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
