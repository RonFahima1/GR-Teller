'use client';

import React from 'react';
import { CalendarDays, User2, Users, Flag } from 'lucide-react';
import { InfoSection } from '../shared/InfoSection';

interface PersonalInfoSectionProps {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
}

/**
 * PersonalInfoSection - Displays personal information in a grid layout
 * Matches the reference design with proper spacing and alignment
 */
export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  firstName,
  middleName,
  lastName,
  dateOfBirth,
  gender,
  nationality,
}) => {
  // Format date for display (12-Jun-1985 format)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  return (
    <InfoSection title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        {/* First Row - 3 columns */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">Date of Birth</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7">
            {formatDate(dateOfBirth)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">Gender</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7">
            {gender}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flag className="text-[#007AFF] dark:text-[#0A84FF]" size={18} />
            <span className="text-sm text-[#6C6C70] dark:text-[#98989D]">Nationality</span>
          </div>
          <div className="text-base font-medium text-[#1C1C1E] dark:text-white pl-7">
            {nationality}
          </div>
        </div>
      </div>
    </InfoSection>
  );
};
