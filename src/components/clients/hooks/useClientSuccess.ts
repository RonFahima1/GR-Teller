import { useState, useCallback } from 'react';
import { NewClientFormData } from '../../../types/form';

interface UseClientSuccessReturn {
  showSuccess: (clientData: NewClientFormData) => void;
  isSuccessVisible: boolean;
  clientData: NewClientFormData | null;
}

export function useClientSuccess(): UseClientSuccessReturn {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [clientData, setClientData] = useState<NewClientFormData | null>(null);

  const showSuccess = useCallback((clientData: NewClientFormData) => {
    setClientData(clientData);
    setIsSuccessVisible(true);

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsSuccessVisible(false);
      setClientData(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return {
    showSuccess,
    isSuccessVisible,
    clientData,
  };
}
