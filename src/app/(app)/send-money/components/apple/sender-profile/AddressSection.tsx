'use client';

import React from 'react';
import { MapPin, Building, Home } from 'lucide-react';

interface AddressSectionProps {
  address: {
    country: string;
    street: string;
    city: string;
    postalCode?: string;
    isVerified?: boolean;
  };
}

export const AddressSection: React.FC<AddressSectionProps> = ({ address }) => {
  const DetailRow = ({ 
    label, 
    value, 
    icon 
  }: { 
    label: string; 
    value: string; 
    icon?: React.ReactNode 
  }) => (
    <div className="flex py-4 border-b border-[#E5E5EA] dark:border-[#38383A] last:border-b-0">
      {icon && (
        <div className="w-8 h-8 rounded-full bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] flex items-center justify-center mr-3">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] mb-1 block">{label}</span>
        <span className="text-base font-medium text-[#1C1C1E] dark:text-white">{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#E5E5EA] dark:border-[#38383A] bg-[#F9F9FB] dark:bg-[#2C2C2E]">
        <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white">
          Address Information
        </h3>
      </div>

      <div className="p-6">
        <DetailRow 
          label="Country" 
          value={address.country} 
          icon={<MapPin size={16} className="text-[#3A3A3C] dark:text-[#EBEBF0]" />}
        />
        <DetailRow 
          label="Street Address" 
          value={address.street} 
          icon={<Home size={16} className="text-[#3A3A3C] dark:text-[#EBEBF0]" />}
        />
        <DetailRow 
          label="City" 
          value={address.city} 
          icon={<Building size={16} className="text-[#3A3A3C] dark:text-[#EBEBF0]" />}
        />
        <div className="flex pl-11 py-4">
          <div className="flex-1">
            <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] mb-1 block">Postal Code</span>
            {address.postalCode ? (
              <span className="text-base font-medium text-[#1C1C1E] dark:text-white">{address.postalCode}</span>
            ) : (
              <span className="text-base text-[#8E8E93] dark:text-[#98989D]">Not Provided</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
