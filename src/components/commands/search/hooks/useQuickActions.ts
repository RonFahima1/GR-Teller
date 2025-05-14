import { useMemo } from 'react';
import { QuickAction } from '../types';

/**
 * Custom hook to provide quick actions for the search UI
 */
export function useQuickActions(onSelectSuggestion: (suggestion: string) => void) {
  const quickActions = useMemo<QuickAction[]>(() => [
    { label: 'Create New Transaction', action: () => onSelectSuggestion('new transaction') },
    { label: 'Add New Client', action: () => onSelectSuggestion('new client') },
    { label: 'View Exchange Rates', action: () => onSelectSuggestion('exchange rates') },
    { label: 'Go to Help Center', action: () => onSelectSuggestion('help center') }
  ], [onSelectSuggestion]);

  return quickActions;
}
