'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Repeat } from 'lucide-react'; // Repeat for exchange icon
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '../types'; // Corrected: Import Client from centralized types
import { ExchangeTransaction } from './ExchangeHistory'; // Reuse ExchangeTransaction for transaction structure

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Client | null;
  transactions: ExchangeTransaction[]; // Pass actual transactions for this customer
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  customer,
  transactions
}) => {
  if (!isOpen || !customer) return null;

  const modalAnimation = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            {...modalAnimation}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <div className="flex justify-between items-center p-5 border-b dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">For {customer.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600/50">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(tx.date).toLocaleDateString()} - {new Date(tx.date).toLocaleTimeString()}
                      </span>
                      <Repeat size={16} className="text-blue-500 dark:text-blue-400" /> {/* Exchange Icon */}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-700 dark:text-gray-200">
                            Pay: {tx.fromAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {tx.fromCurrency}
                        </div>
                        <TrendingUp size={18} className="text-red-500 dark:text-red-400 mx-2" />
                        <div className="font-medium text-gray-700 dark:text-gray-200">
                           Receive: {tx.toAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {tx.toCurrency}
                        </div>
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Rate: 1 {tx.fromCurrency} = {tx.rate.toFixed(4)} {tx.toCurrency}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                  No recent exchange transactions found for this customer.
                </p>
              )}
            </div>
            
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 text-right">
                <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 