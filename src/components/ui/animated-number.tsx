import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // in seconds
  className?: string;
  format?: (val: number) => string;
}

export function AnimatedNumber({ value, duration = 1, className, format }: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration, damping: 30, stiffness: 200 });
  const display = useTransform(spring, latest => format ? format(latest) : latest.toLocaleString(undefined, { maximumFractionDigits: 2 }));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <motion.span className={className}>{display}</motion.span>
  );
} 