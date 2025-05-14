import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
  blur?: 'sm' | 'md' | 'lg';
}

const glassCard = {
  initial: { 
    opacity: 0,
    backdropFilter: 'blur(0px)',
    y: 20
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(10px)',
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      mass: 0.2
    }
  },
  hover: {
    y: -5,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 200,
      mass: 0.2
    }
  }
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(({
  gradient = false,
  blur = 'md',
  className,
  children,
  ...props
}, ref) => {
  const blurStrength = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  return (
    <motion.div
      ref={ref}
      variants={glassCard}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={cn(
        'rounded-2xl overflow-hidden',
        'bg-white/10 dark:bg-gray-900/10',
        'border border-white/20 dark:border-gray-700/20',
        blurStrength[blur],
        gradient && 'bg-gradient-to-br from-white/20 to-white/5 dark:from-gray-900/20 dark:to-gray-900/5',
        'shadow-xl shadow-black/5',
        'transition-colors duration-300',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}); 