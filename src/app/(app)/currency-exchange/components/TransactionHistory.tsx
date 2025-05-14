import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Search, Calendar } from 'lucide-react';
import { IOSCard } from '@/components/ui/IOSCard';
import { IOSSectionHeader } from '@/components/ui/IOSSectionHeader';
import { Input } from '@/components/ui/input';
import { Transaction, Currency } from '../hooks/useCurrencyExchange';
import { cn } from '@/lib/utils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currencies: Currency[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currencies
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredTransactions = transactions.filter(transaction => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(query) ||
      transaction.fromCurrency.toLowerCase().includes(query) ||
      transaction.toCurrency.toLowerCase().includes(query)
    );
  });
  
  const getCurrencySymbol = (code: string): string => {
    return currencies.find(c => c.code === code)?.symbol || '';
  };
  
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <IOSSectionHeader 
        title="Transaction History"
        subtitle="View your recent currency exchanges"
        centered={true}
      />
      
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {filteredTransactions.length === 0 ? (
          <IOSCard variant="default" padding="large" className="text-center">
            <div className="py-6">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No transactions found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try a different search term' : 'Your transaction history will appear here'}
              </p>
            </div>
          </IOSCard>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <IOSCard
                  variant="default"
                  padding="medium"
                  className="hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {transaction.fromCurrency} → {transaction.toCurrency}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span>{formatDate(transaction.date)}</span>
                          <span className="text-xs">•</span>
                          <span className="text-xs">{transaction.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {getCurrencySymbol(transaction.fromCurrency)}{parseFloat(transaction.fromAmount).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getCurrencySymbol(transaction.toCurrency)}{parseFloat(transaction.toAmount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Rate: 1 {transaction.fromCurrency} = {(parseFloat(transaction.toAmount) / parseFloat(transaction.fromAmount)).toFixed(4)} {transaction.toCurrency}</span>
                      <span className={cn(
                        "font-medium",
                        transaction.status === 'completed' ? "text-green-500" : 
                        transaction.status === 'pending' ? "text-yellow-500" : "text-red-500"
                      )}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </IOSCard>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Transaction history is stored locally and is for demonstration purposes only.</p>
        </div>
      </div>
    </div>
  );
};
