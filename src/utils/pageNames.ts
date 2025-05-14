export const getPageNameFromUrl = (url: string): string => {
  const path = url.split('/').pop() || ''; // Get last segment of URL path
  
  // Map URLs to page names
  const pageNameMap: Record<string, string> = {
    'send-money': 'Send Money',
    'deposit': 'Deposit',
    'withdrawal': 'Withdrawal',
    'exchange': 'Exchange',
    'clients': 'Clients',
    'dashboard': 'Dashboard',
    'reports': 'Reports',
    'settings': 'Settings'
    // Add more mappings as needed
  };

  return pageNameMap[path] || 'Unknown Page';
};
