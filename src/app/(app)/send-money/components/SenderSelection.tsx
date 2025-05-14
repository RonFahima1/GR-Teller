import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, CheckCircle, History, FilterIcon, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client, Document } from '../hooks/useSendMoneyForm';
import { ClientDetailsView } from './ClientDetailsView';
import { ClientSearchFilter, SearchFilters } from './ClientSearchFilter';
import { cn } from '@/lib/utils';

interface SenderSelectionProps {
  initialLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredClients: Client[];
  selectedSender: Client | null;
  setSelectedSender: (client: Client | null) => void;
  setShowNewSenderForm: (show: boolean) => void;
  onViewHistory?: (senderId: string) => void;
  onShowClientDocuments?: (documents: Document[]) => void;
  onShowClientLimits?: () => void;
  onAddClientPrepaidCard?: () => void;
  onShowClientSimCardDetails?: (simId: string) => void;
}

export const SenderSelection: React.FC<SenderSelectionProps> = ({
  initialLoading,
  searchQuery,
  setSearchQuery,
  filteredClients,
  selectedSender,
  setSelectedSender,
  setShowNewSenderForm,
  onViewHistory,
  onShowClientDocuments,
  onShowClientLimits,
  onAddClientPrepaidCard,
  onShowClientSimCardDetails,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSearchFilters, setActiveSearchFilters] = useState<Partial<SearchFilters>>({
    searchTerm: searchQuery,
    filterByName: true,
    filterByPhone: true,
    filterByIdNumber: true,
    filterByBankAccount: true,
    filterByQrCode: false,
    filterByCustomerCard: false,
  });

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [clientForDetailsModal, setClientForDetailsModal] = useState<Client | null>(null);
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveSearchFilters(prev => ({ ...prev, searchTerm: searchQuery }));
  }, [searchQuery]);

  const handleApplyFilters = (newFilters: Partial<SearchFilters>) => {
    setActiveSearchFilters(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: Partial<SearchFilters> = {
      searchTerm: searchQuery,
      filterByName: true,
      filterByPhone: true,
      filterByIdNumber: true,
      filterByBankAccount: true,
      filterByQrCode: false,
      filterByCustomerCard: false,
      qrCodeValue: '',
      customerCardValue: ''
    };
    setActiveSearchFilters(defaultFilters);
  };

  const openDetailsModal = (client: Client) => {
    setSelectedSender(client);
    setClientForDetailsModal(client);
    setIsDetailsModalOpen(true);
  };

  const locallyFilteredClients = React.useMemo(() => {
    let clientsToFilter = filteredClients;
    
    if (activeSearchFilters.searchTerm) {
        const term = activeSearchFilters.searchTerm.toLowerCase();
        clientsToFilter = clientsToFilter.filter(client => 
            (activeSearchFilters.filterByName && client.name.toLowerCase().includes(term)) ||
            (activeSearchFilters.filterByPhone && client.phone.includes(term)) ||
            (activeSearchFilters.filterByIdNumber && client.idNumber.toLowerCase().includes(term)) ||
            (activeSearchFilters.filterByBankAccount && client.bankAccount.toLowerCase().includes(term)) ||
            (activeSearchFilters.filterByCustomerCard && client.customerCardNumber?.toLowerCase().includes(activeSearchFilters.customerCardValue?.toLowerCase() || term)) ||
            (activeSearchFilters.filterByQrCode && client.qrCodeData?.toLowerCase().includes(activeSearchFilters.qrCodeValue?.toLowerCase() || term))
        );
    }
    if (activeSearchFilters.filterByQrCode && activeSearchFilters.qrCodeValue) {
        clientsToFilter = clientsToFilter.filter(c => c.qrCodeData?.toLowerCase().includes(activeSearchFilters.qrCodeValue!.toLowerCase()));
    }
    if (activeSearchFilters.filterByCustomerCard && activeSearchFilters.customerCardValue) {
        clientsToFilter = clientsToFilter.filter(c => c.customerCardNumber?.toLowerCase().includes(activeSearchFilters.customerCardValue!.toLowerCase()));
    }

    return clientsToFilter;
  }, [filteredClients, activeSearchFilters]);

  if (initialLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search Senders by Name, Phone, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)} className="flex-shrink-0">
              <FilterIcon className="h-5 w-5" />
            </Button>
            <Button onClick={() => setShowNewSenderForm(true)} className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              <UserPlus className="mr-2 h-4 w-4" /> New Sender
            </Button>
        </div>
      </div>

      {locallyFilteredClients.length === 0 && (searchQuery !== '' || Object.values(activeSearchFilters).some(v => typeof v === 'boolean' && v === true && (v !== activeSearchFilters.filterByName && v !== activeSearchFilters.filterByPhone && v !== activeSearchFilters.filterByIdNumber && v !== activeSearchFilters.filterByBankAccount))) && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No senders found matching your search and filter criteria.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {locallyFilteredClients.map((client) => {
          const isSelected = selectedSender?.id === client.id;
          const showButtons = isSelected || hoveredClientId === client.id;
          return (
            <div 
              key={client.id} 
              className={cn(
                "rounded-lg transition-all duration-200 ease-in-out flex flex-col cursor-pointer text-sm",
                "bg-white dark:bg-gray-800 hover:shadow-xl dark:hover:bg-gray-700/80",
                "min-h-[90px]",
                isSelected 
                  ? "ring-2 ring-blue-500 shadow-xl border-transparent"
                  : "border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
              onClick={() => {
                setSelectedSender(client);
                if (onViewHistory) {
                  onViewHistory(client.id);
                }
              }}
              onMouseEnter={() => setHoveredClientId(client.id)}
              onMouseLeave={() => setHoveredClientId(null)}
            >
              <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-base text-gray-800 dark:text-white truncate mr-2 flex-shrink min-w-0">
                      {client.firstName} {client.lastName}
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
                        {onViewHistory && (
                          <Button 
                            variant="ghost_icon_sm"
                            size="icon_xs"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              if (onViewHistory) onViewHistory(client.id);
                            }}
                            title="View History"
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost_icon_sm"
                          size="icon_xs"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              openDetailsModal(client);
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
                    <p className="truncate">ID: {client.idType} - {client.idNumber}</p>
                    <p className="truncate">Phone: {client.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ClientSearchFilter 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={activeSearchFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      <ClientDetailsView 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        client={clientForDetailsModal}
        onShowDocuments={onShowClientDocuments} 
        onShowLimits={onShowClientLimits}
        onAddPrepaidCard={onAddClientPrepaidCard}
        onShowSimCardDetails={onShowClientSimCardDetails}
      />
    </div>
  );
};
