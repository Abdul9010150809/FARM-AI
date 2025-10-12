// src/components/AboutSection/StatItem.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import styles from './AboutSection.module.css';

interface StatItemProps {
  target: number;
  label: string;
  suffix?: string;
}

export const StatItem: React.FC<StatItemProps> = ({ target, label, suffix }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const count = useCountUp(isVisible ? target : 0, 2000);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Animate only once
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`col-6 col-md-3 text-center mb-4`}>
      <div className={styles.statNumber}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
};