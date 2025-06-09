'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GlobalCreditTab } from './tabs/GlobalCreditTab';
import { ComplianceNotificationsTab } from './tabs/ComplianceNotificationsTab';
import { CustomerNotificationsTab } from './tabs/CustomerNotificationsTab';
import { WebMobileNotificationsTab } from './tabs/WebMobileNotificationsTab';
import { AgentsAnnouncementsTab } from './tabs/AgentsAnnouncementsTab';
import { ReceiptTab } from './tabs/ReceiptTab';
import { AgentBalanceTab } from './tabs/AgentBalanceTab';

import {
  Building,
  Bell,
  Users,
  Smartphone,
  FileText,
  RotateCw,
  Megaphone
} from 'lucide-react';

// Define tab interface with proper icon component type
type IconComponent = typeof Building;

interface OrganizationTab {
  id: string;
  label: string;
  icon: IconComponent;
  component: React.FC;
}

export function TabsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Define available tabs with their properties and components
  const tabs: OrganizationTab[] = [
    { id: 'global-credit', label: 'Global Credit', icon: Building, component: GlobalCreditTab },
    { id: 'compliance-notifications', label: 'Compliance Notifications', icon: Bell, component: ComplianceNotificationsTab },
    { id: 'customer-notifications', label: 'Customer Notifications', icon: Users, component: CustomerNotificationsTab },
    { id: 'web-mobile-notifications', label: 'Web & Mobile Notifications', icon: Smartphone, component: WebMobileNotificationsTab },
    { id: 'agents-announcements', label: 'Agent Announcements', icon: Megaphone, component: AgentsAnnouncementsTab },
    { id: 'receipt', label: 'Receipt', icon: FileText, component: ReceiptTab },
    { id: 'agent-balance', label: 'Agent Balance Conversion', icon: RotateCw, component: AgentBalanceTab },
  ];
  
  // Set default tab or use the one from URL
  const defaultTab = tabs.find(tab => tab.id === tabParam)?.id || tabs[0].id;
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without full page refresh
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`/admin/organization-settings?${params.toString()}`, { scroll: false });
  };
  
  // Update active tab when URL changes
  useEffect(() => {
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam, tabs]);
  
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b overflow-x-auto">
          <TabsList className="h-auto p-0 w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none px-4 py-2 h-12"
              >
                <div className="flex items-center">
                  {/* Use the Icon component directly with JSX */}
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span>{tab.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="pt-6 pb-4 px-6">
          {tabs.map(({ id, component: Component }) => (
            <TabsContent key={id} value={id} className="m-0">
              <Component />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
