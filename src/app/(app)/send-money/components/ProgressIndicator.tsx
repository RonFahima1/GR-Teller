import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

interface ProgressIndicatorProps {
  steps: Step[];
  activeStep: number;
}

export function ProgressIndicator({ steps, activeStep }: ProgressIndicatorProps) {
  return (
    <div className="py-8" data-component-name="SendMoneyPage">
      {/* Horizontal step indicators - iOS style */}
      <div className="flex justify-between w-full max-w-4xl mx-auto px-8 md:px-16" data-component-name="SendMoneyPage">
        {steps.map((step, index) => {
          const isCompleted = step.id < activeStep;
          const isCurrent = step.id === activeStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {/* Line connecting circles */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 w-full h-[1.5px] top-[18px] -z-10">
                  <div className={cn(
                    "h-full",
                    isCompleted ? "bg-green-500/60" : "bg-gray-200 dark:bg-gray-700/50"
                  )} />
                </div>
              )}
              
              {/* Circle with subtle shadow for depth */}
              <motion.div 
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full mb-3 shadow-sm",
                  isCompleted ? "bg-green-500 text-white" : 
                  isCurrent ? "bg-blue-500 text-white" : 
                  "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                )}
                style={{
                  boxShadow: isCurrent ? "0 0 0 4px rgba(59, 130, 246, 0.15)" : "none"
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <div className="flex items-center justify-center">
                    {step.icon}
                  </div>
                )}
              </motion.div>
              
              {/* Step title with SF Pro Display inspired typography */}
              <span 
                className={cn(
                  "text-sm font-medium tracking-tight text-center transition-colors duration-300",
                  isCurrent ? "text-gray-900 dark:text-white" : 
                  isCompleted ? "text-green-600 dark:text-green-400" :
                  "text-gray-400 dark:text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
