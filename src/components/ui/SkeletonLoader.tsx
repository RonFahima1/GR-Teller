import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type SkeletonVariant = 
  | 'text' 
  | 'circle' 
  | 'rectangle' 
  | 'card' 
  | 'avatar' 
  | 'button' 
  | 'input' 
  | 'ios-card';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
  repeat?: number;
  gap?: number;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangle',
  width,
  height,
  className,
  animate = true,
  repeat = 1,
  gap = 4,
  isLoaded = false,
  children
}) => {
  // Variant styles
  const variantStyles: Record<SkeletonVariant, string> = {
    text: 'h-4 rounded-md',
    circle: 'rounded-full aspect-square',
    rectangle: 'rounded-md',
    card: 'rounded-xl',
    avatar: 'rounded-full aspect-square',
    button: 'h-10 rounded-full',
    input: 'h-10 rounded-lg',
    'ios-card': 'rounded-2xl'
  };
  
  // Default dimensions based on variant
  const getDefaultDimensions = (variant: SkeletonVariant) => {
    switch (variant) {
      case 'text':
        return { width: '100%', height: '1rem' };
      case 'circle':
      case 'avatar':
        return { width: '3rem', height: '3rem' };
      case 'button':
        return { width: '8rem', height: '2.5rem' };
      case 'input':
        return { width: '100%', height: '2.5rem' };
      case 'card':
        return { width: '100%', height: '8rem' };
      case 'ios-card':
        return { width: '100%', height: '10rem' };
      default:
        return { width: '100%', height: '4rem' };
    }
  };
  
  const defaultDimensions = getDefaultDimensions(variant);
  
  // Animation variants
  const shimmerAnimation = animate ? {
    backgroundImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 20%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0.05) 80%, rgba(255, 255, 255, 0) 100%)',
    backgroundSize: '200% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: ['200% 0', '-200% 0']
  } : {};
  
  // Generate skeleton items
  const renderSkeletonItems = () => {
    return Array.from({ length: repeat }).map((_, index) => (
      <motion.div
        key={index}
        className={cn(
          'bg-gray-200 dark:bg-gray-800 relative overflow-hidden',
          variantStyles[variant],
          className
        )}
        style={{
          width: width || defaultDimensions.width,
          height: height || defaultDimensions.height,
          marginBottom: index < repeat - 1 ? gap : 0
        }}
        initial={{ opacity: 0.7 }}
        animate={{
          opacity: [0.7, 0.9, 0.7],
          ...shimmerAnimation
        }}
        transition={{
          opacity: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut'
          },
          backgroundPosition: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut'
          }
        }}
      >
        {/* iOS-style gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/2 dark:to-transparent pointer-events-none" />
      </motion.div>
    ));
  };
  
  // If content is loaded, show children
  if (isLoaded) {
    return <>{children}</>;
  }
  
  return (
    <div className="w-full">
      {renderSkeletonItems()}
    </div>
  );
};

// Specialized skeleton components
export const TextSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="text" {...props} />
);

export const CircleSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="circle" {...props} />
);

export const CardSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="card" {...props} />
);

export const IOSCardSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="ios-card" {...props} />
);

export const AvatarSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="avatar" {...props} />
);

export const ButtonSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="button" {...props} />
);

export const InputSkeleton: React.FC<Omit<SkeletonLoaderProps, 'variant'>> = (props) => (
  <SkeletonLoader variant="input" {...props} />
);

// Complex skeleton components
interface SkeletonCardProps {
  hasImage?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
  imageHeight?: string | number;
  className?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  hasImage = true,
  hasHeader = true,
  hasFooter = true,
  imageHeight = '8rem',
  className,
  isLoaded = false,
  children
}) => {
  if (isLoaded) {
    return <>{children}</>;
  }
  
  return (
    <div className={cn('rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800', className)}>
      {hasImage && (
        <SkeletonLoader 
          variant="rectangle" 
          height={imageHeight} 
          className="rounded-none" 
        />
      )}
      <div className="p-4 space-y-3">
        {hasHeader && (
          <div className="space-y-2">
            <TextSkeleton width="60%" />
            <TextSkeleton width="40%" height="0.75rem" />
          </div>
        )}
        <div className="space-y-2 pt-2">
          <TextSkeleton />
          <TextSkeleton />
          <TextSkeleton width="80%" />
        </div>
        {hasFooter && (
          <div className="flex justify-between items-center pt-2">
            <ButtonSkeleton width="40%" />
            <CircleSkeleton width="2rem" />
          </div>
        )}
      </div>
    </div>
  );
};

interface SkeletonListProps {
  rowCount?: number;
  rowHeight?: string | number;
  hasImage?: boolean;
  imageSize?: string | number;
  className?: string;
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  rowCount = 5,
  rowHeight = '4rem',
  hasImage = true,
  imageSize = '3rem',
  className,
  isLoaded = false,
  children
}) => {
  if (isLoaded) {
    return <>{children}</>;
  }
  
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <div 
          key={index} 
          className="flex items-center p-3 rounded-lg bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800"
          style={{ height: rowHeight }}
        >
          {hasImage && (
            <CircleSkeleton 
              width={imageSize} 
              className="mr-3 flex-shrink-0" 
            />
          )}
          <div className="flex-1 space-y-2">
            <TextSkeleton width="60%" />
            <TextSkeleton width="40%" height="0.75rem" />
          </div>
          <CircleSkeleton width="1.5rem" className="ml-2 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
};
