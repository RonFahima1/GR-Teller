'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Flag, Copy, ExternalLink } from 'lucide-react';
import { InfoSection } from '../shared/InfoSection';
import { InfoItem } from '../shared/InfoItem';
import { CopyableText } from '../shared/CopyableText';
import { motion } from 'framer-motion';

// Local tooltip implementation until shared component is fully available
interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block" 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? 5 : -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-[#1C1C1E] dark:bg-[#2C2C2E] rounded whitespace-nowrap ${position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} left-1/2 transform -translate-x-1/2 pointer-events-none`}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

interface ContactInfoSectionProps {
  phoneNumber: string;
  email: string;
  country: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

/**
 * ContactInfoSection - Displays contact information and address
 * Following Apple HIG guidelines with clean layout
 */
export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  phoneNumber,
  email,
  country,
  address,
  city,
  state,
  postalCode
}) => {
  // Get flag emoji based on country code
  const getCountryFlag = (countryCode: string): string => {
    // This is a simplified version - in production you'd want to use a proper library
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };
  
  // Format the complete address
  const formattedAddress = `${address}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}${postalCode ? ` ${postalCode}` : ''}${country ? `, ${country}` : ''}`;

  return (
    <InfoSection title="Contact Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <InfoItem
            label="Phone Number"
            value={(
              <div className="flex items-center justify-between">
                <span className="text-[15px] text-[#1C1C1E] dark:text-white">{phoneNumber}</span>
                <div className="flex space-x-2">
                  <Tooltip content="Copy phone number">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="text-[#007AFF] dark:text-[#0A84FF] z-10"
                      onClick={() => {
                        navigator.clipboard.writeText(phoneNumber);
                      }}
                      aria-label="Copy phone number"
                    >
                      <Copy size={14} />
                    </motion.button>
                  </Tooltip>
                  
                  <Tooltip content="Call this number">
                    <motion.a
                      href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                      whileTap={{ scale: 0.95 }}
                      className="text-[#34C759] dark:text-[#30D158] z-10"
                      aria-label="Call this phone number"
                    >
                      <Phone size={14} />
                    </motion.a>
                  </Tooltip>
                </div>
              </div>
            )}
            icon={<Phone size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />}
          />
        </div>
        
        <div className="relative">
          <InfoItem
            label="Email Address"
            value={(
              <div className="flex items-center justify-between">
                <span className="text-[15px] text-[#1C1C1E] dark:text-white truncate max-w-[70%]">{email}</span>
                <div className="flex space-x-2">
                  <Tooltip content="Copy email address">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="text-[#007AFF] dark:text-[#0A84FF] z-10"
                      onClick={() => {
                        navigator.clipboard.writeText(email);
                      }}
                      aria-label="Copy email address"
                    >
                      <Copy size={14} />
                    </motion.button>
                  </Tooltip>
                  
                  <Tooltip content="Send email">
                    <motion.a
                      href={`mailto:${email}`}
                      whileTap={{ scale: 0.95 }}
                      className="text-[#34C759] dark:text-[#30D158] z-10"
                      aria-label="Send email"
                    >
                      <ExternalLink size={14} />
                    </motion.a>
                  </Tooltip>
                </div>
              </div>
            )}
            icon={<Mail size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />}
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#E5E5EA] dark:border-[#38383A]">
        <InfoItem
          label="Address"
          value={formattedAddress}
          icon={<MapPin size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />}
        />
        
        {(city || state || postalCode) && (
          <div className="mt-2 ml-8 grid grid-cols-3 gap-3">
            {city && (
              <div className="col-span-1">
                <p className="text-[12px] font-medium text-[#6C6C70] dark:text-[#98989D]">City</p>
                <p className="text-[14px] text-[#1C1C1E] dark:text-white">{city}</p>
              </div>
            )}
            {state && (
              <div className="col-span-1">
                <p className="text-[12px] font-medium text-[#6C6C70] dark:text-[#98989D]">State</p>
                <p className="text-[14px] text-[#1C1C1E] dark:text-white">{state}</p>
              </div>
            )}
            {postalCode && (
              <div className="col-span-1">
                <p className="text-[12px] font-medium text-[#6C6C70] dark:text-[#98989D]">Postal Code</p>
                <p className="text-[14px] text-[#1C1C1E] dark:text-white">{postalCode}</p>
              </div>
            )}
          </div>
        )}
        
        {country && (
          <div className="mt-3 ml-8">
            <InfoItem
              label="Country"
              value={`${getCountryFlag(country.substring(0, 2))} ${country}`}
              icon={<Flag size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />}
            />
          </div>
        )}
      </div>
    </InfoSection>
  );
};
