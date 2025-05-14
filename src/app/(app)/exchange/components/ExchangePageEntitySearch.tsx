'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner as Spinner } from "@/components/ui/LoadingSpinner";
import { UserPlus, Search as SearchIcon, Users, Filter as FilterIcon, Eye, Clock, CheckCircle } from "lucide-react";
import { Client } from '../types/index';
import { ExchangePageClientSearchFilter, SearchFilters } from './ExchangePageClientSearchFilter';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExchangePageEntitySearchProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddNewClient: () => void;
  isLoading?: boolean;
  onViewClientDetails: (client: Client) => void;
  onViewClientHistory: (client: Client) => void;
  selectedClientId?: string | null;
}

const initialModalFilters: Partial<SearchFilters> = {
  searchTerm: '',
  filterByName: true,
  filterByPhone: true,
  filterByIdNumber: true,
  filterByBankAccount: true,
  filterByQrCode: false,
  filterByCustomerCard: false,
  qrCodeValue: '',
  customerCardValue: ''
};

const ExchangePageEntitySearch: React.FC<ExchangePageEntitySearchProps> = ({
  clients,
  onSelectClient,
  onAddNewClient,
  isLoading: propIsLoading,
  onViewClientDetails,
  onViewClientHistory,
  selectedClientId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalFilters, setActiveModalFilters] = useState<Partial<SearchFilters>>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [internalLoading, setInternalLoading] = useState(true);
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);

  const isLoading = propIsLoading ?? internalLoading;

  useEffect(() => {
    const timer = setTimeout(() => setInternalLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = useCallback((client: Client) => {
    onSelectClient(client);
  }, [onSelectClient]);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const handleApplyModalFilters = useCallback((filters: Partial<SearchFilters>) => {
    setActiveModalFilters(filters);
  }, []);

  const handleResetModalFilters = useCallback(() => {
    setActiveModalFilters({});
  }, []);
  
  const locallyFilteredEntities = useMemo(() => {
    if (!clients) return [];
    let filteredByMainSearch = clients.filter(client => {
      const mainSearchTermLower = searchTerm.trim().toLowerCase();
      if (!mainSearchTermLower) return true;
      
      const matchesMainSearchTerm =
        (client.name?.toLowerCase().includes(mainSearchTermLower)) ||
        (client.email?.toLowerCase().includes(mainSearchTermLower)) ||
        (client.phone?.toLowerCase().includes(mainSearchTermLower)) ||
        (client.clientId?.toLowerCase().includes(mainSearchTermLower));
      
      return matchesMainSearchTerm;
    });

    if (Object.keys(activeModalFilters).length > 0) {
      filteredByMainSearch = filteredByMainSearch.filter(client => {
        const advancedSearchTerm = activeModalFilters.searchTerm?.trim().toLowerCase();

        // Text search within selected fields (if advancedSearchTerm is present)
        if (advancedSearchTerm) {
          const fieldsToConsiderForAdvancedSearch: string[] = [];
          if (activeModalFilters.filterByName) fieldsToConsiderForAdvancedSearch.push(client.name?.toLowerCase() || '');
          if (activeModalFilters.filterByPhone) fieldsToConsiderForAdvancedSearch.push(client.phone?.toLowerCase() || '');
          if (activeModalFilters.filterByIdNumber) fieldsToConsiderForAdvancedSearch.push(client.idNumber?.toLowerCase() || '');
          if (activeModalFilters.filterByBankAccount) fieldsToConsiderForAdvancedSearch.push(client.bankAccount?.toLowerCase() || '');
          
          // If advancedSearchTerm is present, at least one corresponding filterBy... must be true and match
          if (fieldsToConsiderForAdvancedSearch.length > 0) {
            const matchesAdvanced = fieldsToConsiderForAdvancedSearch.some(fieldValue => fieldValue.includes(advancedSearchTerm));
            if (!matchesAdvanced) return false;
          } else {
            // If advancedSearchTerm is present but no filterBy flags are checked for it, it means this term doesn't apply to these specific fields.
            // Depending on desired behavior, one might allow the client to pass or fail here.
            // For now, if no checkboxes are selected for the advancedSearchTerm, the term itself doesn't cause a failure based on these fields.
            // However, if the intention is that advancedSearchTerm *must* match *something* if present, this else could be `return false;`
            // But typically, an empty selection of fields for a search term means the term is not applied against those fields.
          }
        } else { // No advancedSearchTerm, apply boolean flags as existence checks for common fields
          if (activeModalFilters.filterByName && !(client.name && client.name.trim() !== '')) return false;
          if (activeModalFilters.filterByPhone && !(client.phone && client.phone.trim() !== '')) return false;
          if (activeModalFilters.filterByIdNumber && !(client.idNumber && client.idNumber.trim() !== '')) return false;
          if (activeModalFilters.filterByBankAccount && !(client.bankAccount && client.bankAccount.trim() !== '')) return false;
        }

        // QR Code Filter
        if (activeModalFilters.filterByQrCode) {
          if (activeModalFilters.qrCodeValue && activeModalFilters.qrCodeValue.trim() !== '') {
            const qrValueToMatch = activeModalFilters.qrCodeValue.trim().toLowerCase();
            if (!client.qrCodeData || !client.qrCodeData.toLowerCase().includes(qrValueToMatch)) {
              return false;
            }
          } else { // filterByQrCode is true, but no specific qrCodeValue given: check for existence
            if (!client.qrCodeData || client.qrCodeData.trim() === '') return false;
          }
        }

        // Customer Card Filter
        if (activeModalFilters.filterByCustomerCard) {
          if (activeModalFilters.customerCardValue && activeModalFilters.customerCardValue.trim() !== '') {
            const cardValueToMatch = activeModalFilters.customerCardValue.trim().toLowerCase();
            if (!client.customerCardNumber || !client.customerCardNumber.toLowerCase().includes(cardValueToMatch)) {
              return false;
            }
          } else { // filterByCustomerCard is true, but no specific customerCardValue given: check for existence
            if (!client.customerCardNumber || client.customerCardNumber.trim() === '') return false;
          }
        }
        
        return true; // Client passes all active modal filters
      });
    }
    return filteredByMainSearch;
  }, [clients, searchTerm, activeModalFilters]);

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-grow w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search Customers by Name, Phone, ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={openFilterModal} className="flex-shrink-0">
            <FilterIcon className="h-5 w-5" />
          </Button>
          <Button onClick={onAddNewClient} className="w-full sm:w-auto flex-grow sm:flex-grow-0">
            <UserPlus className="mr-2 h-4 w-4" /> New Customer
          </Button>
        </div>
      </div>

      {isFilterModalOpen && (
        <ExchangePageClientSearchFilter
          isOpen={isFilterModalOpen}
          onClose={closeFilterModal}
          currentFilters={activeModalFilters}
          initialVisualState={initialModalFilters}
          onApplyFilters={handleApplyModalFilters}
          onResetFilters={handleResetModalFilters}
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[90px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : locallyFilteredEntities.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No customers found matching your search and filter criteria.</p>
      ) : (
        <div className="flex flex-col space-y-2 max-h-[400px] overflow-y-auto p-1 custom-scrollbar">
          {locallyFilteredEntities.map(client => {
            const isSelected = selectedClientId === (client.id || client.clientId);
            const showButtons = isSelected || hoveredClientId === (client.id || client.clientId);
            const idToUse = client.id || client.clientId;
            if (!idToUse) {
                console.warn("Client missing id and clientId:", client);
                return null;
            }

            return (
              <div 
                key={idToUse}
                className={cn(
                  "rounded-lg transition-all duration-200 ease-in-out flex flex-col cursor-pointer text-sm",
                  "bg-white dark:bg-gray-800 hover:shadow-xl dark:hover:bg-gray-700/80",
                  "min-h-[90px]",
                  "w-full",
                  isSelected 
                    ? "ring-2 ring-blue-500 shadow-xl border-transparent"
                    : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
                onClick={() => handleCardClick(client)}
                onMouseEnter={() => setHoveredClientId(idToUse)}
                onMouseLeave={() => setHoveredClientId(null)}
              >
                <div className="p-3 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-base text-gray-800 dark:text-white truncate mr-2 flex-shrink min-w-0">
                        {client.name}
                      </h3>
                      <AnimatePresence>
                      {showButtons && (
                        <motion.div 
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center space-x-1 flex-shrink-0"
                        >
                          <Button 
                            variant="ghost_icon_sm"
                            size="icon_xs"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              onViewClientHistory(client);
                            }}
                            title="View History"
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost_icon_sm"
                            size="icon_xs"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onViewClientDetails(client);
                            }}
                            title="View Details"
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                      </AnimatePresence>
                      {isSelected && !showButtons && (
                        <CheckCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0 ml-auto" />
                      )}
                    </div>
                    <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {client.idNumber && <p className="truncate">ID: {client.idType ? `${client.idType} - ` : ''}{client.idNumber}</p>}
                      {client.phone && <p className="truncate">Phone: {client.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExchangePageEntitySearch; 