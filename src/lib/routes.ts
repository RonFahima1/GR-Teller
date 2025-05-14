import { useRouter } from 'next/navigation';

export interface QuickActionRoute {
  id: string;
  label: string;
  icon: string;
  route: string;
  tooltip: string;
}

export const quickActionRoutes: QuickActionRoute[] = [
  {
    id: 'send-money',
    label: 'Send Money',
    icon: 'send',
    route: '/transactions/send',
    tooltip: 'Send money to another account'
  },
  {
    id: 'withdraw-money',
    label: 'Withdraw Money',
    icon: 'arrow-down-circle',
    route: '/transactions/withdraw',
    tooltip: 'Withdraw money from account'
  },
  {
    id: 'deposit-money',
    label: 'Deposit Money',
    icon: 'arrow-up-circle',
    route: '/transactions/deposit',
    tooltip: 'Deposit money into account'
  },
  {
    id: 'view-clients',
    label: 'View Clients',
    icon: 'users',
    route: '/clients',
    tooltip: 'View all clients'
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    icon: 'file-text',
    route: '/reports',
    tooltip: 'View system reports'
  },
  {
    id: 'view-transactions',
    label: 'View Transactions',
    icon: 'activity',
    route: '/transactions',
    tooltip: 'View all transactions'
  },
  {
    id: 'view-dashboard',
    label: 'View Dashboard',
    icon: 'grid',
    route: '/dashboard',
    tooltip: 'View dashboard'
  },
  {
    id: 'view-settings',
    label: 'View Settings',
    icon: 'sliders',
    route: '/settings',
    tooltip: 'View system settings'
  },
  {
    id: 'view-users',
    label: 'View Users',
    icon: 'user',
    route: '/users',
    tooltip: 'View system users'
  },
  {
    id: 'view-accounts',
    label: 'View Accounts',
    icon: 'banknote',
    route: '/accounts',
    tooltip: 'View accounts'
  },
  {
    id: 'view-kyc',
    label: 'View KYC',
    icon: 'check-circle',
    route: '/kyc',
    tooltip: 'View KYC verification'
  },
  {
    id: 'view-limits',
    label: 'View Limits',
    icon: 'scale',
    route: '/limits',
    tooltip: 'View transaction limits'
  },
  {
    id: 'view-payouts',
    label: 'View Payouts',
    icon: 'dollar-sign',
    route: '/payouts',
    tooltip: 'View payouts'
  },
  {
    id: 'view-audit-log',
    label: 'View Audit Log',
    icon: 'list',
    route: '/audit-log',
    tooltip: 'View audit log'
  },
  {
    id: 'view-cash-register',
    label: 'View Cash Register',
    icon: 'cash',
    route: '/cash-register',
    tooltip: 'View cash register'
  },
  {
    id: 'view-currency-exchange',
    label: 'View Currency Exchange',
    icon: 'exchange',
    route: '/currency-exchange',
    tooltip: 'View currency exchange rates'
  },
  {
    id: 'view-client-balance',
    label: 'View Client Balance',
    icon: 'users',
    route: '/clients/balances',
    tooltip: 'View client balances'
  }
];

export const navigateToRoute = (route: string) => {
  const router = useRouter();
  router.push(route);
};
