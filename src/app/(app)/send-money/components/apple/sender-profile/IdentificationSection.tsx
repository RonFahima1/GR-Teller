'use client';

import React from 'react';
import { CalendarRange, FileText, Flag } from 'lucide-react';
import { InfoSection } from '../shared/InfoSection';

interface IdentificationSectionProps {
  identification: {
    type: string;
    issuanceCountry?: string;
    number: string;
    expiryDate?: string;
    issueDate?: string;
  };
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({ identification }) => {
  // Format date for display (09-May-2028 format)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  return (
    <InfoSection title="Identification (ID)">
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">ID Type</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7">
            {identification.type}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flag className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">Issuance Country</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7">
            {identification.issuanceCountry || 'N/A'}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">ID Number</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7">
            {identification.number}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarRange className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">ID Expiry Date</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7 flex items-center gap-2">
            {formatDate(identification.expiryDate) || 'DD-MMM-YYYY'}
            {identification.expiryDate && (
              <div className="p-0.5 rounded border border-[#E5E5EA] dark:border-[#38383A] cursor-pointer hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] transition-colors">
                <CalendarRange size={14} className="text-[#8E8E93] dark:text-[#98989D]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </InfoSection>
  );
};
