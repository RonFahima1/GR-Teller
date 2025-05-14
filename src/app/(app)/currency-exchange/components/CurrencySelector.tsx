import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IOSCard } from '@/components/ui/IOSCard';
import { Currency } from '../hooks/useCurrencyExchange';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  currencies: Currency[];
  favorites: string[];
  toggleFavorite: (currency: string) => void;
  isFlipping?: boolean;
  side: 'from' | 'to';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  value,
  onValueChange,
  currencies,
  favorites,
  toggleFavorite,
  isFlipping = false,
  side
}) => {
  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];
  
  return (
    <motion.div 
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: side === 'from' ? 0.1 : 0.3 }}
    >
      <label className="text-base font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <IOSCard 
        variant="default" 
        padding="medium"
        className={cn(
          "relative overflow-hidden",
          isFlipping && "animate-pulse"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl">
            {selectedCurrency.flag}
          </div>
          
          <div className="flex-grow">
            <Select value={value} onValueChange={onValueChange}>
              <SelectTrigger className="w-full border-none shadow-none h-12 pl-0 focus:ring-0">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">{selectedCurrency.code}</span>
                    <span className="text-sm text-gray-500">{selectedCurrency.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              
              <SelectContent className="max-h-[300px]">
                <div className="p-2 sticky top-0 bg-white dark:bg-gray-900 z-10 border-b">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Favorites</div>
                  <div className="flex flex-wrap gap-1">
                    {favorites.map(code => {
                      const currency = currencies.find(c => c.code === code);
                      if (!currency) return null;
                      
                      return (
                        <button
                          key={code}
                          onClick={() => onValueChange(code)}
                          className={cn(
                            "px-2 py-1 rounded-md text-sm font-medium transition-colors",
                            code === value 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          )}
                        >
                          {currency.flag} {code}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-1">All Currencies</div>
                  {currencies.map(currency => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{currency.flag}</span>
                          <div>
                            <div className="font-medium">{currency.code}</div>
                            <div className="text-xs text-gray-500">{currency.name}</div>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(currency.code);
                          }}
                          className={cn(
                            "p-1 rounded-full transition-colors",
                            favorites.includes(currency.code) 
                              ? "text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30" 
                              : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                        >
                          <Star className="h-4 w-4" fill={favorites.includes(currency.code) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </IOSCard>
    </motion.div>
  );
};
