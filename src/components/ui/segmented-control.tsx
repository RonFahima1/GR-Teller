import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const sizes = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg'
};

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  className
}: SegmentedControlProps) {
  const activeIndex = options.findIndex(option => option.value === value);

  return (
    <div
      className={cn(
        'relative inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg',
        fullWidth && 'w-full',
        sizes[size],
        className
      )}
    >
      {/* Background selector */}
      <motion.div
        className="absolute inset-1 bg-white dark:bg-gray-700 rounded-md shadow-sm"
        initial={false}
        animate={{
          x: `${(100 / options.length) * activeIndex}%`,
          width: `${100 / options.length}%`
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30
        }}
      />

      {/* Options */}
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'relative flex-1 flex items-center justify-center px-3',
            'font-medium rounded-md transition-colors duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            option.value === value
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
          style={{
            minWidth: fullWidth ? undefined : '80px',
            zIndex: 1
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
} 