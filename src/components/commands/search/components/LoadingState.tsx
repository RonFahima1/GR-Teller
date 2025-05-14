import React from 'react';
import { Loader2 } from 'lucide-react';
import { LoadingStateProps } from '../types';

/**
 * Loading state component for search UI
 */
export function LoadingState({ message = 'Searching...' }: LoadingStateProps) {
  return (
    <div className="p-6 text-center">
      <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{message}</p>
    </div>
  );
}
