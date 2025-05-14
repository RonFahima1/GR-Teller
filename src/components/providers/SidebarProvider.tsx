'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Create sidebar context
interface CustomSidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const CustomSidebarContext = createContext<CustomSidebarContextType | undefined>(undefined);

export function CustomSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <CustomSidebarContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </CustomSidebarContext.Provider>
  );
}

export const useCustomSidebar = () => {
  const context = useContext(CustomSidebarContext);
  if (!context) {
    throw new Error('useCustomSidebar must be used within a CustomSidebarProvider');
  }
  return context;
} 