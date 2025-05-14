'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

// This SearchFilters interface is used by ExchangePageEntitySearch and its filter modal.
// It should align with the fields available on the Client type defined in ../types/index.ts
export interface SearchFilters {
  searchTerm: string; 
  filterByName: boolean;
  filterByPhone: boolean;
  filterByIdNumber: boolean;
  filterByBankAccount: boolean; 
  filterByQrCode: boolean;      
  filterByCustomerCard: boolean;
  qrCodeValue?: string;
  customerCardValue?: string;
}

interface ExchangePageClientSearchFilterProps { // Renamed for clarity
  isOpen: boolean;
  onClose: () => void;
  currentFilters: Partial<SearchFilters>; 
  initialVisualState: Partial<SearchFilters>; // Added new prop
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
  onResetFilters: () => void;
}

export const ExchangePageClientSearchFilter: React.FC<ExchangePageClientSearchFilterProps> = ({
  isOpen,
  onClose,
  currentFilters,
  initialVisualState, // Use new prop
  onApplyFilters,
  onResetFilters
}) => {
  // Initialize internalFilters: Start with the initialVisualState,
  // then, if currentFilters has keys (meaning filters are actually active on the list),
  // merge/override with currentFilters.
  const [internalFilters, setInternalFilters] = React.useState<Partial<SearchFilters>>(() => {
    if (Object.keys(currentFilters).length > 0) {
      // If active filters exist, the modal should reflect them accurately.
      // However, we still need to ensure all boolean filter keys are present for rendering checkboxes.
      // So, start with visual defaults, then apply current active filters.
      return { ...initialVisualState, ...currentFilters };
    }
    return initialVisualState; // Default to the desired initial visual state if no filters are active
  });

  React.useEffect(() => {
    // When currentFilters (from parent) change, or when modal opens/closes,
    // re-evaluate the internal state to reflect active filters or reset to initial visual state.
    if (isOpen) {
      if (Object.keys(currentFilters).length > 0) {
        setInternalFilters({ ...initialVisualState, ...currentFilters });
      } else {
        setInternalFilters(initialVisualState);
      }
    } 
    // No else needed: if modal is not open, internalFilters don't need to track currentFilters changes in real-time
  }, [currentFilters, isOpen, initialVisualState]);

  const handleCheckboxChange = (filterName: keyof SearchFilters) => {
    setInternalFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInternalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(internalFilters);
    onClose();
  };

  const handleReset = () => {
    setInternalFilters(initialVisualState); // Reset visual state of the modal
    onResetFilters(); // Call parent to clear active filters on the list
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold">Filter Customers</h3> {/* Terminology: Customer */}
              <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Select criteria to refine your customer search.</p> {/* Terminology: customer */}
              
              <div className="space-y-3">
                {(Object.keys(internalFilters) as Array<keyof SearchFilters>)
                  .filter(key => typeof internalFilters[key] === 'boolean' && key !== 'searchTerm')
                  .map((key) => (
                    <div key={key} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <Checkbox 
                        id={key} 
                        checked={!!internalFilters[key]} 
                        onCheckedChange={() => handleCheckboxChange(key)}
                        className="w-5 h-5"
                      />
                      <Label htmlFor={key} className="capitalize text-sm font-normal flex-grow cursor-pointer">
                        {/* Logic to format label, e.g., filterByName -> Name */}
                        {key.startsWith('filterBy') ? key.substring(8).replace(/([A-Z])/g, ' $1').trim() : key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                    </div>
                ))}
              </div>

              <Separator />

              <div>
                <Label htmlFor="qrCodeValue" className="text-sm font-medium">QR Code Value</Label>
                <Input 
                  id="qrCodeValue" 
                  name="qrCodeValue" 
                  placeholder="Enter QR code data (if filtering by QR)"
                  value={internalFilters.qrCodeValue || ''}
                  onChange={handleInputChange}
                  disabled={!internalFilters.filterByQrCode}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="customerCardValue" className="text-sm font-medium">Customer Card Number</Label>
                <Input 
                  id="customerCardValue" 
                  name="customerCardValue" 
                  placeholder="Enter card number (if filtering by card)"
                  value={internalFilters.customerCardValue || ''}
                  onChange={handleInputChange}
                  disabled={!internalFilters.filterByCustomerCard}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex space-x-3 p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button variant="outline" onClick={handleReset} className="flex-grow">Reset Filters</Button> 
              <Button onClick={handleApply} className="flex-grow">Apply Filters</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 