import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftRight, 
  ArrowDown, 
  Wallet, 
  Star, 
  Check, 
  RefreshCw, 
  ChevronDown,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Currency, ExchangeData } from '../hooks/useCurrencyExchange';
import { cn } from '@/lib/utils';

interface AppleExchangeFormProps {
  currencies: Currency[];
  exchangeData: ExchangeData;
  handleFromAmountChange: (value: string) => void;
  handleToAmountChange: (value: string) => void;
  handleFromCurrencyChange: (value: string) => void;
  handleToCurrencyChange: (value: string) => void;
  swapCurrencies: () => void;
  toggleFavorite: (currency: string) => void;
  processExchange: () => void;
  favorites: string[];
  errors: Record<string, string>;
  isLoading: boolean;
  isFlipping: boolean;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  calculateFee: (amount: number) => number;
  calculateTotalAmount: (amount: number) => number;
}

export const AppleExchangeForm: React.FC<AppleExchangeFormProps> = ({
  currencies,
  exchangeData,
  handleFromAmountChange,
  handleToAmountChange,
  handleFromCurrencyChange,
  handleToCurrencyChange,
  swapCurrencies,
  toggleFavorite,
  processExchange,
  favorites,
  errors,
  isLoading,
  isFlipping,
  handleCheckboxChange,
  calculateFee,
  calculateTotalAmount
}) => {
  const [showCurrencySelector, setShowCurrencySelector] = useState<'from' | 'to' | null>(null);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  // Effect for detecting screen size
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768);
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const fromCurrency = currencies.find(c => c.code === exchangeData.fromCurrency) || currencies[0];
  const toCurrency = currencies.find(c => c.code === exchangeData.toCurrency) || currencies[1];
  
  const fee = calculateFee(parseFloat(exchangeData.fromAmount) || 0);
  const totalAmount = calculateTotalAmount(parseFloat(exchangeData.fromAmount) || 0);
  
  // Format amount with proper currency symbol and decimals
  const formatAmount = (amount: string, currency: Currency) => {
    if (!amount) return currency.symbol + '0';
    
    // Format with appropriate decimal places
    const num = parseFloat(amount);
    if (isNaN(num)) return currency.symbol + '0';
    
    // Different currencies have different decimal conventions
    let decimalPlaces = 2;
    if (currency.code === 'JPY') decimalPlaces = 0;
    
    return currency.symbol + num.toFixed(decimalPlaces);
  };
  
  // Handle the exchange rate display
  const [showRateInfo, setShowRateInfo] = useState(false);
  
  return (
    <div className="w-full min-h-[calc(100vh-7rem)]">
      {/* Currency Exchange Form - Apple Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Left Panel - From Currency */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-800/60 backdrop-blur-sm overflow-hidden md:col-span-1">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              Source
            </h3>
          </div>
          
          <div className="p-4">
            {/* Currency Selector */}
            <button 
              onClick={() => setShowCurrencySelector('from')} 
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg">
                  {fromCurrency.flag}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    {fromCurrency.code}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{fromCurrency.name}</div>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(fromCurrency.code);
                }} 
                className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400"
              >
                <Star className={cn(
                  "h-4 w-4",
                  favorites.includes(fromCurrency.code) && "fill-yellow-400 text-yellow-400"
                )} />
              </button>
            </button>
            
            {/* Amount Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                You Send
              </label>
              <div className={cn(
                "relative rounded-lg overflow-hidden border transition-colors",
                errors.fromAmount 
                  ? "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              )}>
                <input
                  type="text"
                  value={exchangeData.fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className={cn(
                    "w-full text-lg font-semibold py-3 px-4 border-0 focus:ring-0 focus:outline-none",
                    errors.fromAmount 
                      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10" 
                      : "text-gray-900 dark:text-white bg-transparent"
                  )}
                  placeholder="0.00"
                  inputMode="decimal"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
                  {fromCurrency.code}
                </div>
              </div>
              {errors.fromAmount && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.fromAmount}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Middle Panel - Exchange Controls */}
        <div className={cn(
          "flex flex-col md:justify-center items-center",
          orientation === 'landscape' ? "md:flex-row" : "md:flex-col",
          "md:col-span-2 lg:col-span-1"
        )}>
          {/* Exchange Rate Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-800/60 p-4 w-full md:w-auto mb-4 md:mb-0">
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exchange Rate</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 mb-2">
                1 {fromCurrency.code} = {exchangeData.rate.toFixed(4)} {toCurrency.code}
                <button 
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  onClick={() => setShowRateInfo(!showRateInfo)}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <AnimatePresence>
                {showRateInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-md text-center">
                      Updated {new Date().toLocaleTimeString()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Swap Button */}
              <motion.button
                onClick={swapCurrencies}
                className="mt-4 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow transition-all duration-200"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                disabled={isFlipping}
              >
                <ArrowLeftRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Right Panel - To Currency */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-800/60 backdrop-blur-sm overflow-hidden md:col-span-1">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-500" />
              Destination
            </h3>
          </div>
          
          <div className="p-4">
            {/* Currency Selector */}
            <button 
              onClick={() => setShowCurrencySelector('to')} 
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg">
                  {toCurrency.flag}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                    {toCurrency.code}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{toCurrency.name}</div>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(toCurrency.code);
                }} 
                className="text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400"
              >
                <Star className={cn(
                  "h-4 w-4",
                  favorites.includes(toCurrency.code) && "fill-yellow-400 text-yellow-400"
                )} />
              </button>
            </button>
            
            {/* Amount Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                You Receive
              </label>
              <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <input
                  type="text"
                  value={exchangeData.toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  className="w-full text-lg font-semibold py-3 px-4 border-0 focus:ring-0 focus:outline-none text-gray-900 dark:text-white bg-transparent"
                  placeholder="0.00"
                  inputMode="decimal"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
                  {toCurrency.code}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Panel - Summary & Actions */}
      <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-800/60 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
            Transaction Summary
          </h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left - Transaction Details */}
            <div>
              <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Exchange Amount</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{formatAmount(exchangeData.fromAmount, fromCurrency)}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">1 {fromCurrency.code} = {exchangeData.rate.toFixed(4)} {toCurrency.code}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Recipient Gets</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{formatAmount(exchangeData.toAmount, toCurrency)}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Fee</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{fromCurrency.symbol}{fee.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between py-2.5">
                  <dt className="text-sm font-semibold text-gray-700 dark:text-gray-200">Total</dt>
                  <dd className="text-sm font-semibold text-gray-900 dark:text-white">{fromCurrency.symbol}{totalAmount.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
            
            {/* Right - Terms & Action Button */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-2 mb-4">
                  <Checkbox 
                    id="terms" 
                    checked={exchangeData.termsAccepted}
                    onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
                    className="mt-1"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    I agree to the terms and conditions and understand that currency exchange rates are subject to change.
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-xs text-red-600 dark:text-red-400 mb-4">{errors.termsAccepted}</p>
                )}
              </div>
              
              <Button
                onClick={processExchange}
                disabled={isLoading || !exchangeData.termsAccepted || !exchangeData.fromAmount || parseFloat(exchangeData.fromAmount) <= 0}
                className="w-full py-6 text-base font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing Exchange
                  </span>
                ) : (
                  'Exchange Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Currency Selector Modal */}
      <AnimatePresence>
        {showCurrencySelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Select {showCurrencySelector === 'from' ? 'Source' : 'Destination'} Currency
                </h3>
                <button
                  onClick={() => setShowCurrencySelector(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto flex-1 apple-scroll">
                {favorites.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Favorites</h4>
                    <div className="flex flex-wrap gap-2">
                      {favorites.map(code => {
                        const currency = currencies.find(c => c.code === code);
                        if (!currency) return null;
                        
                        return (
                          <button
                            key={code}
                            onClick={() => {
                              showCurrencySelector === 'from'
                                ? handleFromCurrencyChange(code)
                                : handleToCurrencyChange(code);
                              setShowCurrencySelector(null);
                            }}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
                              (showCurrencySelector === 'from' ? exchangeData.fromCurrency : exchangeData.toCurrency) === code
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                          >
                            <span>{currency.flag}</span>
                            {currency.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">All Currencies</h4>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {currencies.map(currency => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          showCurrencySelector === 'from'
                            ? handleFromCurrencyChange(currency.code)
                            : handleToCurrencyChange(currency.code);
                          setShowCurrencySelector(null);
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
                            {currency.flag}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900 dark:text-white">{currency.code}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{currency.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {favorites.includes(currency.code) && (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          )}
                          {(showCurrencySelector === 'from' ? exchangeData.fromCurrency : exchangeData.toCurrency) === currency.code && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                            {currency.rate.toFixed(4)}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
