/**
 * Page Commands for Search Functionality
 * 
 * This file defines the available page commands and navigation options
 * that can be searched and accessed through the search functionality.
 */

import { SearchResult } from '@/types/search.types';

// Define page command types
export interface PageCommand {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  url: string;
  icon?: string;
}

// Main application pages and functions
export const pageCommands: PageCommand[] = [
  // Dashboard
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'View your main dashboard with transaction summary and quick actions',
    keywords: ['home', 'main', 'overview', 'summary', 'start'],
    url: '/dashboard',
    icon: 'home'
  },
  
  // Transaction-related pages
  {
    id: 'send-money',
    name: 'Send Money',
    description: 'Start a new money transfer transaction',
    keywords: ['send', 'transfer', 'remit', 'payment', 'wire', 'transmit', 'new transaction', 'send money', 'money transfer', 'make payment'],
    url: '/send-money',
    icon: 'send'
  },
  {
    id: 'transactions',
    name: 'Transactions',
    description: 'View and manage all transactions',
    keywords: ['transfers', 'payments', 'history', 'records', 'all transactions'],
    url: '/transactions',
    icon: 'list'
  },
  {
    id: 'recent-transactions',
    name: 'Recent Transactions',
    description: 'View your most recent transactions',
    keywords: ['latest', 'new', 'recent', 'last', 'history'],
    url: '/transactions?filter=recent',
    icon: 'clock'
  },
  {
    id: 'pending-transactions',
    name: 'Pending Transactions',
    description: 'View transactions that are still in progress',
    keywords: ['processing', 'waiting', 'ongoing', 'incomplete', 'unfinished'],
    url: '/transactions?filter=pending',
    icon: 'loader'
  },
  
  // Client-related pages
  {
    id: 'clients',
    name: 'Clients',
    description: 'View and manage all clients',
    keywords: ['customers', 'users', 'people', 'contacts', 'all clients'],
    url: '/clients',
    icon: 'users'
  },
  {
    id: 'new-client',
    name: 'New Client',
    description: 'Register a new client in the system',
    keywords: ['add client', 'create client', 'register client', 'new customer'],
    url: '/clients/new',
    icon: 'user-plus'
  },
  {
    id: 'client-search',
    name: 'Search Clients',
    description: 'Search for specific clients',
    keywords: ['find client', 'locate customer', 'search customer'],
    url: '/clients?search=true',
    icon: 'search'
  },
  
  // Financial operations
  {
    id: 'exchange-rates',
    name: 'Exchange Rates',
    description: 'View current exchange rates for all currencies',
    keywords: ['forex', 'currency', 'rates', 'conversion', 'exchange'],
    url: '/exchange-rates',
    icon: 'refresh-cw'
  },
  {
    id: 'cash-register',
    name: 'Cash Register',
    description: 'Manage your cash register and balance',
    keywords: ['cash', 'drawer', 'till', 'money', 'balance'],
    url: '/cash-register',
    icon: 'dollar-sign'
  },
  {
    id: 'deposit',
    name: 'Make Deposit',
    description: 'Process a new deposit transaction',
    keywords: ['add funds', 'cash in', 'deposit money', 'add money'],
    url: '/deposit',
    icon: 'arrow-down'
  },
  {
    id: 'withdrawal',
    name: 'Process Withdrawal',
    description: 'Process a new withdrawal transaction',
    keywords: ['cash out', 'take money', 'withdraw funds', 'get cash'],
    url: '/withdrawal',
    icon: 'arrow-up'
  },
  
  // Documents and reports
  {
    id: 'documents',
    name: 'Documents',
    description: 'View and manage all documents',
    keywords: ['files', 'paperwork', 'records', 'uploads', 'attachments'],
    url: '/documents',
    icon: 'file-text'
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Generate and view financial reports',
    keywords: ['analytics', 'statistics', 'summary', 'data', 'insights'],
    url: '/reports',
    icon: 'bar-chart'
  },
  {
    id: 'daily-report',
    name: 'Daily Report',
    description: 'View today\'s financial summary',
    keywords: ['today', 'daily summary', 'day report', 'current day'],
    url: '/reports/daily',
    icon: 'calendar'
  },
  {
    id: 'monthly-report',
    name: 'Monthly Report',
    description: 'View monthly financial summary',
    keywords: ['month', 'monthly summary', 'month report', 'current month'],
    url: '/reports/monthly',
    icon: 'calendar'
  },
  
  // Settings and help
  {
    id: 'settings',
    name: 'Settings',
    description: 'Manage application settings and preferences',
    keywords: ['preferences', 'options', 'configuration', 'setup'],
    url: '/settings',
    icon: 'settings'
  },
  {
    id: 'profile',
    name: 'My Profile',
    description: 'View and edit your profile information',
    keywords: ['account', 'personal', 'my account', 'user profile'],
    url: '/profile',
    icon: 'user'
  },
  {
    id: 'help-center',
    name: 'Help Center',
    description: 'Get help and support for using the application',
    keywords: ['support', 'assistance', 'guide', 'faq', 'help'],
    url: '/help',
    icon: 'help-circle'
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'View your notifications and alerts',
    keywords: ['alerts', 'messages', 'updates', 'notices'],
    url: '/notifications',
    icon: 'bell'
  }
];

/**
 * Search for page commands matching the query
 * @param query Search query
 * @returns Array of search results for matching page commands
 */
export function searchPageCommands(query: string): SearchResult[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];
  
  for (const command of pageCommands) {
    // Check if query matches name, description or keywords
    const nameMatch = command.name.toLowerCase().includes(normalizedQuery);
    const nameStartsWithMatch = command.name.toLowerCase().startsWith(normalizedQuery);
    const descMatch = command.description.toLowerCase().includes(normalizedQuery);
    
    // Enhanced keyword matching with partial match support
    const keywordMatches = command.keywords.filter(keyword => 
      keyword.toLowerCase().includes(normalizedQuery)
    );
    const keywordStartsWithMatches = command.keywords.filter(keyword => 
      keyword.toLowerCase().startsWith(normalizedQuery)
    );
    const exactKeywordMatches = command.keywords.filter(keyword => 
      keyword.toLowerCase() === normalizedQuery
    );
    
    // Check for word-level matches (e.g., "send" should match "send money")
    const wordLevelMatches = command.keywords.filter(keyword => {
      const words = keyword.toLowerCase().split(/\s+/);
      return words.some(word => word === normalizedQuery);
    });
    
    const hasAnyMatch = nameMatch || descMatch || keywordMatches.length > 0;
    
    if (hasAnyMatch) {
      // Calculate relevance score with improved weighting
      let score = 0;
      
      // Exact matches in name are highest priority
      if (command.name.toLowerCase() === normalizedQuery) {
        score += 150; // Increased from 100 to prioritize exact matches
      } else if (nameStartsWithMatch) {
        score += 120; // New high priority for name starts with match
      } else if (nameMatch) {
        score += 90; // Increased from 75 to differentiate from keyword matches
      }
      
      // Keyword matches with improved prioritization
      if (exactKeywordMatches.length > 0) {
        score += 80; // Exact keyword matches are high priority
      }
      
      if (keywordStartsWithMatches.length > 0) {
        score += 70; // Keywords that start with the query are next priority
      }
      
      if (wordLevelMatches.length > 0) {
        score += 65; // Word-level matches (e.g., "send" in "send money")
      }
      
      if (keywordMatches.length > 0 && !exactKeywordMatches.length && !keywordStartsWithMatches.length) {
        score += 50; // General keyword matches
      }
      
      // Description matches are lowest priority
      if (descMatch) {
        score += 30;
      }
      
      // Boost score for common actions like "send money", "exchange rates", etc.
      if (['send-money', 'exchange-rates', 'transactions', 'clients', 'dashboard'].includes(command.id)) {
        score += 10; // Slight boost for frequently used pages
      }
      
      results.push({
        id: command.id,
        title: command.name,
        description: command.description,
        url: command.url,
        type: 'page',
        relevance: score,
        metadata: {
          icon: command.icon || 'file',
          keywords: command.keywords,
          isDirectNavigation: true // Flag to indicate this can be directly navigated to
        }
      });
    }
  }
  
  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.relevance - a.relevance);
}
