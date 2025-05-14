import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowLeftRight, RefreshCw, Info, Star, Clipboard, Check, TrendingUp, Calculator, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { IOSCardHeader } from '@/components/ui/IOSCardHeader';
import { Currency, ExchangeData } from '../hooks/useCurrencyExchange';
import { cn } from '@/lib/utils';

interface ModernExchangeFormProps {
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

export const ModernExchangeForm: React.FC<ModernExchangeFormProps> = ({
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
  const [copiedRate, setCopiedRate] = useState(false);
  
  const fromCurrency = currencies.find(c => c.code === exchangeData.fromCurrency) || currencies[0];
  const toCurrency = currencies.find(c => c.code === exchangeData.toCurrency) || currencies[1];
  
  const fee = calculateFee(parseFloat(exchangeData.fromAmount) || 0);
  const totalAmount = calculateTotalAmount(parseFloat(exchangeData.fromAmount) || 0);
  
  const handleCopyRate = () => {
    const rateText = `1 ${fromCurrency.code} = ${exchangeData.rate.toFixed(4)} ${toCurrency.code}`;
    navigator.clipboard.writeText(rateText);
    setCopiedRate(true);
    setTimeout(() => setCopiedRate(false), 2000);
  };

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
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Exchange Card */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Integrated iOS-style Card Header */}
        <IOSCardHeader
          title="Currency Exchange"
          subtitle="Convert between currencies at the best rates"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30"
          rightContent={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full text-xs">
                <span className="font-medium text-gray-500 dark:text-gray-400">Rate:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  1 {fromCurrency.code} = {exchangeData.rate.toFixed(4)} {toCurrency.code}
                </span>
                <motion.button
                  className="text-blue-600 dark:text-blue-400 p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyRate}
                >
                  {copiedRate ? <Check size={12} /> : <Clipboard size={12} />}
                </motion.button>
              </div>
            </div>
          }
        />
        
        {/* Responsive Layout Container - optimized for all device sizes */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Side - Currency Selection */}
          <div className="w-full">
            {/* Exchange Direction */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">You Send</h3>
              
              <motion.button
                onClick={swapCurrencies}
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200 text-blue-600 dark:text-blue-400"
                whileTap={{ scale: 0.95 }}
                disabled={isFlipping}
                aria-label="Swap currencies"
              >
                <ArrowLeftRight size={18} />
              </motion.button>
              
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">You Receive</h3>
            </div>
            
            {/* Currency Selection Cards - Horizontal on Desktop */}
            <div className="flex flex-col lg:flex-row gap-4 relative">
              {/* From Currency */}
              <motion.div 
                className={cn(
                  "flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow",
                  isFlipping && "animate-pulse",
                  errors.fromAmount && "border-red-300 dark:border-red-800"
                )}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xl">
                    {fromCurrency.flag}
                  </div>
                  <div>
                    <div 
                      className="flex items-center gap-1 cursor-pointer" 
                      onClick={() => setShowCurrencySelector('from')}
                    >
                      <span className="text-lg font-semibold">{fromCurrency.code}</span>
                      <ArrowDown size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{fromCurrency.name}</div>
                  </div>
                  <motion.button
                    onClick={() => toggleFavorite(fromCurrency.code)}
                    className="ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star
                      size={16}
                      className={cn(
                        favorites.includes(fromCurrency.code)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400 dark:text-gray-600"
                      )}
                    />
                  </motion.button>
                </div>
                
                {/* Input Field */}
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={exchangeData.fromAmount}
                      onChange={(e) => handleFromAmountChange(e.target.value)}
                      className={cn(
                        "w-full text-2xl font-semibold bg-transparent border-0 focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-400",
                        errors.fromAmount && "text-red-500 dark:text-red-400"
                      )}
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {fromCurrency.symbol}
                    </div>
                  </div>
                  {errors.fromAmount && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.fromAmount}</p>
                  )}
                </div>
              </motion.div>
              
              {/* Currency Swap Arrow for Mobile */}
              <div className="flex lg:hidden items-center justify-center my-2">
                <motion.button
                  onClick={swapCurrencies}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 transition-colors duration-200"
                  whileTap={{ scale: 0.95 }}
                  disabled={isFlipping}
                >
                  <ArrowDown size={20} className="text-blue-600 dark:text-blue-400" />
                </motion.button>
              </div>
              
              {/* Arrow for Desktop - Center */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="w-10 h-px bg-gray-200 dark:bg-gray-700 relative">
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 text-gray-400 dark:text-gray-500">→</div>
                </div>
              </div>
              
              {/* To Currency */}
              <motion.div 
                className={cn(
                  "flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow",
                  isFlipping && "animate-pulse"
                )}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-xl">
                    {toCurrency.flag}
                  </div>
                  <div>
                    <div 
                      className="flex items-center gap-1 cursor-pointer" 
                      onClick={() => setShowCurrencySelector('to')}
                    >
                      <span className="text-lg font-semibold">{toCurrency.code}</span>
                      <ArrowDown size={16} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{toCurrency.name}</div>
                  </div>
                  <motion.button
                    onClick={() => toggleFavorite(toCurrency.code)}
                    className="ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star
                      size={16}
                      className={cn(
                        favorites.includes(toCurrency.code)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400 dark:text-gray-600"
                      )}
                    />
                  </motion.button>
                </div>
                
                {/* Result Field */}
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={exchangeData.toAmount}
                      onChange={(e) => handleToAmountChange(e.target.value)}
                      className="w-full text-2xl font-semibold bg-transparent border-0 focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-400"
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      {toCurrency.symbol}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Right Side - Exchange Details */}
          <div className="w-full md:border-l md:border-gray-200 md:dark:border-gray-800 md:pl-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">Exchange Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Calculator size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Exchange Amount</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatAmount(exchangeData.fromAmount, fromCurrency)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate</span>
                  </div>
                  <span className="text-sm font-medium">
                    1 {fromCurrency.code} = {exchangeData.rate.toFixed(4)} {toCurrency.code}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fee</span>
                  <span className="text-sm font-medium">
                    {fromCurrency.symbol}{fee.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Total</span>
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {fromCurrency.symbol}{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="terms" 
                  checked={exchangeData.termsAccepted}
                  onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.termsAccepted}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={processExchange}
                disabled={isLoading || !exchangeData.termsAccepted || !exchangeData.fromAmount || parseFloat(exchangeData.fromAmount) <= 0}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-base"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Exchange Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Currency Selector Modal */}
      <AnimatePresence>
        {showCurrencySelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select {showCurrencySelector === 'from' ? 'Source' : 'Target'} Currency
                </h3>
                <button
                  onClick={() => setShowCurrencySelector(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-2 overflow-y-auto apple-scroll flex-1">
                {/* Favorites */}
                {favorites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">Favorites</h4>
                    <div className="flex flex-wrap gap-2 px-2">
                      {favorites.map(code => {
                        const currency = currencies.find(c => c.code === code);
                        if (!currency) return null;
                        
                        return (
                          <Button
                            key={code}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              showCurrencySelector === 'from' 
                                ? handleFromCurrencyChange(code)
                                : handleToCurrencyChange(code);
                              setShowCurrencySelector(null);
                            }}
                            className={cn(
                              "border-gray-200 dark:border-gray-800",
                              (showCurrencySelector === 'from' ? exchangeData.fromCurrency : exchangeData.toCurrency) === code &&
                              "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                            )}
                          >
                            {currency.flag} {code}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* All Currencies */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">All Currencies</h4>
                  <div className="space-y-1">
                    {currencies.map(currency => (
                      <div
                        key={currency.code}
                        onClick={() => {
                          showCurrencySelector === 'from' 
                            ? handleFromCurrencyChange(currency.code)
                            : handleToCurrencyChange(currency.code);
                          setShowCurrencySelector(null);
                        }}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg cursor-pointer",
                          (showCurrencySelector === 'from' ? exchangeData.fromCurrency : exchangeData.toCurrency) === currency.code
                            ? "bg-blue-50 dark:bg-blue-900/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            {currency.flag}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{currency.code}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{currency.name}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {favorites.includes(currency.code) && (
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {currency.rate.toFixed(4)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
