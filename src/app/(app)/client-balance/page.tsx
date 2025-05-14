'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, ArrowRight, Download, Filter, MoreVertical, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { IOSSheet } from '@/components/ui/ios-sheet';
import { NewClientForm } from '@/components/clients/NewClientForm';
import { useToast } from '@/hooks/use-toast';

// Mock data for clients and transactions
const mockClients = [
  {
    id: 'CUST1001',
    name: 'Alex Morgan',
    phone: '+1 555-123-4567',
    email: 'alex.morgan@example.com',
    balance: 1250.50,
    currency: 'USD',
    lastTransaction: '2024-03-15T10:30:00',
    status: 'active',
  },
  {
    id: 'CUST1002',
    name: 'Sarah Chen',
    phone: '+1 555-987-6543',
    email: 'sarah.chen@example.com',
    balance: 875.25,
    currency: 'EUR',
    lastTransaction: '2024-03-14T15:45:00',
    status: 'active',
  },
  {
    id: 'CUST1003',
    name: 'James Wilson',
    phone: '+1 555-456-7890',
    email: 'james.wilson@example.com',
    balance: 2500.00,
    currency: 'GBP',
    lastTransaction: '2024-03-13T09:15:00',
    status: 'active',
  },
];

const mockTransactions = [
  {
    id: 'TXN1001',
    date: '2024-03-15T10:30:00',
    type: 'deposit',
    amount: 500.00,
    currency: 'USD',
    status: 'completed',
    description: 'Salary Deposit',
  },
  {
    id: 'TXN1002',
    date: '2024-03-14T15:45:00',
    type: 'withdrawal',
    amount: 200.00,
    currency: 'EUR',
    status: 'completed',
    description: 'ATM Withdrawal',
  },
  {
    id: 'TXN1003',
    date: '2024-03-13T09:15:00',
    type: 'transfer',
    amount: 1000.00,
    currency: 'GBP',
    status: 'completed',
    description: 'International Transfer',
  },
];

export default function ClientBalancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [showNewClient, setShowNewClient] = useState(false);
  const [showDemoSheet, setShowDemoSheet] = useState(false);
  const [showNewClientSheet, setShowNewClientSheet] = useState(false);
  const { toast } = useToast();
  const [formKey, setFormKey] = useState(0);
  const [selectedClientForSheet, setSelectedClientForSheet] = useState<any>(null);
  const [showClientDetailsSheet, setShowClientDetailsSheet] = useState(false);

  // Filter transactions based on selected filter
  const filteredTransactions = mockTransactions.filter(txn => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demo iOS Sheet Button */}
        <button
          className="mb-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          onClick={() => setShowDemoSheet(true)}
        >
          Show Demo iOS Sheet
        </button>
        <button
          className="mb-4 ml-4 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
          onClick={() => setShowNewClientSheet(true)}
        >
          New Client (Sheet)
        </button>
        <IOSSheet isOpen={showDemoSheet} onClose={() => setShowDemoSheet(false)}>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Hello from iOS Sheet!</h2>
            <p className="mb-6">This is a demo of the animated, blurred, iOS-style modal sheet. You can put any content here.</p>
            <button
              className="mt-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
              onClick={() => setShowDemoSheet(false)}
            >
              Close
            </button>
          </div>
        </IOSSheet>
        <IOSSheet isOpen={showNewClientSheet} onClose={() => { setShowNewClientSheet(false); setFormKey(k => k + 1); }}>
          <div className="p-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Add New Client</h2>
            <NewClientForm
              key={formKey}
              onSubmit={() => {
                setShowNewClientSheet(false);
                setFormKey(k => k + 1);
                toast({
                  title: 'Client added!',
                  description: 'The new client was successfully created.',
                  variant: 'default',
                });
              }}
              isLoading={false}
            />
            <button
              className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
              onClick={() => { setShowNewClientSheet(false); setFormKey(k => k + 1); }}
            >
              Cancel
            </button>
          </div>
        </IOSSheet>
        <IOSSheet isOpen={showClientDetailsSheet} onClose={() => setShowClientDetailsSheet(false)}>
          {selectedClientForSheet && (
            <div className="p-6 max-w-lg mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">Client Details</h2>
              <div className="mb-4 text-center">
                <div className="text-2xl font-semibold">{selectedClientForSheet.name}</div>
                <div className="text-gray-500">{selectedClientForSheet.id}</div>
                <div className="mt-2">{selectedClientForSheet.phone}</div>
                <div className="mt-1">{selectedClientForSheet.email}</div>
                <div className="mt-4 text-3xl font-bold">
                  <AnimatedNumber value={selectedClientForSheet.balance} /> {selectedClientForSheet.currency}
                </div>
              </div>
              <div className="flex gap-2 justify-center mt-6">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Send Money</button>
                <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition">Edit</button>
              </div>
              <button
                className="mt-6 w-full px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
                onClick={() => setShowClientDetailsSheet(false)}
              >
                Close
              </button>
            </div>
          )}
        </IOSSheet>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Actions */}
          <Card className="card-ios">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search clients by name, ID, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Link href="/clients/new" passHref>
                  <Button asChild className="h-12 px-6">
                    <span>
                  <UserPlus className="h-5 w-5 mr-2" />
                  New Client
                    </span>
                </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Client Balance Overview */}
          {selectedClient ? (
            <Card className="card-ios">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Balance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedClient.name}</h3>
                    <p className="text-sm text-gray-500">{selectedClient.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">
                      <AnimatedNumber value={selectedClient.balance} /> {selectedClient.currency}
                    </p>
                    <p className="text-sm text-gray-500">Available Balance</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-12">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Send Money
                  </Button>
                  <Button variant="outline" className="h-12">
                    <Download className="h-5 w-5 mr-2" />
                    Withdraw
                  </Button>
                  <Button variant="outline" className="h-12">
                    <MoreVertical className="h-5 w-5 mr-2" />
                    More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-ios">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-500">Select a client to view their balance</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction History */}
          <Card className="card-ios">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Transaction History</CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px] h-10">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter transactions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((txn) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{txn.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(txn.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={cn(
                        "font-medium",
                        txn.type === 'deposit' ? "text-green-600" : "text-red-600"
                      )}>
                        {txn.type === 'deposit' ? '+' : '-'}
                        {txn.amount.toLocaleString()} {txn.currency}
                      </p>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Client List */}
        <div className="space-y-6">
          <Card className="card-ios">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockClients.map((client) => (
                  <motion.div
                    key={client.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedClient(client); setSelectedClientForSheet(client); setShowClientDetailsSheet(true); }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors",
                      selectedClient?.id === client.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "bg-white/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    )}
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {client.balance.toLocaleString()} {client.currency}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(client.lastTransaction).toLocaleDateString()}
                      </p>
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