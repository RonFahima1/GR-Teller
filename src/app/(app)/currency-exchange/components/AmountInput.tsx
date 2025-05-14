import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { IOSCard } from '@/components/ui/IOSCard';
import { Currency } from '../hooks/useCurrencyExchange';
import { cn } from '@/lib/utils';

interface AmountInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency: string;
  currencies: Currency[];
  error?: string;
  isFlipping?: boolean;
  side: 'from' | 'to';
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  currency,
  currencies,
  error,
  isFlipping = false,
  side
}) => {
  const selectedCurrency = currencies.find(c => c.code === currency) || currencies[0];
  
  return (
    <motion.div 
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: side === 'from' ? 0.2 : 0.4 }}
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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 text-lg">{selectedCurrency.symbol}</span>
          </div>
          
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className={cn(
              "pl-8 h-14 text-xl font-medium bg-transparent border-none shadow-none focus:ring-0",
              error ? "text-red-500" : "text-gray-900 dark:text-gray-100"
            )}
          />
          
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{selectedCurrency.code}</span>
          </div>
        </div>
      </IOSCard>
      
      {error && (
        <motion.p 
          className="text-sm text-red-500 mt-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
