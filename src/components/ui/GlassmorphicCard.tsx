import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type GlassmorphicCardProps = HTMLMotionProps<"div"> & {
  variant?: 'default' | 'subtle' | 'elevated';
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'gray';
  isSelected?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  hasShadow?: boolean;
  blurIntensity?: number;
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  children: React.ReactNode;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  variant = 'default',
  colorScheme = 'blue',
  isSelected = false,
  isActive = false,
  isDisabled = false,
  hasShadow = true,
  blurIntensity = 8,
  borderRadius = 'xl',
  className,
  children,
  ...props
}) => {
  // Color schemes based on iOS design
  const colorSchemes = {
    blue: {
      background: isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white/70 dark:bg-gray-900/50',
      border: isSelected ? 'border-blue-200 dark:border-blue-700' : 'border-gray-200/50 dark:border-gray-800/50',
      shadow: 'shadow-blue-500/10 dark:shadow-blue-500/5',
      ring: 'ring-blue-500/30 dark:ring-blue-500/20',
      text: isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
    },
    purple: {
      background: isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-white/70 dark:bg-gray-900/50',
      border: isSelected ? 'border-purple-200 dark:border-purple-700' : 'border-gray-200/50 dark:border-gray-800/50',
      shadow: 'shadow-purple-500/10 dark:shadow-purple-500/5',
      ring: 'ring-purple-500/30 dark:ring-purple-500/20',
      text: isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-900 dark:text-gray-100'
    },
    green: {
      background: isSelected ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white/70 dark:bg-gray-900/50',
      border: isSelected ? 'border-green-200 dark:border-green-700' : 'border-gray-200/50 dark:border-gray-800/50',
      shadow: 'shadow-green-500/10 dark:shadow-green-500/5',
      ring: 'ring-green-500/30 dark:ring-green-500/20',
      text: isSelected ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'
    },
    orange: {
      background: isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white/70 dark:bg-gray-900/50',
      border: isSelected ? 'border-orange-200 dark:border-orange-700' : 'border-gray-200/50 dark:border-gray-800/50',
      shadow: 'shadow-orange-500/10 dark:shadow-orange-500/5',
      ring: 'ring-orange-500/30 dark:ring-orange-500/20',
      text: isSelected ? 'text-orange-700 dark:text-orange-300' : 'text-gray-900 dark:text-gray-100'
    },
    gray: {
      background: isSelected ? 'bg-gray-100 dark:bg-gray-800/40' : 'bg-white/70 dark:bg-gray-900/50',
      border: isSelected ? 'border-gray-300 dark:border-gray-700' : 'border-gray-200/50 dark:border-gray-800/50',
      shadow: 'shadow-gray-400/10 dark:shadow-gray-500/5',
      ring: 'ring-gray-400/30 dark:ring-gray-500/20',
      text: isSelected ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-gray-100'
    }
  };

  const selectedScheme = colorSchemes[colorScheme];
  
  // Border radius mapping
  const radiusMap = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  };
  
  // Variant styles
  const variantStyles = {
    default: {
      backdrop: `backdrop-blur-[${blurIntensity}px]`,
      opacity: 'opacity-100',
      border: 'border',
      shadow: hasShadow ? 'shadow-lg' : ''
    },
    subtle: {
      backdrop: `backdrop-blur-[${Math.max(2, blurIntensity - 4)}px]`,
      opacity: 'opacity-90',
      border: 'border',
      shadow: hasShadow ? 'shadow-md' : ''
    },
    elevated: {
      backdrop: `backdrop-blur-[${blurIntensity + 2}px]`,
      opacity: 'opacity-100',
      border: 'border-2',
      shadow: hasShadow ? 'shadow-xl' : ''
    }
  };
  
  const selectedVariant = variantStyles[variant];
  
  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 10,
      scale: 0.98
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    hover: isDisabled ? {} : { 
      y: -5,
      scale: 1.02,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    tap: isDisabled ? {} : { 
      scale: 0.98,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      className={cn(
        // Base styles
        'relative overflow-hidden transition-all duration-300',
        // Border radius
        radiusMap[borderRadius],
        // Backdrop blur
        selectedVariant.backdrop,
        // Background and border
        selectedScheme.background,
        selectedVariant.border,
        selectedScheme.border,
        // Shadow
        selectedVariant.shadow,
        selectedScheme.shadow,
        // States
        isSelected && 'ring-2',
        isSelected && selectedScheme.ring,
        isActive && 'ring-2 ring-offset-2',
        isDisabled && 'opacity-50 cursor-not-allowed',
        // Custom classes
        className
      )}
      initial="initial"
      animate="animate"
      whileHover={isDisabled ? undefined : "hover"}
      whileTap={isDisabled ? undefined : "tap"}
      variants={cardVariants}
      {...props}
    >
      {/* Glassmorphic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className={cn(
        'relative z-10',
        selectedScheme.text
      )}>
        {children}
      </div>
      
      {/* Highlight effect on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10 pointer-events-none" />
      
      {/* Shadow effect on bottom edge */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-black/20 pointer-events-none" />
    </motion.div>
  );
};
