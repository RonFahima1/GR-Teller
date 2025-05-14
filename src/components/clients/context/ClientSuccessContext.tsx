import { createContext, useContext, useState, useCallback } from 'react';
import { NewClientFormData } from '../../types/form';

interface ClientSuccessContextType {
  showSuccess: (clientData: NewClientFormData) => void;
  hideSuccess: () => void;
  isSuccessVisible: boolean;
  clientData: NewClientFormData | null;
}

const ClientSuccessContext = createContext<ClientSuccessContextType | undefined>(undefined);

export function ClientSuccessProvider({ children }: { children: React.ReactNode }) {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [clientData, setClientData] = useState<NewClientFormData | null>(null);

  const showSuccess = useCallback((clientData: NewClientFormData) => {
    setClientData(clientData);
    setIsSuccessVisible(true);
  }, []);

  const hideSuccess = useCallback(() => {
    setIsSuccessVisible(false);
    setClientData(null);
  }, []);

  return (
    <ClientSuccessContext.Provider value={{ showSuccess, hideSuccess, isSuccessVisible, clientData }}>
      {children}
    </ClientSuccessContext.Provider>
  );
}

export function useClientSuccess() {
  const context = useContext(ClientSuccessContext);
  if (context === undefined) {
    throw new Error('useClientSuccess must be used within a ClientSuccessProvider');
  }
  return context;
}
