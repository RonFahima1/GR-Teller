import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IOSSheetProps extends HTMLMotionProps<"div"> {
  isOpen: boolean;
  onClose: () => void;
  position?: 'bottom' | 'right';
  size?: 'default' | 'large';
  showBackdrop?: boolean;
  children: React.ReactNode;
}

const sheetVariants = {
  bottom: {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8
      }
    },
    exit: { 
      y: '100%', 
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8
      }
    }
  },
  right: {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8
      }
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 300,
        mass: 0.8
      }
    }
  }
};

const sizeClasses = {
  default: 'h-[85vh] sm:h-[75vh]',
  large: 'h-[95vh] sm:h-[85vh]'
};

export const IOSSheet = React.forwardRef<HTMLDivElement, IOSSheetProps>(({
  isOpen,
  onClose,
  position = 'bottom',
  size = 'default',
  showBackdrop = true,
  className,
  children,
  ...props
}, ref) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={onClose}
            />
          )}
          <motion.div
            ref={ref}
            variants={sheetVariants[position]}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed z-50 bg-white dark:bg-gray-900',
              'rounded-t-2xl shadow-2xl',
              'overflow-hidden',
              position === 'bottom' ? [
                'bottom-0 left-0 right-0',
                sizeClasses[size]
              ] : [
                'right-0 top-0 bottom-0',
                'w-full sm:w-[400px]'
              ],
              className
            )}
            {...props}
          >
            <div className="absolute top-2 left-0 right-0 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="h-full overflow-auto pt-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}); 