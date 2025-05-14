import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Currency, ExchangeData } from '../../hooks/useCurrencyExchange';
import { CurrencyCard } from './CurrencyCard';
import { AmountInput } from './AmountInput';
import { ExchangeRateDisplay } from './ExchangeRateDisplay';
import { TransactionSummary } from './TransactionSummary';
import { CurrencySelector } from './CurrencySelector';

interface IOSExchangeFormProps {
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

export const IOSExchangeForm: React.FC<IOSExchangeFormProps> = ({
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
  // State for currency selector modal
  const [currencySelectorOpen, setCurrencySelectorOpen] = useState(false);
  const [currentSelector, setCurrentSelector] = useState<'from' | 'to' | null>(null);
  
  // Responsive layout state
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait' as 'portrait' | 'landscape'
  });
  
  // Update device type and orientation on mount and resize
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceType({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };
    
    // Initial check
    updateDeviceType();
    
    // Add listener for window resize
    window.addEventListener('resize', updateDeviceType);
    
    // Clean up
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);
  
  // Get currency objects
  const fromCurrency = currencies.find(c => c.code === exchangeData.fromCurrency) || currencies[0];
  const toCurrency = currencies.find(c => c.code === exchangeData.toCurrency) || currencies[1];
  
  // Calculate fee and total amount
  const fee = calculateFee(parseFloat(exchangeData.fromAmount) || 0);
  const totalAmount = calculateTotalAmount(parseFloat(exchangeData.fromAmount) || 0);
  
  // Open currency selector
  const openCurrencySelector = (type: 'from' | 'to') => {
    setCurrentSelector(type);
    setCurrencySelectorOpen(true);
  };
  
  return (
    <>
      <div className="w-full space-y-6">
        {/* Currency Cards + Exchange Rate Section */}
        <div className={
          deviceType.isDesktop || (deviceType.isTablet && deviceType.orientation === 'landscape')
            ? "grid grid-cols-3 gap-6"
            : "space-y-6"
        }>
          {/* From Currency Card */}
          <div className="flex flex-col space-y-4">
            <CurrencyCard 
              label="You Send"
              currency={fromCurrency}
              isFavorite={favorites.includes(fromCurrency.code)}
              onSelectClick={() => openCurrencySelector('from')}
              onFavoriteToggle={(e) => {
                e.stopPropagation();
                toggleFavorite(fromCurrency.code);
              }}
              iconColor="text-blue-500"
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
            />
            
            <AmountInput 
              label="Amount"
              value={exchangeData.fromAmount}
              onChange={handleFromAmountChange}
              currency={fromCurrency}
              error={errors.fromAmount}
            />
          </div>
          
          {/* Exchange Rate Display - Middle on desktop, bottom on mobile */}
          <div className={
            deviceType.isDesktop || (deviceType.isTablet && deviceType.orientation === 'landscape')
              ? "flex items-center justify-center"
              : ""
          }>
            <ExchangeRateDisplay 
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              rate={exchangeData.rate}
              isLoading={isFlipping}
              swapCurrencies={swapCurrencies}
              lastUpdated={new Date()} // You can replace this with the actual last updated time
            />
          </div>
          
          {/* To Currency Card */}
          <div className="flex flex-col space-y-4">
            <CurrencyCard 
              label="Recipient Gets"
              currency={toCurrency}
              isFavorite={favorites.includes(toCurrency.code)}
              onSelectClick={() => openCurrencySelector('to')}
              onFavoriteToggle={(e) => {
                e.stopPropagation();
                toggleFavorite(toCurrency.code);
              }}
              iconColor="text-green-500"
              iconBgColor="bg-green-100 dark:bg-green-900/30"
            />
            
            <AmountInput 
              label="Amount"
              value={exchangeData.toAmount}
              onChange={handleToAmountChange}
              currency={toCurrency}
              readOnly={true}
            />
          </div>
        </div>
        
        {/* Transaction Summary */}
        <TransactionSummary 
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          exchangeData={exchangeData}
          fee={fee}
          totalAmount={totalAmount}
          errors={errors}
          isLoading={isLoading}
          onCheckboxChange={handleCheckboxChange}
          onExchangeClick={processExchange}
        />
      </div>
      
      {/* Currency Selector Modal */}
      <CurrencySelector 
        isOpen={currencySelectorOpen}
        title={currentSelector === 'from' ? 'Select Source Currency' : 'Select Destination Currency'}
        currencies={currencies}
        favorites={favorites}
        selectedCurrency={currentSelector === 'from' ? exchangeData.fromCurrency : exchangeData.toCurrency}
        onSelect={(code) => {
          if (currentSelector === 'from') {
            handleFromCurrencyChange(code);
          } else {
            handleToCurrencyChange(code);
          }
          setCurrencySelectorOpen(false);
        }}
        onToggleFavorite={toggleFavorite}
        onClose={() => setCurrencySelectorOpen(false)}
      />
    </>
  );
};
