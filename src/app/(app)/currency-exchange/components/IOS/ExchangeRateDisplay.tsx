import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeftRight, Copy, Info, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Currency } from '../../hooks/useCurrencyExchange';

interface ExchangeRateDisplayProps {
  fromCurrency: Currency;
  toCurrency: Currency;
  rate: number;
  isLoading: boolean;
  swapCurrencies: () => void;
  lastUpdated: Date;
}

export const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  fromCurrency,
  toCurrency,
  rate,
  isLoading,
  swapCurrencies,
  lastUpdated,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const rateText = `1 ${fromCurrency.code} = ${rate.toFixed(4)} ${toCurrency.code}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(rateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formattedTime = lastUpdated.toLocaleTimeString([], {
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
      <div className="flex flex-col items-center">
        {/* Rate Display */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Exchange Rate
          </div>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Info className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
          </button>
        </div>
        
        {/* Rate Value with Copy Button */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="font-semibold text-gray-900 dark:text-white">
            {rateText}
          </div>
          <button
            onClick={copyToClipboard}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        
        {/* Rate Info */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full overflow-hidden mb-3"
            >
              <div className="text-xs text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <div className="mb-1">Updated at {formattedTime}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm">
                      {fromCurrency.flag}
                    </div>
                    <span>{fromCurrency.code}: {fromCurrency.symbol}1.00</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm">
                      {toCurrency.flag}
                    </div>
                    <span>{toCurrency.code}: {toCurrency.symbol}{rate.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Swap Button */}
        <motion.button
          onClick={swapCurrencies}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowLeftRight className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
