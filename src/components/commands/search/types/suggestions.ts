export interface SearchSuggestion {
  title: string;
  description?: string;
  icon: string;
  type: 'page' | 'suggestion';
  url?: string;
  action?: () => void;
  category: string;
  text: string;
}

export const FIXED_SUGGESTIONS: SearchSuggestion[] = [
  // Money Operations
  {
    title: 'Send Money',
    description: 'Transfer money to another account',
    icon: 'arrow-right-left',
    text: 'Send Money',
    type: 'page',
    url: '/send-money',
    category: 'money'
  },
  {
    title: 'Deposit',
    description: 'Add funds to your account',
    icon: 'plus-circle',
    text: 'Deposit',
    type: 'page',
    url: '/deposit',
    category: 'money'
  },
  {
    title: 'Withdrawal',
    description: 'Withdraw funds from your account',
    icon: 'minus-circle',
    text: 'Withdrawal',
    type: 'page',
    url: '/withdrawal',
    category: 'money'
  },
  {
    title: 'Exchange',
    description: 'Convert between currencies',
    icon: 'refresh-cw',
    text: 'Exchange',
    type: 'page',
    url: '/exchange',
    category: 'money'
  },

  // Client Management
  {
    title: 'New Client',
    description: 'Add a new client to the system',
    icon: 'user-plus',
    text: 'New Client',
    type: 'page',
    url: '/clients/new',
    category: 'clients'
  },
  {
    title: 'View Clients',
    description: 'Manage existing clients',
    icon: 'users',
    text: 'View Clients',
    type: 'page',
    url: '/clients',
    category: 'clients'
  },

  // Reports
  {
    title: 'Transaction Report',
    description: 'View transaction history',
    icon: 'file-text',
    text: 'Transaction Report',
    type: 'page',
    url: '/reports/transactions',
    category: 'reports'
  },
  {
    title: 'Daily Summary',
    description: 'Get today\'s activity overview',
    icon: 'calendar',
    text: 'Daily Summary',
    type: 'page',
    url: '/reports/daily',
    category: 'reports'
  },

  // Settings
  {
    title: 'System Settings',
    description: 'Configure system preferences',
    icon: 'settings',
    text: 'System Settings',
    type: 'page',
    url: '/settings',
    category: 'settings'
  },
  {
    title: 'Currency Settings',
    description: 'Manage supported currencies',
    icon: 'currency-dollar',
    text: 'Currency Settings',
    type: 'page',
    url: '/settings/currencies',
    category: 'settings'
  },

  // Help
  {
    title: 'Help Center',
    description: 'Get help with common tasks',
    icon: 'help-circle',
    text: 'Help Center',
    type: 'page',
    url: '/help',
    category: 'help'
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'View available keyboard shortcuts',
    icon: 'keyboard',
    text: 'Keyboard Shortcuts',
    type: 'suggestion',
    action: () => {
      // Show keyboard shortcuts modal
    },
    category: 'help'
  }
];
