import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { iosPress } from '@/lib/animations';

type IOSButtonProps = HTMLMotionProps<"button"> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
};

export const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      ref={ref}
      variants={iosPress}
      initial="initial"
      whileHover="hover"
      whileTap="pressed"
      disabled={disabled || isLoading}
      className={cn(
        'rounded-lg font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        'flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
        />
      ) : icon ? (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="flex items-center"
        >
          {icon}
        </motion.div>
      ) : null}
      {children}
    </motion.button>
  );
}); 