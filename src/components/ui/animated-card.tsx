import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { scaleOnPress, aspectRatios } from '@/lib/animations';

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  ratio?: keyof typeof aspectRatios;
  variant?: 'default' | 'glass' | 'outline';
  isInteractive?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  ratio = 'card',
  variant = 'default',
  isInteractive = true,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 shadow-lg',
    glass: 'bg-white/10 backdrop-blur-xl border border-white/20',
    outline: 'border border-gray-200 dark:border-gray-700'
  };

  return (
    <motion.div
      initial="initial"
      whileHover={isInteractive ? "hover" : undefined}
      whileTap={isInteractive ? "pressed" : undefined}
      variants={isInteractive ? scaleOnPress : undefined}
      className={cn(
        'rounded-2xl overflow-hidden',
        variantStyles[variant],
        'transition-colors duration-200',
        className
      )}
      style={{
        aspectRatio: aspectRatios[ratio]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}; 