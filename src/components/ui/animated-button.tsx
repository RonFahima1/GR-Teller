import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'neu';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const buttonVariants = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100',
  outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
  neu: 'bg-gray-100 dark:bg-gray-800 shadow-neu-light dark:shadow-neu-dark hover:shadow-neu-light-pressed dark:hover:shadow-neu-dark-pressed'
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const buttonAnimation = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      variants={buttonAnimation}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      disabled={disabled || isLoading}
      className={cn(
        'relative rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        'flex items-center justify-center gap-2',
        variant === 'neu' && 'active:shadow-neu-light-pressed dark:active:shadow-neu-dark-pressed',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-5 h-5"
          >
            <svg className="animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <motion.span
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center"
            >
              {icon}
            </motion.span>
          )}
          <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
          {icon && iconPosition === 'right' && (
            <motion.span
              initial={{ x: 5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center"
            >
              {icon}
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
}); 