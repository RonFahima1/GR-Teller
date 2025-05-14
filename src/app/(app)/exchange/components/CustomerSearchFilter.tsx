'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

// Note: SearchFilters interface might need to be aligned with Client/Customer properties
// if they differ significantly from Sender. For now, assuming they are similar.
export interface SearchFilters {
  searchTerm: string; // General search term from the main input
  filterByName: boolean;
  filterByPhone: boolean;
  filterByIdNumber: boolean;
  filterByBankAccount: boolean; // May or may not be relevant for "Customer" on exchange page
  filterByQrCode: boolean;      // May or may not be relevant
  filterByCustomerCard: boolean;// May or may not be relevant
  qrCodeValue?: string;
  customerCardValue?: string;
}

interface CustomerSearchFilterProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: Partial<SearchFilters>; 
  onApplyFilters: (filters: Partial<SearchFilters>) => void;
  onResetFilters: () => void;
}

export const CustomerSearchFilter: React.FC<CustomerSearchFilterProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
  onResetFilters
}) => {
  const [internalFilters, setInternalFilters] = React.useState<Partial<SearchFilters>>(currentFilters);

  React.useEffect(() => {
    setInternalFilters(currentFilters);
  }, [currentFilters, isOpen]);

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
    onResetFilters();
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
          onClick={onClose} // Close when clicking overlay
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Prevent closing when clicking modal content
          >
            <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold">Filter Customers</h3> {/* Changed to Customers */}
              <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-grow">
              <p className="text-sm text-gray-600 dark:text-gray-400">Select criteria to refine your customer search.</p> {/* Changed to customer */}
              
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
                        {key.replace('filterBy', '').replace(/([A-Z])/g, ' $1').trim()} 
                      </Label>
                    </div>
                ))}
              </div>

              {/* Fields like BankAccount, QrCode, CustomerCard might be less relevant for general customer search on an exchange page */}
              {/* Consider removing or making them conditional if not needed, to simplify UI */}
              {(internalFilters.filterByQrCode || internalFilters.filterByCustomerCard || internalFilters.filterByBankAccount) && <Separator />}

              {internalFilters.filterByQrCode && (
                <div>
                  <Label htmlFor="qrCodeValue" className="text-sm font-medium">QR Code Value</Label>
                  <Input 
                    id="qrCodeValue" 
                    name="qrCodeValue" 
                    placeholder="Enter QR code data"
                    value={internalFilters.qrCodeValue || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              )}

              {internalFilters.filterByCustomerCard && (
                <div>
                  <Label htmlFor="customerCardValue" className="text-sm font-medium">Customer Card Number</Label>
                  <Input 
                    id="customerCardValue" 
                    name="customerCardValue" 
                    placeholder="Enter card number"
                    value={internalFilters.customerCardValue || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              )}
              {/* Example: Conditionally showing Bank Account filter input if needed */}
              {/* {internalFilters.filterByBankAccount && ( ... similar input structure ... )} */}

            </div>

            <div className="flex space-x-3 p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button variant="outline" onClick={handleReset} className="flex-grow">Reset Filters</Button> {/* Changed */} 
              <Button onClick={handleApply} className="flex-grow">Apply Filters</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 