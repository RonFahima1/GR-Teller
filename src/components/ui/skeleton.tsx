import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps extends HTMLMotionProps<"div"> {
  variant?: 'card' | 'text' | 'avatar' | 'button';
  animate?: boolean;
}

const variants = {
  card: 'rounded-lg h-[200px]',
  text: 'h-4 rounded',
  avatar: 'rounded-full h-12 w-12',
  button: 'rounded-lg h-10'
};

const shimmer = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'linear',
    },
  },
};

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({
  className,
  variant = 'text',
  animate = true,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={shimmer}
      initial="initial"
      animate={animate ? "animate" : "initial"}
      className={cn(
        'relative overflow-hidden bg-gray-200 dark:bg-gray-800',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        variants[variant],
        className
      )}
      style={{
        backgroundSize: '200% 100%',
      }}
      {...props}
    />
  );
});

interface SkeletonGroupProps {
  count?: number;
  gap?: number;
  variant?: SkeletonProps['variant'];
  className?: string;
}

export function SkeletonGroup({
  count = 3,
  gap = 4,
  variant = 'text',
  className
}: SkeletonGroupProps) {
  return (
    <div
      className={cn('space-y-4', className)}
      style={{ gap: `${gap * 0.25}rem` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className="w-full"
          style={{
            opacity: 1 - (i * 0.1),
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  );
}
