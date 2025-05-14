import React from 'react';
import { motion } from 'framer-motion';
import { Star, RefreshCw, ArrowUpDown } from 'lucide-react';
import { IOSCard } from '@/components/ui/IOSCard';
import { IOSSectionHeader } from '@/components/ui/IOSSectionHeader';
import { Button } from '@/components/ui/button';
import { Currency } from '../hooks/useCurrencyExchange';
import { cn } from '@/lib/utils';

interface RatesTableProps {
  currencies: Currency[];
  favorites: string[];
  toggleFavorite: (currency: string) => void;
  refreshRates: () => void;
  isLoading: boolean;
  lastUpdated: Date;
  baseCurrency?: string;
}

export const RatesTable: React.FC<RatesTableProps> = ({
  currencies,
  favorites,
  toggleFavorite,
  refreshRates,
  isLoading,
  lastUpdated,
  baseCurrency = 'USD'
}) => {
  const [sortBy, setSortBy] = React.useState<'code' | 'rate'>('code');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  const handleSort = (column: 'code' | 'rate') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const sortedCurrencies = [...currencies].sort((a, b) => {
    if (sortBy === 'code') {
      return sortDirection === 'asc' 
        ? a.code.localeCompare(b.code)
        : b.code.localeCompare(a.code);
    } else {
      return sortDirection === 'asc' 
        ? a.rate - b.rate
        : b.rate - a.rate;
    }
  });
  
  // Get the base currency for rate calculation
  const base = currencies.find(c => c.code === baseCurrency) || currencies[0];
  
  return (
    <div className="space-y-6">
      <IOSSectionHeader 
        title="Exchange Rates"
        subtitle={`All rates are relative to ${baseCurrency}`}
        centered={true}
      />
      
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRates}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        </div>
        
        <IOSCard variant="default" padding="medium">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Favorite</th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Currency</span>
                      {sortBy === 'code' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                    onClick={() => handleSort('rate')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Rate</span>
                      {sortBy === 'rate' && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCurrencies.map((currency, index) => (
                  <motion.tr
                    key={currency.code}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFavorite(currency.code)}
                        className={cn(
                          "p-1 rounded-full transition-colors",
                          favorites.includes(currency.code) 
                            ? "text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" 
                            : "text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <Star 
                          className="h-4 w-4" 
                          fill={favorites.includes(currency.code) ? "currentColor" : "none"} 
                        />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currency.flag}</span>
                        <div>
                          <div className="font-medium">{currency.code}</div>
                          <div className="text-xs text-gray-500">{currency.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {(currency.rate / base.rate).toFixed(4)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </IOSCard>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Rates are provided for informational purposes only and do not constitute financial advice.</p>
        </div>
      </div>
    </div>
  );
};
