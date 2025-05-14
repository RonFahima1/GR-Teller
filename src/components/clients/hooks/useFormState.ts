import { useState } from 'react';
import { FormState, FormSection } from '../types/form';

export function useFormState(initialState: Partial<FormState> = {}) {
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    errors: {},
    currentSection: initialState.currentSection || 'personal' as FormSection,
    fileUploads: {},
    ...initialState,
  });

  const updateState = (newState: Partial<FormState>) => {
    setState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  const setError = (field: string, message: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: message,
      },
    }));
  };

  const clearError = (field: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  };

  const clearAllErrors = () => {
    setState(prev => ({
      ...prev,
      errors: {},
    }));
  };

  return {
    ...state,
    updateState,
    setError,
    clearError,
    clearAllErrors,
  };
}
