import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IOSBottomNavProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  showBackButton?: boolean;
  className?: string;
  stepNumber?: number;
  totalSteps?: number;
}

export const IOSBottomNav: React.FC<IOSBottomNavProps> = ({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  isSubmitting = false,
  isLastStep = false,
  showBackButton = true,
  className,
  stepNumber,
  totalSteps
}) => {
  return (
    <motion.div 
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 py-4 px-4 z-10',
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Step indicator */}
        {stepNumber && totalSteps && (
          <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
            <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Step {stepNumber} of {totalSteps}
              </span>
            </div>
          </div>
        )}
        
        {/* Back button */}
        {showBackButton ? (
          <motion.button
            onClick={onBack}
            className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </motion.button>
        ) : (
          <div className="w-24"></div>
        )}
        
        {/* Next/Submit button */}
        <motion.button
          onClick={onNext}
          disabled={nextDisabled || isSubmitting}
          className={cn(
            'px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-1',
            nextDisabled || isSubmitting
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : isLastStep
                ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-700'
                : 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
          )}
          whileHover={nextDisabled || isSubmitting ? {} : { x: 2 }}
          whileTap={nextDisabled || isSubmitting ? {} : { scale: 0.97 }}
        >
          <span>{isSubmitting ? 'Processing...' : nextLabel}</span>
          {isLastStep ? (
            <Check className="h-4 w-4 ml-1" />
          ) : (
            <ChevronRight className="h-4 w-4 ml-1" />
          )}
          
          {/* Loading spinner */}
          {isSubmitting && (
            <svg className="animate-spin ml-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
