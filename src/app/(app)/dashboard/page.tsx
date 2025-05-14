'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowRightLeft, Users, DollarSign, TrendingUp, FileText, PlusCircle, RefreshCw, Send, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

const balances = [
  {
    label: 'Total Transfers',
    value: 1234,
    icon: <ArrowRightLeft className="h-6 w-6 text-blue-400" />,
  },
  {
    label: 'This Month',
    value: 321,
    icon: <TrendingUp className="h-6 w-6 text-blue-400" />,
  },
  {
    label: 'Total Volume',
    value: '$5,678,901',
    icon: <DollarSign className="h-6 w-6 text-blue-400" />,
  },
  {
    label: 'Active Clients',
    value: 567,
    icon: <Users className="h-6 w-6 text-blue-400" />,
  },
];

const quickActions = [
  {
    label: 'Deposit',
    icon: <PlusCircle className="h-7 w-7 text-blue-500" />,
    href: '/deposit',
  },
  {
    label: 'Exchange',
    icon: <RefreshCw className="h-7 w-7 text-blue-500" />,
    href: '/exchange',
  },
  {
    label: 'Send Money',
    icon: <Send className="h-7 w-7 text-blue-500" />,
    href: '/send-money',
  },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  // For animated value transitions
  const [displayed, setDisplayed] = useState(balances.map(b => b.value));
  const [isLoading, setIsLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    const interval = setInterval(() => {
      setDisplayed(balances.map(b => b.value));
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Synthetic transactions data
  const transactions = [
    { id: 1, date: '2024-06-01', type: 'Deposit', amount: '$1,000', status: 'Completed', client: 'Alice Smith' },
    { id: 2, date: '2024-06-02', type: 'Send Money', amount: '$500', status: 'Pending', client: 'Bob Lee' },
    { id: 3, date: '2024-06-03', type: 'Exchange', amount: '$2,000', status: 'Completed', client: 'Carlos Diaz' },
    { id: 4, date: '2024-06-04', type: 'Deposit', amount: '$750', status: 'Failed', client: 'Dana Kim' },
  ];

  // Get user from auth context
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 p-2 sm:p-4 md:p-8 font-['-apple-system','BlinkMacSystemFont','SF Pro Text',sans-serif] flex flex-col items-center">
      {(isLoading || navLoading) && <LoadingOverlay />}
      {isLoading ? (
        <div className="w-full max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Welcome Header */}
          <motion.div 
            className="w-full max-w-6xl mx-auto mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'demo user'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's an overview of your teller operations
            </p>
          </motion.div>
          
          {/* Main Grid: Stats + Quick Actions */}
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 lg:mb-0">
              <DashboardCard icon={<ArrowRightLeft className="h-6 w-6 text-blue-500" />} label="Total Transfers" value={1234} accentColor="#2563eb" />
              <DashboardCard icon={<TrendingUp className="h-6 w-6 text-green-500" />} label="This Month" value={321} accentColor="#22c55e" />
              <DashboardCard icon={<DollarSign className="h-6 w-6 text-indigo-500" />} label="Total Volume" value={5678901} accentColor="#6366f1" />
              <DashboardCard icon={<Users className="h-6 w-6 text-purple-500" />} label="Active Clients" value={567} accentColor="#a21caf" />
            </div>
            {/* Quick Actions */}
            <div className="flex flex-col gap-4 items-center justify-between h-full">
              <div className="flex flex-row gap-4 w-full justify-center">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.label}
                    onClick={e => {
                      e.preventDefault();
                      setNavLoading(true);
                      setTimeout(() => {
                        window.location.href = action.href;
                      }, 50);
                    }}
                    className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-xl border border-white/40 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-900/10 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-blue-200"
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="mb-2">{action.icon}</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column: Transactions & Currency Rates */}
          <motion.div 
            className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Transactions Section */}
            <div className="col-span-2 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-md p-6 md:p-8 border border-white/40 dark:border-white/10 min-h-[260px] flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-blue-400" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</span>
              </div>
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-8">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <div className="text-gray-500 dark:text-gray-300 text-base mb-1">No transactions yet.</div>
                  <div className="text-xs text-gray-400">They'll appear here once available.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-300 text-left">
                        <th className="py-2 px-3 font-medium">Date</th>
                        <th className="py-2 px-3 font-medium">Type</th>
                        <th className="py-2 px-3 font-medium">Client</th>
                        <th className="py-2 px-3 font-medium">Amount</th>
                        <th className="py-2 px-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.id} className="border-t border-gray-100 dark:border-gray-800">
                          <td className="py-2 px-3">{tx.date}</td>
                          <td className="py-2 px-3">{tx.type}</td>
                          <td className="py-2 px-3">{tx.client}</td>
                          <td className="py-2 px-3">{tx.amount}</td>
                          <td className={
                            `py-2 px-3 font-semibold ${
                              tx.status === 'Completed' ? 'text-green-600' :
                              tx.status === 'Pending' ? 'text-yellow-600' :
                              tx.status === 'Failed' ? 'text-red-600' : ''
                            }`
                          }>{tx.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* Live Currency Rates Widget */}
            <div className="rounded-3xl bg-white shadow-xl dark:bg-[#23232a] p-6 md:p-8 flex flex-col gap-6 min-h-[260px]">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">Live Currency Rates</span>
              </div>
              <div className="w-full flex items-center justify-center mb-2">
                <svg width="90%" height="40" viewBox="0 0 200 40" fill="none">
                  <path d="M0,30 Q40,10 80,25 T160,15 T200,30" stroke="#60a5fa" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7" />
                  <circle cx="200" cy="30" r="4" fill="#007AFF" />
                </svg>
              </div>
              <div className="flex justify-between items-end w-full">
                <div className="flex flex-col items-center flex-1">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">USD/EUR</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">0.92</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">USD/GBP</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">0.78</span>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-medium">USD/JPY</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">145.2</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
