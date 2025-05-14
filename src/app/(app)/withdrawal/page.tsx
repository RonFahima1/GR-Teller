'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Check, DollarSign, Euro, Hash, AlertTriangle, UserPlus, Loader2 } from 'lucide-react';
import { CustomerSearch } from '@/components/customer/CustomerSearch';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Mock Data - same as deposit for simplicity
const clientAccount = {
    id: 'ACC001',
    owner: 'John Doe (CUST001)',
    balances: [
        { currency: 'USD', amount: 1500.75, icon: DollarSign },
        { currency: 'EUR', amount: 50.00, icon: Euro },
        { currency: 'ILS', amount: 10000.00, icon: Hash },
    ]
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
};

export default function WithdrawalPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [withdrawalCurrency, setWithdrawalCurrency] = useState<string>('USD');
  const [showInsufficientFunds, setShowInsufficientFunds] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<typeof clientAccount | null>(null); // State to hold found client

  useEffect(() => {
    // Simulate initial data loading
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleClientSearch = async (searchParams: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock finding a client
      const lowerCaseValue = searchParams.value.toLowerCase();
      if (
        (searchParams.type === 'phone' && searchParams.value === '502345678') ||
        (searchParams.type === 'name' && lowerCaseValue.includes('john doe')) ||
        (searchParams.type === 'id' && lowerCaseValue === 'cust001')
      ) {
        setSelectedClient(clientAccount);
      } else {
        setSelectedClient(null);
      }
      // Reset withdrawal form state when searching
      setWithdrawalAmount('');
      setWithdrawalCurrency('USD');
      setShowInsufficientFunds(false);
    } catch (error) {
      console.error('Error searching for client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    setIsLoading(true);
    try {
      if (!selectedClient) return; // Should not happen if UI is disabled

      const amount = parseFloat(withdrawalAmount);
      const balance = selectedClient?.balances.find(b => b.currency === withdrawalCurrency)?.amount ?? 0;
      
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
      }

      if (amount > balance) {
        setShowInsufficientFunds(true);
        return;
      }

      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update balance (in a real app, this would be an API call)
      const updatedBalance = balance - amount;
      selectedClient.balances = selectedClient.balances.map(b => 
        b.currency === withdrawalCurrency ? { ...b, amount: updatedBalance } : b
      );

      // Reset form
      setWithdrawalAmount('');
      setWithdrawalCurrency('USD');
      setShowInsufficientFunds(false);

      // Show success message
      alert('Withdrawal processed successfully!');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Error processing withdrawal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-h1 font-h1 text-foreground">Client Withdrawal</h1>
      <p className="text-muted-foreground">Withdraw funds from client accounts</p>

      {/* Client Search */}
      <Card className="card-ios">
        <CardHeader>
          <CardTitle>Find Client</CardTitle>
          <CardDescription>Search by phone, name, or client ID</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerSearch onSearch={handleClientSearch} />
          {selectedClient && (
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{selectedClient?.owner}</h3>
                  <p className="text-sm text-muted-foreground">Client ID: {selectedClient?.id}</p>
                </div>
                <div className="flex space-x-2">
                  {selectedClient?.balances?.map((balance) => (
                    <div key={balance.currency} className="flex flex-col items-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(balance.amount, balance.currency)}
                      </div>
                      <p className="text-sm text-muted-foreground">{balance.currency}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      {selectedClient && (
        <Card className="card-ios">
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>Enter withdrawal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={withdrawalCurrency}
                    onValueChange={setWithdrawalCurrency}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedClient?.balances?.map((balance) => (
                        <SelectItem key={balance.currency} value={balance.currency}>
                          {balance.currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {showInsufficientFunds && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Insufficient Funds</AlertTitle>
                  <AlertDescription>
                    The withdrawal amount exceeds the available balance.
                  </AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleWithdrawal}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Withdraw Funds'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
