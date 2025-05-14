import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchSectionProps } from '../types';

/**
 * A reusable section component for search UI with title and optional clear button
 */
export function SearchSection({ title, children, onClear }: SearchSectionProps) {
  return (
    <div className="py-2">
      <div className="px-4 py-1.5 flex justify-between items-center">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </div>
        
        {onClear && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            onClick={onClear}
          >
            Clear
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
