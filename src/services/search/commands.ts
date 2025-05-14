import { SearchCommand } from '@/types/search.types';

// Available commands
export const commands: SearchCommand[] = [
  {
    id: 'new-transaction',
    title: 'New Transaction',
    description: 'Start a new money transfer',
    keywords: ['send', 'money', 'transfer', 'new', 'transaction'],
    action: () => {
      // Using window.location for client-side navigation
      // This avoids the useRouter hook which can only be used in components
      window.location.href = '/transactions/new';
    },
    icon: 'send'
  },
  {
    id: 'new-client',
    title: 'New Client',
    description: 'Register a new client',
    keywords: ['add', 'client', 'register', 'new', 'customer'],
    action: () => {
      window.location.href = '/clients/new';
    },
    icon: 'user-plus'
  },
  {
    id: 'reset-password',
    title: 'Reset Password',
    description: 'Reset your account password',
    keywords: ['reset', 'password', 'change', 'security'],
    action: () => {
      window.location.href = '/settings/security';
    },
    icon: 'lock'
  },
  {
    id: 'exchange-rates',
    title: 'View Exchange Rates',
    description: 'Check current exchange rates',
    keywords: ['exchange', 'rates', 'currency', 'conversion'],
    action: () => {
      window.location.href = '/exchange-rates';
    },
    icon: 'refresh-cw'
  },
  {
    id: 'cash-register',
    title: 'Open Cash Register',
    description: 'Open the cash register',
    keywords: ['cash', 'register', 'drawer', 'money'],
    action: () => {
      window.location.href = '/cash-register';
    },
    icon: 'dollar-sign'
  },
  {
    id: 'help-center',
    title: 'Help Center',
    description: 'Visit the help center',
    keywords: ['help', 'support', 'guide', 'assistance'],
    action: () => {
      window.location.href = '/help';
    },
    icon: 'help-circle'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage your settings',
    keywords: ['settings', 'preferences', 'account', 'profile'],
    action: () => {
      window.location.href = '/settings';
    },
    icon: 'settings'
  },
  {
    id: 'logout',
    title: 'Log Out',
    description: 'Log out of your account',
    keywords: ['logout', 'signout', 'exit', 'leave'],
    action: () => {
      window.location.href = '/logout';
    },
    icon: 'log-out'
  },
];
