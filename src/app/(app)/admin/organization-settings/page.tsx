import { Metadata } from 'next';
import { TabsContainer } from './components/TabsContainer';

export const metadata: Metadata = {
  title: 'Organization Settings | Admin',
  description: 'Manage organization settings, notifications, and configurations',
};

export default function OrganizationSettingsPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Organization Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your organization's global settings, notifications, and preferences.
        </p>
      </div>
      
      <TabsContainer />
    </div>
  );
}
