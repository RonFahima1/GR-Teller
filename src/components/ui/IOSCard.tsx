import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IOSCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isSelectable?: boolean;
  variant?: 'default' | 'grouped' | 'inset' | 'transparent';
  padding?: 'none' | 'small' | 'medium' | 'large';
  animateEntrance?: boolean;
  index?: number;
}

export const IOSCard = ({
  children,
  className,
  onClick,
  isSelected = false,
  isSelectable = false,
  variant = 'default',
  padding = 'medium',
  animateEntrance = true,
  index = 0
}: IOSCardProps) => {
  // iOS design system padding values
  const paddingMap = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };
  
  // iOS design system variants
  const variantStyles = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm',
    grouped: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 first:rounded-t-xl first:border-t last:rounded-b-xl',
    inset: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-inner',
    transparent: 'bg-transparent border border-gray-200/50 dark:border-gray-800/50'
  };
  
  // iOS selection styles
  const selectionStyles = isSelectable
    ? isSelected
      ? 'ring-2 ring-[#007AFF] ring-offset-1'
      : 'hover:border-gray-300 dark:hover:border-gray-700'
    : '';
  
  // Animation variants for entrance
  const entranceVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: index * 0.05
      }
    }
  };
  
  const CardComponent = animateEntrance ? motion.div : 'div';
  const animationProps = animateEntrance ? {
    variants: entranceVariants,
    initial: "hidden",
    animate: "visible"
  } : {};
  
  return (
    <CardComponent
      className={cn(
        'rounded-xl transition-all duration-200',
        variantStyles[variant],
        paddingMap[padding],
        selectionStyles,
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </CardComponent>
  );
};

// Group component for grouped cards
export const IOSCardGroup = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn('rounded-xl overflow-hidden', className)}>
      {children}
    </div>
  );
};
