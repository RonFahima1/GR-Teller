import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ErrorStateProps } from '../types';

/**
 * Error state component for search UI
 */
export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="p-6 text-center">
      <AlertCircle className="h-6 w-6 mx-auto text-red-500" />
      <p className="text-sm text-red-500 mt-2">{message}</p>
    </div>
  );
}
