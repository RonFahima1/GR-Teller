'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Printer, RotateCcw, LayoutDashboard } from 'lucide-react';

interface StagedExchangeDetails {
  customerName: string;
  customerId: string;
  payAmount: number;
  payCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  rate: number;
}

interface ExchangeSuccessScreenProps {
  exchangeDetails: StagedExchangeDetails;
  onMakeAnotherExchange: () => void;
  onPrintReceipt: () => void;
  onGoToDashboard: () => void;
}

const ExchangeSuccessScreen: React.FC<ExchangeSuccessScreenProps> = ({
  exchangeDetails,
  onMakeAnotherExchange,
  onPrintReceipt,
  onGoToDashboard,
}) => {
  // Simple confetti effect (placeholder - can be enhanced with a library)
  const renderConfetti = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500 opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * -50}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animation: `fall ${Math.random() * 3 + 2}s ${Math.random() * 2}s linear infinite`,
            }}
          />
        ))}
        <style jsx global>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      {renderConfetti()}
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center space-y-6 transform transition-all duration-300 ease-out scale-100">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-800">
          <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Currency Exchange Verified!</h2>
        
        <div className="text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2 text-sm">
          <p><span className="font-medium">Customer:</span> {exchangeDetails.customerName} (ID: {exchangeDetails.customerId})</p>
          <p><span className="font-medium">Paid:</span> {exchangeDetails.payAmount.toFixed(2)} {exchangeDetails.payCurrency}</p>
          <p><span className="font-medium">Received:</span> {exchangeDetails.receiveAmount.toFixed(2)} {exchangeDetails.receiveCurrency}</p>
          <p><span className="font-medium">Rate:</span> 1 {exchangeDetails.payCurrency} = {exchangeDetails.rate.toFixed(4)} {exchangeDetails.receiveCurrency}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Button onClick={onMakeAnotherExchange} size="lg" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" /> Make Another Exchange
          </Button>
          <Button onClick={onPrintReceipt} variant="outline_primary" size="lg" className="w-full">
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button>
          <Button onClick={onGoToDashboard} variant="outline" size="lg" className="w-full">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeSuccessScreen; 