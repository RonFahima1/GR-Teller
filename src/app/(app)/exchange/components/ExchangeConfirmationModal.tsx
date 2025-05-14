'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, User, ArrowRightLeft, TrendingUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Matches StagedExchangeDetails in page.tsx
interface ExchangeDetails {
  customerName: string;
  customerId: string;
  payAmount: number;
  payCurrency: string;
  receiveAmount: number;
  receiveCurrency: string;
  rate: number;
}

interface ExchangeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  details: ExchangeDetails | null;
}

const DetailRow: React.FC<{ label: string; value?: string | number | React.ReactNode; valueClassName?: string; icon?: React.ReactNode }> = ({ label, value, valueClassName, icon }) => (
  <div className="flex items-start py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    {icon && <div className="mr-3 mt-0.5 text-gray-400 dark:text-gray-500">{icon}</div>}
    <div className="flex-grow">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={cn("text-md font-medium text-gray-800 dark:text-gray-200 truncate", valueClassName)}>{value ?? 'N/A'}</p>
    </div>
  </div>
);

export const ExchangeConfirmationModal: React.FC<ExchangeConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  details
}) => {
  if (!isOpen || !details) return null;

  const modalAnimation = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 30, scale: 0.9 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          onClick={onClose} // Close on backdrop click
        >
          <motion.div
            {...modalAnimation}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl w-full max-w-md flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} 
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Exchange</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <DetailRow 
                icon={<User size={18}/>}
                label="Customer"
                value={details.customerName}
              />
              <DetailRow 
                icon={<DollarSign size={18} className="text-red-500"/>}
                label={`You Pay`}
                value={`${details.payAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${details.payCurrency}`}
                valueClassName="font-bold text-red-600 dark:text-red-400"
              />
              <DetailRow 
                icon={<DollarSign size={18} className="text-green-500"/>}
                label={`You Receive (Approx.)`}
                value={`${details.receiveAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${details.receiveCurrency}`}
                valueClassName="font-bold text-green-600 dark:text-green-400"
              />
              <DetailRow 
                icon={<ArrowRightLeft size={18}/>}
                label="Exchange Rate"
                value={`1 ${details.payCurrency} = ${details.rate.toFixed(4)} ${details.receiveCurrency}`}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex space-x-3 p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button variant="outline" onClick={onClose} className="w-full">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Confirm & Proceed
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 