import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/app-router";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  className?: string;
}

const spinTransition = {
  repeat: Infinity,
  ease: "linear",
  duration: 1
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={cn(sizeClasses[size], colorClasses[color])}
        role="status"
        animate={{ rotate: 360 }}
        transition={spinTransition}
      >
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <motion.circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <motion.path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            animate={{ rotate: 360 }}
            transition={spinTransition}
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </motion.div>
    </div>
  );
};

export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  blur?: boolean;
}> = ({ isLoading, children, blur = true }) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "absolute inset-0 flex items-center justify-center z-50",
          blur ? "backdrop-blur-sm bg-white/50 dark:bg-gray-900/50" : "bg-white/80 dark:bg-gray-900/80"
        )}
      >
        <LoadingSpinner size="lg" />
      </motion.div>
      <div className="opacity-50 pointer-events-none">{children}</div>
    </div>
  );
}; 