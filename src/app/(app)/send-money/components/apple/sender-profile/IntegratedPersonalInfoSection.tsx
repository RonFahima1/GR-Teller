'use client';

import React from 'react';
import { Calendar, User, Flag, Users, CreditCard, MapPin, FileCheck, UserCircle, UserRound } from 'lucide-react';

interface IntegratedPersonalInfoSectionProps {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  identification: {
    type: string;
    issuanceCountry?: string;
    number: string;
    expiryDate?: string;
    issueDate?: string;
  };
}

export const IntegratedPersonalInfoSection: React.FC<IntegratedPersonalInfoSectionProps> = ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  gender,
  nationality,
  identification,
}) => {
  // Format date for display (07-May-2007)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  const InfoItem = ({ 
    icon, 
    label, 
    value 
  }: { 
    icon: React.ReactNode;
    label: string; 
    value: string 
  }) => (
    <div className="flex items-start py-3 border-b border-[#E5E5EA] dark:border-[#38383A] last:border-b-0">
      <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow">
        <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">{label}</span>
        <span className="text-sm font-medium text-[#1C1C1E] dark:text-white">{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden h-full">
      {/* Personal Information Section */}
      <div className="px-5 py-3 border-b border-[#E5E5EA] dark:border-[#38383A] bg-[#F9F9FB] dark:bg-[#2C2C2E]">
        <h3 className="text-base font-semibold text-[#1C1C1E] dark:text-white">
          Personal Information
        </h3>
      </div>
      
      <div className="p-5">
        {/* Row 1: First Name and Middle Name */}
        <div className="grid grid-cols-2 gap-4 mb-3 pb-3">
          <InfoItem 
            icon={<UserCircle size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            label="First Name"
            value={firstName}
          />
          
          <InfoItem 
            icon={<User size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            label="Middle Name"
            value={middleName || '-'}
          />
        </div>
        
        {/* Row 2: Last Name and Gender */}
        <div className="grid grid-cols-2 gap-4 mb-3 pb-3">
          <InfoItem 
            icon={<UserRound size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            label="Last Name"
            value={lastName}
          />
          
          <InfoItem 
            icon={<Users size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            label="Gender"
            value={gender}
          />
        </div>
        
        {/* Row 3: Date of Birth and Nationality */}
        <div className="grid grid-cols-2 gap-4 mb-3 pb-3">
          <InfoItem 
            icon={<Calendar size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            label="Date of Birth"
            value={formatDate(dateOfBirth)}
          />
          
          <InfoItem 
            icon={<Flag size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            label="Nationality"
            value={nationality}
          />
        </div>

        {/* Identification Section */}
        <div className="pt-3 pb-2 mb-2">
          <h4 className="text-base font-medium text-[#1C1C1E] dark:text-white mb-3">
            Identification Details
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem 
              icon={<FileCheck size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
              label="ID Type"
              value={identification.type}
            />

            <InfoItem 
              icon={<MapPin size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
              label="Issuance Country"
              value={identification.issuanceCountry || 'N/A'}
            />
            
            <InfoItem 
              icon={<CreditCard size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
              label="ID Number"
              value={identification.number}
            />
            
            <InfoItem 
              icon={<Calendar size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />}
              label="Expiry Date"
              value={formatDate(identification.expiryDate || '')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
