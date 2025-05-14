import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * Tab navigation component for the client profile page
 */
export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'transactions', label: 'Transactions' },
    { id: 'documents', label: 'Documents' },
    { id: 'limits', label: 'Limits' },
    { id: 'notes', label: 'Notes' },
    { id: 'kyc', label: 'KYC/Compliance' },
  ];

  return (
    <div className="flex gap-4 mb-6 border-b">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`py-2 px-4 -mb-px border-b-2 ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-gray-600'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
