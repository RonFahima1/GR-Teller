import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface IOSPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onRefresh?: () => void;
  rightContent?: React.ReactNode;
}

export const IOSPageHeader: React.FC<IOSPageHeaderProps> = ({
  title,
  subtitle,
  icon,
  onRefresh,
  rightContent,
}) => {
  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex flex-col justify-center">
            <h1 className="text-sm font-medium leading-none text-gray-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-none">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onRefresh}
              className="h-6 w-6 text-blue-600 dark:text-blue-400 -mr-1"
            >
              <RefreshCcw size={12} />
            </Button>
          )}
          {rightContent}
        </div>
      </div>
    </div>
  );
};
