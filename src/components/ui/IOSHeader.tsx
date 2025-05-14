import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, X, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IOSHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  showMenuButton?: boolean;
  showProfileButton?: boolean;
  onBackClick?: () => void;
  onCloseClick?: () => void;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  className?: string;
  backButtonLabel?: string;
}

export const IOSHeader: React.FC<IOSHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showCloseButton = false,
  showMenuButton = false,
  showProfileButton = false,
  onBackClick,
  onCloseClick,
  onMenuClick,
  onProfileClick,
  className,
  backButtonLabel
}) => {
  return (
    <header className={cn(
      'sticky top-0 z-10 w-full py-4 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800',
      className
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center flex-1">
          {showBackButton && (
            <motion.button 
              onClick={onBackClick} 
              className="mr-3 flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-5 w-5" />
              {backButtonLabel && (
                <span className="text-sm font-medium ml-1">{backButtonLabel}</span>
              )}
            </motion.button>
          )}
          
          {showMenuButton && (
            <motion.button 
              onClick={onMenuClick} 
              className="mr-3 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        
        <motion.div 
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </motion.div>
        
        <div className="flex items-center justify-end flex-1">
          {showProfileButton && (
            <motion.button 
              onClick={onProfileClick} 
              className="ml-3 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="h-5 w-5" />
            </motion.button>
          )}
          
          {showCloseButton && (
            <motion.button 
              onClick={onCloseClick} 
              className="ml-3 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
