import React from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Currency } from '../../hooks/useCurrencyExchange';

interface CurrencyCardProps {
  label: string;
  currency: Currency;
  isFavorite: boolean;
  onSelectClick: () => void;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  iconColor: string;
  iconBgColor: string;
}

export const CurrencyCard: React.FC<CurrencyCardProps> = ({
  label,
  currency,
  isFavorite,
  onSelectClick,
  onFavoriteToggle,
  iconColor,
  iconBgColor,
}) => {
  return (
    <button
      onClick={onSelectClick}
      className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-xl",
            `${iconBgColor}`
          )}
        >
          {currency.flag}
        </div>
        <div className="text-left">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </div>
          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            {currency.code}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currency.name}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={onFavoriteToggle}
        className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400"
        whileTap={{ scale: 0.9 }}
      >
        <Star
          className={cn(
            "h-5 w-5 transition-all duration-200",
            isFavorite && "fill-yellow-400 text-yellow-400"
          )}
        />
      </motion.button>
    </button>
  );
};
