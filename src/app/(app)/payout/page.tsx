'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowRight, CheckCircle, Loader2, XCircle, ChevronRight, Banknote, Smartphone, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock data for clients and recent payouts
const mockClients = [
  { id: 'CUST1001', name: 'Alex Morgan', phone: '+1 555-123-4567' },
  { id: 'CUST1002', name: 'Sarah Chen', phone: '+1 555-987-6543' },
  { id: 'CUST1003', name: 'James Wilson', phone: '+1 555-456-7890' },
];

const mockPayouts = [
  {
    id: 'PAYOUT1001',
    date: '2024-03-15T12:00:00',
    recipient: 'Alex Morgan',
    method: 'Cash',
    amount: 300.00,
    currency: 'USD',
    status: 'completed',
  },
  {
    id: 'PAYOUT1002',
    date: '2024-03-14T17:30:00',
    recipient: 'Sarah Chen',
    method: 'Bank',
    amount: 500.00,
    currency: 'EUR',
    status: 'pending',
  },
  {
    id: 'PAYOUT1003',
    date: '2024-03-13T10:45:00',
    recipient: 'James Wilson',
    method: 'Mobile',
    amount: 200.00,
    currency: 'GBP',
    status: 'failed',
  },
];

export default function PayoutPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [payoutMethod, setPayoutMethod] = useState('Cash');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter clients by search
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  // Handle payout submission
  const handlePayout = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    // In a real app, show success/failure feedback
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Payout Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Payout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Recipient</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Search by name or phone"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="h-12"
                  />
                  <Button
                    className="h-12"
                    onClick={() => setSelectedClient(filteredClients[0] || null)}
                    disabled={!filteredClients.length}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
                {selectedClient && (
                  <div className="mt-2 flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20">
                    <User className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-900 dark:text-green-400">{selectedClient.name}</span>
                    <span className="text-xs text-gray-500">{selectedClient.phone}</span>
                  </div>
                )}
              </div>

              {/* Payout Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Payout Method</label>
                <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash"><Banknote className="h-4 w-4 mr-2 inline" />Cash</SelectItem>
                    <SelectItem value="Bank"><Banknote className="h-4 w-4 mr-2 inline" />Bank</SelectItem>
                    <SelectItem value="Mobile"><Smartphone className="h-4 w-4 mr-2 inline" />Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount and Currency */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-[120px] h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button
                className="h-12 px-8"
                onClick={handlePayout}
                disabled={isProcessing || !selectedClient || !amount}
              >
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5 mr-2" />}
                Payout
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Payouts */}
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPayouts.map((payout) => (
                  <motion.div
                    key={payout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{payout.recipient}</p>
                      <p className="text-sm text-gray-500">
                        {payout.method} &middot; {new Date(payout.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">
                        {payout.amount.toLocaleString()} {payout.currency}
                      </p>
                      {payout.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {payout.status === 'pending' && <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />}
                      {payout.status === 'failed' && <XCircle className="h-5 w-5 text-red-500" />}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
