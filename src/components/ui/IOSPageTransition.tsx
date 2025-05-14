import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TransitionEffect = 
  | 'slide-left' 
  | 'slide-right' 
  | 'slide-up' 
  | 'slide-down' 
  | 'fade' 
  | 'zoom' 
  | 'flip' 
  | 'scale' 
  | 'ios-slide' 
  | 'ios-stack' 
  | 'ios-modal' 
  | 'ios-card' 
  | 'ios-fade';

interface IOSPageTransitionProps {
  children: React.ReactNode;
  className?: string;
  effect?: TransitionEffect;
  duration?: number;
  isPresent?: boolean;
  onExitComplete?: () => void;
  customVariants?: any;
}

export const IOSPageTransition: React.FC<IOSPageTransitionProps> = ({
  children,
  className,
  effect = 'ios-slide',
  duration = 0.4,
  isPresent = true,
  onExitComplete,
  customVariants
}) => {
  // Define transition presets based on effect
  const getTransition = () => {
    switch (effect) {
      case 'ios-slide':
      case 'ios-stack':
      case 'ios-modal':
      case 'ios-card':
        return {
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 1
        };
      case 'flip':
        return {
          type: 'spring',
          stiffness: 400,
          damping: 40
        };
      default:
        return {
          duration,
          ease: [0.25, 0.1, 0.25, 1] // iOS cubic-bezier easing
        };
    }
  };

  // Define variants based on effect
  const getVariants = () => {
    if (customVariants) return customVariants;
    
    switch (effect) {
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -30 }
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 30 }
        };
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -30 }
        };
      case 'slide-down':
        return {
          initial: { opacity: 0, y: -30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 30 }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 }
        };
      case 'flip':
        return {
          initial: { opacity: 0, rotateX: 90 },
          animate: { opacity: 1, rotateX: 0 },
          exit: { opacity: 0, rotateX: -90 }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 }
        };
      case 'ios-slide':
        return {
          initial: { opacity: 0, x: 20, scale: 0.98 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -20, scale: 0.98 }
        };
      case 'ios-stack':
        return {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.98 }
        };
      case 'ios-modal':
        return {
          initial: { opacity: 0, y: 50, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 30, scale: 0.98 }
        };
      case 'ios-card':
        return {
          initial: { opacity: 0, scale: 0.95, y: 10 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 10 }
        };
      case 'ios-fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  const variants = getVariants();
  const transition = getTransition();

  return (
    <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
      {isPresent && (
        <motion.div
          className={cn('w-full', className)}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
          style={{ 
            position: 'relative',
            perspective: effect === 'flip' ? '1200px' : undefined
          }}
        >
          {/* iOS-style shadow for card transitions */}
          {(effect === 'ios-card' || effect === 'ios-modal') && (
            <motion.div 
              className="absolute inset-0 rounded-xl bg-transparent" 
              initial={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
              animate={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              exit={{ boxShadow: '0 0 0 rgba(0,0,0,0)' }}
              transition={transition}
            />
          )}
          
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper component for transitioning between multiple children
export const IOSPageTransitionGroup: React.FC<{
  children: React.ReactNode;
  currentKey: string | number;
  className?: string;
  effect?: TransitionEffect;
  duration?: number;
}> = ({ children, currentKey, className, effect = 'ios-slide', duration = 0.4 }) => {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0, x: effect.includes('left') ? -20 : effect.includes('right') ? 20 : 0, y: effect.includes('up') ? -20 : effect.includes('down') ? 20 : 0, scale: effect.includes('zoom') || effect.includes('scale') ? 0.95 : 1 },
            animate: { opacity: 1, x: 0, y: 0, scale: 1 },
            exit: { opacity: 0, x: effect.includes('left') ? 20 : effect.includes('right') ? -20 : 0, y: effect.includes('up') ? 20 : effect.includes('down') ? -20 : 0, scale: effect.includes('zoom') || effect.includes('scale') ? 0.95 : 1 }
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
