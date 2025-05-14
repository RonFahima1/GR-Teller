'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, RefreshCw, ChevronRight, DollarSign, TrendingUp, Landmark, Send, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for cash balances and transactions
const detailedCashBalances = [
  { currency: 'USD', currentBalance: 3200.00, openBalance: 3000.00, openDate: '2024-07-26T09:00:00Z' },
  { currency: 'EUR', currentBalance: 1800.50, openBalance: 1500.00, openDate: '2024-07-26T09:00:00Z' },
  { currency: 'ILS', currentBalance: 9500.00, openBalance: 9000.00, openDate: '2024-07-26T09:00:00Z' },
];

const cashTransactions = [
  {
    id: 'CASH1001',
    date: '2024-07-26T10:00:00Z',
    type: 'add',
    amount: 200.00,
    currency: 'USD',
    description: 'Cash Deposit from Client X',
  },
  {
    id: 'CASH1002',
    date: '2024-07-26T16:30:00Z',
    type: 'remove',
    amount: 50.50,
    currency: 'EUR',
    description: 'Cash Withdrawal by Client Y',
  },
  {
    id: 'CASH1003',
    date: '2024-07-25T11:15:00Z', // older transaction
    type: 'add',
    amount: 100.00,
    currency: 'ILS',
    description: 'Cash Adjustment',
  },
];

// Helper to format date and time
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

interface AmountsToLeave {
  [currencyCode: string]: number;
}

export default function CashRegisterPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [adminMode, setAdminMode] = useState(true); // Mock admin mode
  const [amountsToLeave, setAmountsToLeave] = useState<AmountsToLeave>({});

  useEffect(() => {
    // Initialize amountsToLeave with 0 for each currency
    const initialAmounts: AmountsToLeave = {};
    detailedCashBalances.forEach(balance => {
      initialAmounts[balance.currency] = 0;
    });
    setAmountsToLeave(initialAmounts);
  }, []);

  const getSelectedBalanceDetails = () => {
    return detailedCashBalances.find(cb => cb.currency === selectedCurrency);
  };

  const selectedBalance = getSelectedBalanceDetails();
  const netPayment = selectedBalance ? selectedBalance.currentBalance - selectedBalance.openBalance : 0;

  const handleAmountToLeaveChange = (currency: string, value: string) => {
    const numericValue = parseFloat(value);
    setAmountsToLeave(prev => ({
      ...prev,
      [currency]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const handleInitiateClearRegister = (currencyCode: string, amountToLeave: number, totalToGive: number) => {
    // Placeholder for opening confirmation modal
    console.log(`Initiating clear for ${currencyCode}:`);
    console.log(`  Amount to Leave: ${amountToLeave}`);
    console.log(`  Total to Give: ${totalToGive}`);
    // Later: setModalOpen(true), setClearingCurrencyDetails({currency, amountToLeave, totalToGive})
    alert(`Confirm clear for ${currencyCode}: Leave ${amountToLeave}, Give ${totalToGive}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full lg:w-3/4 space-y-8"> {/* Increased width for more content */}
          <Card className="card-ios">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Cash Register</CardTitle>
                {/* Placeholder for Admin mode toggle or display */}
                <Button variant="outline" onClick={() => setAdminMode(prev => !prev)}>
                  {adminMode ? "Switch to Teller View" : "Switch to Admin View"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Currency Selection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {detailedCashBalances.map((cb) => (
                  <div
                    key={cb.currency}
                    className={cn(
                      'rounded-2xl p-4 bg-white/80 dark:bg-white/10 shadow flex flex-col items-center gap-2 border border-white/40 dark:border-white/10',
                      selectedCurrency === cb.currency && 'ring-2 ring-blue-400'
                    )}
                    onClick={() => setSelectedCurrency(cb.currency)}
                    style={{ cursor: 'pointer' }}
                  >
                    <DollarSign className="h-8 w-8 text-blue-500 mb-1" />
                    <div className="text-lg font-semibold">{cb.currency}</div>
                    <div className="text-xl font-bold">{cb.currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {cb.currency}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Current Cash on Hand</div>
                  </div>
                ))}
              </div>

              {/* Selected Currency Balance Details */}
              {selectedBalance && (
                <Card className="bg-white/60 dark:bg-white/5 card-ios-nested">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Balance Details: {selectedCurrency}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Open Balance:</span>
                      <span className="font-medium">{selectedBalance.openBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {selectedBalance.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Open Date & Time:</span>
                      <span className="font-medium">{formatDateTime(selectedBalance.openDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Payments:</span>
                      <span className={cn("font-medium", netPayment >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {netPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {selectedBalance.currency}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
                      <span className="font-semibold">Current Balance:</span>
                      <span className="font-bold text-lg">{selectedBalance.currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {selectedBalance.currency}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-white/60 dark:bg-white/5 card-ios-nested">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 h-12" variant="outline">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Cash
                  </Button>
                  <Button className="flex-1 h-12" variant="outline">
                    <Minus className="h-5 w-5 mr-2" />
                    Remove Cash
                  </Button>
                  <Button className="flex-1 h-12" variant="outline">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Reconcile
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Clear Registers Section - MOVED AND REFORMATTED */}
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Archive className="h-5 w-5 mr-2 text-orange-500" /> Clear Registers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detailedCashBalances.map((balance) => {
                  const amountToLeave = amountsToLeave[balance.currency] ?? 0;
                  const totalToGive = balance.currentBalance - amountToLeave;
                  const isClearDisabled = amountToLeave < 0 || amountToLeave > balance.currentBalance || totalToGive < 0;

                  return (
                    <Card key={balance.currency} className="bg-white/60 dark:bg-white/10 card-ios-nested p-4 flex flex-col">
                      <CardTitle className="text-lg font-medium mb-3">{balance.currency} Register</CardTitle>
                      <div className="space-y-3 text-sm flex-grow">
                        <div className="flex justify-between items-center">
                          <span>Current Balance:</span>
                          <span className="font-medium">{balance.currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {balance.currency}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label htmlFor={`leave-${balance.currency}`} className="text-xs text-gray-600 dark:text-gray-400">Amount to Leave:</label>
                          <Input
                            id={`leave-${balance.currency}`}
                            type="number"
                            value={amountToLeave.toString()} 
                            onChange={(e) => handleAmountToLeaveChange(balance.currency, e.target.value)}
                            className="h-10 text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Total to Give:</span>
                          <span className={cn("font-bold", totalToGive < 0 ? "text-red-500" : "text-green-600")}>
                            {totalToGive.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {balance.currency}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 h-10" // Added mt-4 for spacing from content above
                        onClick={() => handleInitiateClearRegister(balance.currency, amountToLeave, totalToGive)}
                        disabled={isClearDisabled}
                      >
                        Clear {balance.currency} Register
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Transfers Section (Admin Only) */}
          {adminMode && (
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Send className="h-5 w-5 mr-2 text-blue-500" /> Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">Transfer functionality will be implemented here. (Admin View)</p>
                {/* Placeholder for Transfer Form: Teller Dropdown, Type, Amount, Confirm */}
              </CardContent>
            </Card>
          )}

          {/* Recent Cash Transactions */}
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Landmark className="h-5 w-5 mr-2 text-purple-500" /> Recent Transactions ({selectedCurrency})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cashTransactions
                  .filter(txn => txn.currency === selectedCurrency)
                  .map((txn) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{txn.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(txn.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={cn(
                          'font-medium text-sm',
                          txn.type === 'add' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {txn.type === 'add' ? '+' : '-'}
                          {txn.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {txn.currency}
                        </p>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                {cashTransactions.filter(txn => txn.currency === selectedCurrency).length === 0 && (
                  <div className="text-center text-gray-400 py-6">No transactions for this currency.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 