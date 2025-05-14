import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface AnimatedProgressIndicatorProps {
  steps: Array<{ title: string; description: string; icon?: React.ReactNode }>;
  currentStep: number;
  showPercentage?: boolean;
  className?: string;
}

export const AnimatedProgressIndicator: React.FC<AnimatedProgressIndicatorProps> = ({
  steps,
  currentStep,
  showPercentage = false,
  className
}) => {
  const progressPercentage = Math.round((currentStep / steps.length) * 100);
  
  // Default icons for steps if not provided
  const defaultIcons = [
    <svg key="user" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    <svg key="receiver" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    <svg key="details" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>,
    <svg key="amount" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
    <svg key="confirm" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
  ];
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar with percentage indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Step {currentStep} of {steps.length}
          </div>
          {showPercentage && (
            <motion.span 
              className="text-sm font-medium text-blue-600 dark:text-blue-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {progressPercentage}%
            </motion.span>
          )}
        </div>
        
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          const icon = step.icon || defaultIcons[index] || defaultIcons[0];
          
          return (
            <div 
              key={index} 
              className={cn(
                'flex flex-col items-center',
                isCompleted ? 'text-green-600 dark:text-green-400' : 
                isCurrent ? 'text-blue-600 dark:text-blue-400' : 
                'text-gray-400 dark:text-gray-500'
              )}
            >
              <motion.div 
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 mb-1',
                  isCompleted ? 'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-900/30' :
                  isCurrent ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30' :
                  'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                )}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                  boxShadow: isCurrent ? ['0px 0px 0px rgba(59, 130, 246, 0)', '0px 0px 8px rgba(59, 130, 246, 0.5)', '0px 0px 0px rgba(59, 130, 246, 0)'] : '0px 0px 0px rgba(59, 130, 246, 0)'
                }}
                transition={{
                  repeat: isCurrent ? Infinity : 0,
                  duration: 2,
                  ease: 'easeInOut'
                }}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {icon}
                  </motion.div>
                )}
              </motion.div>
              <motion.span 
                className={cn(
                  'text-xs font-medium text-center',
                  isCompleted ? 'text-green-600 dark:text-green-400' :
                  isCurrent ? 'text-blue-600 dark:text-blue-400' :
                  'text-gray-400 dark:text-gray-500'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.title}
              </motion.span>
            </div>
          );
        })}
      </div>
      

    </div>
  );
};


