'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Check, DollarSign, Euro, Hash, UserPlus } from 'lucide-react';
import { CustomerSearch } from '@/components/customer/CustomerSearch'; // Import the reusable component
import Link from 'next/link';

// Mock Data
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

export default function DepositPage() {
  const [selectedClient, setSelectedClient] = useState<typeof clientAccount | null>(null); // State to hold found client
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositCurrency, setDepositCurrency] = useState<string>('USD');

  const handleClientSearch = (searchParams: any) => {
      console.log("Searching for client (Deposit):", searchParams);
       // Simulate finding the mock client if the search matches
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
      // Reset deposit form state when searching
      setDepositAmount('');
      setDepositCurrency('USD');
  };

   const handleDeposit = () => {
      if (!selectedClient) return;

      const amount = parseFloat(depositAmount);
       if (isNaN(amount) || amount <= 0) {
          // Handle invalid amount error - perhaps show a toast?
          console.error("Invalid deposit amount entered");
          return;
      }

      console.log(`Depositing ${amount} ${depositCurrency} for ${selectedClient.owner}`);
      // In a real app, you would update the balance and record the transaction via an API call.
      // Example:
      // try {
      //    await api.deposit(selectedClient.id, amount, depositCurrency);
      //    // Show success toast
      //    // Optionally refresh client data or navigate away
      // } catch (error) {
      //    // Show error toast
      // }
   };


  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-h1 font-h1 text-foreground">Client Deposit</h1>

      <Card className="card-ios">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-h3 font-h3 text-card-foreground">Client Account</CardTitle>
           {/* "New Account Owner" button functionality delegated to CustomerSearch */}
        </CardHeader>
        <CardContent className="space-y-4">
            {/* Use the reusable CustomerSearch component */}
           <CustomerSearch
                onSearch={handleClientSearch}
                showNewButton={true}
                newButtonText="New Account Owner"
                newButtonLink="/clients/new"
                defaultTab="phone"
            />

          {/* Display Client Account Info Once Searched */}
          {selectedClient && (
              <div className="border p-4 rounded-ios bg-ios-light-gray space-y-2 mt-6">
                <p><strong>Account Owner:</strong> {selectedClient.owner}</p>
                <p><strong>Account ID:</strong> {selectedClient.id}</p>
                <div>
                  <strong>Balances:</strong>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {selectedClient.balances.map(balance => (
                       <div key={balance.currency} className="flex items-center gap-2 text-sm p-2 bg-background rounded-md shadow-sm">
                         <balance.icon className="h-4 w-4 text-muted-foreground"/>
                         <span className={balance.amount < 0 ? 'text-destructive' : 'text-foreground'}>
                           {formatCurrency(balance.amount, balance.currency)}
                         </span>
                         <span className="text-muted-foreground">{balance.currency}</span>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Details Card remains disabled until a client is selected */}
       <Card className={`card-ios ${!selectedClient ? 'opacity-50 pointer-events-none' : ''}`}>
        <CardHeader>
           <CardTitle className="text-h3 font-h3 text-card-foreground">Deposit Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Deposit form fields */}
           <div className="space-y-1">
            <Label htmlFor="deposit-amount" className="label-ios">Deposit Amount</Label>
            <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                className="input-ios text-lg focus:ring-primary"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={!selectedClient}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="deposit-currency" className="label-ios">Currency</Label>
            <Select
                value={depositCurrency}
                onValueChange={setDepositCurrency}
                disabled={!selectedClient}
            >
              <SelectTrigger id="deposit-currency" className="input-ios focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* Allow depositing in standard currencies, or potentially limit based on account */}
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="ILS">ILS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
             <Label htmlFor="deposit-notes" className="label-ios">Notes (Optional)</Label>
            <Input
                id="deposit-notes"
                placeholder="Add any notes for this deposit"
                className="input-ios focus:ring-primary"
                disabled={!selectedClient}
            />
          </div>
        </CardContent>
         <CardFooter className="flex justify-end">
           <Button
             onClick={handleDeposit}
             className="btn-ios-primary"
             disabled={!selectedClient || !depositAmount || parseFloat(depositAmount) <= 0}
            >
             Confirm Deposit <Check className="ml-2 h-4 w-4" />
           </Button>
         </CardFooter>
       </Card>
    </div>
  );
}
