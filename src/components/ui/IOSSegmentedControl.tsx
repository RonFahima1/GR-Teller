import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SegmentOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface IOSSegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'subtle' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

export const IOSSegmentedControl: React.FC<IOSSegmentedControlProps> = ({
  options,
  value,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 });
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  
  // Size variants
  const sizeVariants = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4'
  };
  
  // Style variants
  const styleVariants = {
    default: {
      container: 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      indicator: 'bg-white dark:bg-gray-700 shadow-sm',
      option: {
        active: 'text-gray-900 dark:text-white',
        inactive: 'text-gray-500 dark:text-gray-400',
        hover: 'hover:text-gray-700 dark:hover:text-gray-300'
      }
    },
    subtle: {
      container: 'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800',
      indicator: 'bg-white/80 dark:bg-gray-800 shadow-sm',
      option: {
        active: 'text-gray-900 dark:text-white',
        inactive: 'text-gray-400 dark:text-gray-500',
        hover: 'hover:text-gray-700 dark:hover:text-gray-300'
      }
    },
    pill: {
      container: 'bg-transparent',
      indicator: 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800',
      option: {
        active: 'text-blue-600 dark:text-blue-400',
        inactive: 'text-gray-500 dark:text-gray-400',
        hover: 'hover:text-blue-500 dark:hover:text-blue-300'
      }
    }
  };
  
  const selectedVariant = styleVariants[variant];
  
  // Calculate indicator position and dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const activeIndex = options.findIndex(option => option.id === value);
    if (activeIndex === -1) return;
    
    const optionElements = container.querySelectorAll('[data-segment-option]');
    if (!optionElements.length || !optionElements[activeIndex]) return;
    
    const activeElement = optionElements[activeIndex] as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    
    setDimensions({
      width: activeRect.width,
      left: activeRect.left - containerRect.left
    });
  }, [value, options, containerRef, size]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Recalculate dimensions on resize
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const activeIndex = options.findIndex(option => option.id === value);
      if (activeIndex === -1) return;
      
      const optionElements = container.querySelectorAll('[data-segment-option]');
      if (!optionElements.length || !optionElements[activeIndex]) return;
      
      const activeElement = optionElements[activeIndex] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      setDimensions({
        width: activeRect.width,
        left: activeRect.left - containerRect.left
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [value, options]);
  
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex rounded-lg overflow-hidden transition-all duration-200',
        selectedVariant.container,
        fullWidth ? 'w-full' : 'w-fit',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Sliding indicator */}
      {dimensions.width > 0 && (
        <motion.div
          className={cn(
            'absolute top-1 bottom-1 rounded-md transition-colors',
            selectedVariant.indicator
          )}
          initial={false}
          animate={{
            width: dimensions.width - (variant === 'pill' ? 6 : 4),
            left: dimensions.left + (variant === 'pill' ? 3 : 2),
            opacity: 1
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
            mass: 1
          }}
        />
      )}
      
      {/* Options */}
      {options.map((option) => {
        const isActive = option.id === value;
        const isHovered = option.id === hoveredOption;
        
        return (
          <motion.button
            key={option.id}
            data-segment-option
            className={cn(
              'relative z-10 flex items-center justify-center transition-colors duration-200',
              sizeVariants[size],
              isActive ? selectedVariant.option.active : selectedVariant.option.inactive,
              !isActive && !disabled && selectedVariant.option.hover,
              fullWidth && 'flex-1',
              disabled && 'cursor-not-allowed'
            )}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => !disabled && onChange(option.id)}
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            disabled={disabled}
          >
            {option.icon && (
              <span className={cn('mr-1.5', isActive ? 'opacity-100' : 'opacity-70')}>
                {option.icon}
              </span>
            )}
            <span className="font-medium">{option.label}</span>
            
            {/* Hover effect */}
            {isHovered && !isActive && !disabled && (
              <motion.div
                className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-md pointer-events-none"
                layoutId="segmentHover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
