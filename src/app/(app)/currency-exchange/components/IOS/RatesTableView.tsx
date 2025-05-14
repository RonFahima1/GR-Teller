import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Currency } from '../../hooks/useCurrencyExchange';

interface RatesTableViewProps {
  currencies: Currency[];
  baseCurrency: string;
  favorites: string[];
  onToggleFavorite: (code: string) => void;
}

export const RatesTableView: React.FC<RatesTableViewProps> = ({
  currencies,
  baseCurrency,
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: 'code' | 'name' | 'rate';
    direction: 'ascending' | 'descending';
  }>({
    key: 'code',
    direction: 'ascending',
  });
  
  // Filter currencies based on search query
  const filteredCurrencies = currencies.filter(currency => {
    // Don't show base currency in the list
    if (currency.code === baseCurrency) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query)
    );
  });
  
  // Sort currencies based on sort config
  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    if (sortConfig.key === 'rate') {
      return sortConfig.direction === 'ascending'
        ? a.rate - b.rate
        : b.rate - a.rate;
    }
    
    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });
  
  // Request sort for a column
  const requestSort = (key: 'code' | 'name' | 'rate') => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      setSortConfig({
        key,
        direction: 'ascending',
      });
    }
  };
  
  // Get sort direction indicator
  const getSortDirectionIndicator = (key: 'code' | 'name' | 'rate') => {
    if (sortConfig.key !== key) return null;
    
    return (
      <ArrowUpDown 
        className={cn(
          "h-3.5 w-3.5 ml-1",
          sortConfig.direction === 'ascending' ? 'text-blue-500' : 'text-blue-500 rotate-180'
        )}
      />
    );
  };
  
  // Format rate with base currency
  const formatRate = (rate: number, baseCurrencyObj: Currency | undefined) => {
    const baseCurrObj = baseCurrencyObj || currencies.find(c => c.code === baseCurrency);
    if (!baseCurrObj) return rate.toFixed(4);
    
    // Calculate the relative rate
    return (rate / baseCurrObj.rate).toFixed(4);
  };
  
  // Get the base currency object
  const baseCurrencyObj = currencies.find(c => c.code === baseCurrency);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Search Input */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
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
      
      {/* Base Currency Selection */}
      {baseCurrencyObj && (
        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-base">
              {baseCurrencyObj.flag}
            </div>
            <div>
              <div className="text-xs text-blue-600 dark:text-blue-400">Base Currency</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {baseCurrencyObj.code} - {baseCurrencyObj.name}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table Header */}
      <div className="grid grid-cols-5 px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
        <button
          className="col-span-1 flex items-center justify-start text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => requestSort('code')}
        >
          Code {getSortDirectionIndicator('code')}
        </button>
        <button
          className="col-span-2 flex items-center justify-start text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => requestSort('name')}
        >
          Currency {getSortDirectionIndicator('name')}
        </button>
        <button
          className="col-span-1 flex items-center justify-end text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
          onClick={() => requestSort('rate')}
        >
          Rate {getSortDirectionIndicator('rate')}
        </button>
        <div className="col-span-1 flex items-center justify-end text-xs font-medium text-gray-500 dark:text-gray-400">
          Favorite
        </div>
      </div>
      
      {/* Table Body */}
      <div className="max-h-96 overflow-y-auto">
        {sortedCurrencies.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No currencies matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedCurrencies.map((currency, index) => (
              <motion.div
                key={currency.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="grid grid-cols-5 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="col-span-1 flex items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-base mr-2">
                    {currency.flag}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currency.code}
                  </span>
                </div>
                <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {currency.name}
                </div>
                <div className="col-span-1 flex items-center justify-end font-medium text-gray-900 dark:text-white">
                  {formatRate(currency.rate, baseCurrencyObj)}
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <button
                    onClick={() => onToggleFavorite(currency.code)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-yellow-500"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        favorites.includes(currency.code) && "fill-yellow-400 text-yellow-400"
                      )}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
