import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowLeftRight } from 'lucide-react'; // User for Sender, ArrowLeftRight for transaction direction
import { Button } from '@/components/ui/button';
import { Receiver } from '@/types/receiver';
import { Transaction } from './SenderTransactionHistoryModal'; // Re-use the Transaction interface
import { cn } from '@/lib/utils';

interface ReceiverTransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiver: Receiver | null; // Pass the full receiver object for display name
  transactions: Transaction[]; // Transactions specific to this receiver
  isLoading?: boolean;
  // Unlike sender history, a receiver history might not need an "onUseTransaction" callback
}

export const ReceiverTransactionHistoryModal: React.FC<ReceiverTransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  receiver,
  transactions,
  isLoading,
}) => {
  if (!isOpen || !receiver) return null;

  const receiverDisplayName = [receiver.firstName, receiver.middleName, receiver.lastName].filter(Boolean).join(' ');

  // If your Transaction interface doesn't have senderName, you might need to adapt
  // For now, assuming transactions are pre-filtered for this receiver.

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden" // Adjusted max-width from 4xl to 3xl
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transaction History for {receiverDisplayName}
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-1 sm:p-5 overflow-y-auto flex-grow">
              {isLoading && <p className="text-center text-gray-500 dark:text-gray-400 py-6">Loading history...</p>}
              {!isLoading && transactions.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No transactions found for this receiver.</p>
              )}
              {!isLoading && transactions.length > 0 && (
                <div className="flow-root">
                  <div className="-mx-1 sm:-mx-5">
                    <div className="inline-block min-w-full py-2 align-middle">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10">
                            <tr>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                              {/* Consider adding Sender if this info is part of Transaction or can be fetched */}
                              {/* <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sender</th> */}
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">Country</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Operator</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">Type</th>
                              <th scope="col" className="py-3 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount Received</th>                               
                              <th scope="col" className="py-3 px-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.map((tx) => (
                              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{tx.date}</td>
                                {/* Display Sender Name if available on tx object */}
                                {/* <td className="px-3 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">{tx.senderName || 'N/A'}</td> */}
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">{tx.country || 'N/A'}</td>
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">{tx.operator || 'N/A'}</td>
                                <td className="px-3 py-3.5 text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">{tx.transferType || 'N/A'}</td>
                                <td className="px-3 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                  {/* Focusing on Amount Received for receiver history */}
                                  {tx.amountReceived} {tx.currencyReceived}
                                  {tx.transferDetails && <p className="text-xs text-gray-400 dark:text-gray-500 hidden md:block">{tx.transferDetails}</p>}
                                </td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                  <span className={cn(
                                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                                    tx.status === 'Completed' && 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300',
                                    tx.status === 'Pending' && 'bg-amber-100 text-amber-700 dark:bg-amber-700/30 dark:text-amber-300',
                                    tx.status === 'Failed' && 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300',
                                  )}>
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 