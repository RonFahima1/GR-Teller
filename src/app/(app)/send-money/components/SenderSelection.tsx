import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client, Document } from '../hooks/useSendMoneyForm';
import { ClientDetailsView } from './ClientDetailsView';
import { ClientSearchFilter, SearchFilters } from './ClientSearchFilter';
import { cn } from '@/lib/utils';

// Import Apple-styled components
import SearchAndFilterBar from './apple/SearchAndFilterBar';
import SenderCard from './apple/SenderCard';
import EmptyStateView from './apple/EmptyStateView';

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

  // Check if there are no results with active filters
  const hasActiveFilters = 
    activeSearchFilters.filterByQrCode || 
    activeSearchFilters.filterByCustomerCard || 
    activeSearchFilters.qrCodeValue || 
    activeSearchFilters.customerCardValue || 
    searchQuery !== '';
    
  const hasNoResults = locallyFilteredClients.length === 0 && hasActiveFilters;

  return (
    <div className="space-y-6 w-full max-w-screen-xl mx-auto">
      {/* Search and filter bar */}
      <SearchAndFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClickFilter={() => setIsFilterOpen(true)}
        onClickNewSender={() => setShowNewSenderForm(true)}
      />

      {/* Empty state */}
      <AnimatePresence>
        {hasNoResults && (
          <EmptyStateView 
            message="No senders found matching your search criteria. Try adjusting your filters or add a new sender."
            showAddButton={true}
            onClickAdd={() => setShowNewSenderForm(true)}
          />
        )}
      </AnimatePresence>

      {/* Grid of sender cards */}
      {!hasNoResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {locallyFilteredClients.map((client) => (
            <SenderCard
              key={client.id}
              client={client}
              isSelected={selectedSender?.id === client.id}
              isHovered={hoveredClientId === client.id}
              onSelect={() => {
                setSelectedSender(client);
                if (onViewHistory) {
                  onViewHistory(client.id);
                }
              }}
              onViewHistory={onViewHistory}
              onViewDetails={openDetailsModal}
              onMouseEnter={() => setHoveredClientId(client.id)}
              onMouseLeave={() => setHoveredClientId(null)}
            />
          ))}
        </div>
      )}

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
