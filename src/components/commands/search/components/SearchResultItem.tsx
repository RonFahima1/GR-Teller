import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchResultItemProps } from '../types';
import { getResultIcon } from '../utils/getResultIcon';

/**
 * Component for rendering a single search result item
 */
export function SearchResultItem({ result, isSelected, onClick }: SearchResultItemProps) {
  return (
    <div 
      className={cn(
        "px-4 py-2.5 flex items-center justify-between cursor-pointer",
        isSelected 
          ? "bg-blue-50 dark:bg-blue-900/30" 
          : "hover:bg-blue-50/80 dark:hover:bg-blue-900/20"
      )}
      onClick={onClick}
    >
      <div className="flex items-center min-w-0">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3",
          isSelected 
            ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400" 
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        )}>
          {getResultIcon(result.type)}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{result.title}</div>
          {result.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {result.description}
            </div>
          )}
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0" />
    </div>
  );
}
