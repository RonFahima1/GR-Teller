import React from 'react';
import { cn } from '@/lib/utils';

interface IOSCardHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const IOSCardHeader: React.FC<IOSCardHeaderProps> = ({
  title,
  subtitle,
  rightContent,
  className,
  compact = false,
}) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between border-b border-gray-100 dark:border-gray-800",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      <div className="flex flex-col">
        <h3 className={cn(
          "font-medium text-gray-900 dark:text-white leading-tight",
          compact ? "text-base" : "text-lg"
        )}>
          {title}
        </h3>
        {subtitle && (
          <p className={cn(
            "text-gray-500 dark:text-gray-400 mt-0.5",
            compact ? "text-xs" : "text-sm"
          )}>
            {subtitle}
          </p>
        )}
      </div>
      {rightContent && (
        <div>
          {rightContent}
        </div>
      )}
    </div>
  );
};
