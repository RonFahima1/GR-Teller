import { useCallback } from 'react';

/**
 * Custom hook to handle navigation to the new receiver form
 * This provides a consistent implementation across different components
 */
export function useNewReceiverNavigation() {
  /**
   * Function to handle navigation to new receiver form
   * @param closeModal Function to close the current modal
   * @param setShowNewReceiverForm Function to show the new receiver form
   * @param setSearchQuery Function to reset the search query (optional)
   * @param navigateToStep Function to navigate to a specific step (optional)
   */
  const handleNavigateToNewReceiver = useCallback((
    closeModal: () => void,
    setShowNewReceiverForm: (show: boolean) => void,
    setSearchQuery?: (query: string) => void,
    navigateToStep?: (step: number) => void
  ) => {
    // First close the modal
    closeModal();
    
    // Then reset any search query if the function was provided
    if (setSearchQuery) {
      setSearchQuery('');
    }
    
    // Navigate to receiver step if the function was provided
    if (navigateToStep) {
      navigateToStep(2); // Step 2 is the Receiver step
    }
    
    // Finally, show the new receiver form
    setShowNewReceiverForm(true);
  }, []);

  return {
    handleNavigateToNewReceiver
  };
}
