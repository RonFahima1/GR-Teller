import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Currency } from '../../hooks/useCurrencyExchange';

interface CurrencySelectorProps {
  isOpen: boolean;
  title: string;
  currencies: Currency[];
  favorites: string[];
  selectedCurrency: string;
  onSelect: (code: string) => void;
  onToggleFavorite: (code: string) => void;
  onClose: () => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  isOpen,
  title,
  currencies,
  favorites,
  selectedCurrency,
  onSelect,
  onToggleFavorite,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredCurrencies = currencies.filter(currency => {
    const query = searchQuery.toLowerCase();
    return (
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query)
    );
  });
  
  const favoritesList = filteredCurrencies.filter(currency => 
    favorites.includes(currency.code)
  );
  
  const otherCurrencies = filteredCurrencies.filter(currency => 
    !favorites.includes(currency.code)
  );
  
  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="absolute inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-md sm:max-h-[80vh] bg-white dark:bg-gray-900 shadow-2xl sm:rounded-xl flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search currency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Currency list */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Favorites section */}
              {favoritesList.length > 0 && (
                <div className="mb-4">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Favorites
                  </div>
                  <div className="space-y-1">
                    {favoritesList.map(currency => (
                      <CurrencyItem
                        key={currency.code}
                        currency={currency}
                        isSelected={currency.code === selectedCurrency}
                        isFavorite={true}
                        onSelect={() => {
                          onSelect(currency.code);
                          onClose();
                        }}
                        onToggleFavorite={() => onToggleFavorite(currency.code)}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* All currencies section */}
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  All Currencies
                </div>
                <div className="space-y-1">
                  {otherCurrencies.map(currency => (
                    <CurrencyItem
                      key={currency.code}
                      currency={currency}
                      isSelected={currency.code === selectedCurrency}
                      isFavorite={false}
                      onSelect={() => {
                        onSelect(currency.code);
                        onClose();
                      }}
                      onToggleFavorite={() => onToggleFavorite(currency.code)}
                    />
                  ))}
                </div>
              </div>
              
              {filteredCurrencies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No currencies found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Currency list item component
interface CurrencyItemProps {
  currency: Currency;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({
  currency,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer",
        isSelected 
          ? "bg-blue-50 dark:bg-blue-900/20" 
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg">
          {currency.flag}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {currency.code}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currency.name}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-1.5 rounded-full text-gray-400 hover:text-yellow-500"
        >
          <Star
            className={cn(
              "h-4 w-4",
              isFavorite && "fill-yellow-400 text-yellow-400"
            )}
          />
        </button>
      </div>
    </div>
  );
};
