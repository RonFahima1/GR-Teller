import React from 'react';
import { SearchSection } from './SearchSection';
import { SuggestionItem } from './SuggestionItem';
import { EmptyStateProps } from '../types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/**
 * Component displayed when search query is empty
 */
export function EmptyState({ 
  recentSearches, 
  popularSearches, 
  onRecentSearchSelect,
  onClearRecentSearches 
}: EmptyStateProps) {
  const router = useRouter();

  const pages = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Send Money', path: '/send-money' },
    { text: 'Withdrawal', path: '/withdrawal' },
    { text: 'Deposit', path: '/deposit' },
    { text: 'Exchange', path: '/exchange' },
    { text: 'Clients', path: '/clients' },
    { text: 'Client Balance', path: '/client-balance' },
    { text: 'Cash Register', path: '/cash-register' },
    { text: 'Currency Exchange', path: '/currency-exchange' },
    { text: 'Reports', path: '/reports' },
    { text: 'Audit Log', path: '/audit-log' },
    { text: 'Transactions', path: '/transactions' },
    { text: 'Settings', path: '/settings' },
    { text: 'Users', path: '/users' },
    { text: 'Admin', path: '/admin' },
    { text: 'KYC', path: '/kyc' },
    { text: 'Limits', path: '/limits' },
    { text: 'Payout', path: '/payout' },
    { text: 'Accounts', path: '/accounts' },
    { text: 'Register', path: '/register' },
    { text: 'Test Currency', path: '/test-currency' }
  ];

  const handlePageClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="p-4">
        <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lightbulb h-3.5 w-3.5 mr-1.5">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          Suggestions for existing pages
        </div>

        <div className="space-y-2">
          {pages.map((page, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => handlePageClick(page.path)}
            >
              {page.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lightbulb h-3.5 w-3.5 mr-1.5">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
        Try these searches
      </div>
      <div className="space-y-2">
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handlePageClick('/send-money')}>send</div>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handlePageClick('/clients')}>clients</div>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handlePageClick('/transactions')}>transactions</div>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handlePageClick('/dashboard')}>dashboard</div>
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => handlePageClick('/reports')}>reports</div>
      </div>
      <SearchSection title="Existing Pages">
        <div>
          {pages.map((page, index) => (
            <SuggestionItem
              key={`page-${index}`}
              suggestion={{ text: page.text }}
              query=""
              onClick={() => handlePageClick(page.path)}
              isSelected={false}
            />
          ))}
        </div>
      </SearchSection>
    </div>
  );
}
