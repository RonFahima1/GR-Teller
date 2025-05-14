'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, CheckCircle, Eye, History, Filter } from 'lucide-react'; // Added Filter
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Assuming a generic Client type. If not available globally, define or import.
// This should match the Client type used in useSendMoneyForm or a shared type.
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  name: string; // Concatenation of firstName and lastName, or standalone
  phone: string;
  idType?: string; // e.g., Passport, Driver License
  idNumber?: string;
  // Add other relevant client fields as needed for search/display
  // Add mock transaction history for demonstration
  transactionHistory?: Array<{
    id: string;
    date: string;
    type: string; // e.g., "Exchange", "Payment"
    details: string; // e.g., "USD to EUR", "Sent to Bob"
    amount: string; // e.g., "$100.00", "€50.00"
  }>;
  [key: string]: any; // Allow other properties if Client type is broad
}

interface CustomerSelectionForExchangeProps {
  initialLoading?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCustomers: Client[];
  selectedCustomer: Client | null;
  setSelectedCustomer: (customer: Client | null) => void;
  setShowNewCustomerForm: (show: boolean) => void; // This might be deprecated if always redirecting
  onViewCustomerDetails: (customer: Client) => void;
  onViewCustomerHistory: (customer: Client) => void; // New prop for history
  onFilterClick?: () => void; // Optional: for the filter icon
}

export const CustomerSelectionForExchange: React.FC<CustomerSelectionForExchangeProps> = ({
  initialLoading = false,
  searchQuery,
  setSearchQuery,
  filteredCustomers,
  selectedCustomer,
  setSelectedCustomer,
  setShowNewCustomerForm,
  onViewCustomerDetails,
  onViewCustomerHistory,
  onFilterClick,
}) => {
  const [hoveredCustomerId, setHoveredCustomerId] = useState<string | null>(null);

  // The old UI showed search types: Phone, Name, ID, Bank Account, QR Code, Customer Card.
  // For simplicity now, we only have a general search input like in SenderSelection.
  // Filters could be added later if ClientSearchFilter component is made reusable.

  if (initialLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[70px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div> // Slightly shorter pulse for simpler cards
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Control Bar: Search Input */}
      <div className="flex flex-col sm:flex-row gap-1.5 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-9 w-full py-2 text-sm dark:bg-gray-800 dark:border-gray-700 rounded-md"
          />
          {onFilterClick && (
            <Button 
              variant="ghost" 
              size="icon_xs"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onFilterClick();
              }}
              aria-label="Open filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {filteredCustomers.length === 0 && searchQuery !== '' && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No customers found matching your search.</p>
      )}

      {/* Customer Cards Grid */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredCustomers.map((customer) => {
          const isSelected = selectedCustomer?.id === customer.id;

          return (
            <div 
              key={customer.id} 
              className={cn(
                "rounded-lg transition-all duration-150 ease-in-out flex flex-col cursor-pointer text-sm",
                "bg-white dark:bg-gray-800 hover:shadow-lg dark:hover:bg-gray-700/70",
                "min-h-[70px]", 
                isSelected 
                  ? "ring-2 ring-blue-500 shadow-md border-transparent"
                  : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
              onClick={() => setSelectedCustomer(customer)} // Only select customer on card click
              onMouseEnter={() => setHoveredCustomerId(customer.id)}
              onMouseLeave={() => setHoveredCustomerId(null)}
            >
              <div className="p-3 flex-grow flex flex-col justify-center">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-base text-gray-800 dark:text-white truncate mr-2 flex-shrink min-w-0">
                    {customer.firstName} {customer.lastName} (ID: {customer.idNumber ? customer.idNumber : customer.id.substring(0,6)})
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon_xs"
                      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation(); // Prevent card click
                        onViewCustomerDetails(customer);
                      }}
                      aria-label="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon_xs"
                      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation(); // Prevent card click
                        onViewCustomerHistory(customer);
                      }}
                      aria-label="View history"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    {isSelected && (
                       <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="truncate">Phone: {customer.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 