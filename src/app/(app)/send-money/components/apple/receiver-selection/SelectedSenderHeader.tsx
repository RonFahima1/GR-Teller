import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, CreditCard, Shield } from 'lucide-react';
import { Client } from '../../../hooks/useSendMoneyForm';
import { InfoItem } from '../shared/InfoItem';
import { Badge } from '../shared/Badge';

interface SelectedSenderHeaderProps {
  sender: Client;
}

export function SelectedSenderHeader({ sender }: SelectedSenderHeaderProps) {
  // Format identifier for display (ID, passport, etc.)
  const formatIdentifier = () => {
    if (sender.passportNumber) return `Passport: ${sender.passportNumber}`;
    if (sender.idNumber) return `ID: ${sender.idNumber}`;
    if (sender.drivingLicense) return `License: ${sender.drivingLicense}`;
    return `Client ID: ${sender.id.substring(0, 8)}...`;
  };

  const renderStatusBadge = () => {
    const status = sender.status?.toLowerCase() || 'active';
    
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'suspended':
        return <Badge variant="error">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#2C2C2E] rounded-xl shadow-sm border border-gray-100 dark:border-[#3A3A3C] p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Selected Sender</h2>
        {renderStatusBadge()}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
        <InfoItem
          icon={<User className="h-4 w-4 text-[#007AFF] dark:text-[#0A84FF]" />}
          label="Name"
          value={`${sender.firstName} ${sender.lastName}`}
        />

        <InfoItem
          icon={<Phone className="h-4 w-4 text-[#007AFF] dark:text-[#0A84FF]" />}
          label="Phone"
          value={sender.phone || 'Not provided'}
        />

        <InfoItem
          icon={<MapPin className="h-4 w-4 text-[#007AFF] dark:text-[#0A84FF]" />}
          label="Country"
          value={sender.country || 'Not provided'}
        />

        <InfoItem
          icon={<Shield className="h-4 w-4 text-[#007AFF] dark:text-[#0A84FF]" />}
          label="Identification"
          value={formatIdentifier()}
        />

        <InfoItem
          icon={<CreditCard className="h-4 w-4 text-[#007AFF] dark:text-[#0A84FF]" />}
          label="Balance"
          value={`${sender.balance?.toFixed(2) || '0.00'} ${sender.currency || 'USD'}`}
        />
      </div>
    </motion.div>
  );
}
