'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, Mail, Copy, Check, MapPin, Home, Building, Globe } from 'lucide-react';

interface IntegratedContactAddressSectionProps {
  phone: string;
  email: string;
  address: {
    country: string;
    street: string;
    city: string;
    postalCode?: string;
  };
}

export const IntegratedContactAddressSection: React.FC<IntegratedContactAddressSectionProps> = ({
  phone,
  email,
  address
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy: ', err);
        return false;
      }
    } else {
      return false;
    }
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(field);
      setToastMessage(`${field} copied to clipboard`);
      setShowToast(true);
      
      // Hide the check icon after 1.5s
      setTimeout(() => setCopied(null), 1500);
      
      // Hide the toast after 2s
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // Extract country code for potential flag display
  const extractCountryCode = (phoneNumber: string) => {
    const match = phoneNumber.match(/^\+(\d{1,3})/);
    return match ? match[1] : null;
  };
  
  const countryCode = extractCountryCode(phone);
  
  // Get flag emoji from country code
  const getCountryFlag = (code: string | null) => {
    if (!code) return '';
    
    // Simple mapping for common country codes
    const codeToFlag: Record<string, string> = {
      '1': '🇺🇸', // USA
      '44': '🇬🇧', // UK
      '91': '🇮🇳', // India
      '61': '🇦🇺', // Australia
      '49': '🇩🇪', // Germany
      '33': '🇫🇷', // France
      '81': '🇯🇵', // Japan
    };
    
    return codeToFlag[code] || '';
  };

  const InfoSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode 
  }) => (
    <div className="mb-4 last:mb-0 pb-4 border-b border-[#E5E5EA] dark:border-[#38383A] last:border-b-0 last:pb-0">
      <h4 className="text-base font-medium text-[#1C1C1E] dark:text-white mb-3">
        {title}
      </h4>
      {children}
    </div>
  );

  const DetailRow = ({ 
    icon,
    label, 
    value,
    actions
  }: { 
    icon: React.ReactNode;
    label: string; 
    value: string; 
    actions?: React.ReactNode;
  }) => (
    <div className="flex items-start py-3">
      <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow">
        <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">{label}</span>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#1C1C1E] dark:text-white">{value || 'N/A'}</span>
          {actions}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-[#E5E5EA] dark:border-[#38383A] bg-[#F9F9FB] dark:bg-[#2C2C2E]">
        <h3 className="text-base font-semibold text-[#1C1C1E] dark:text-white">
          Contact & Address Information
        </h3>
      </div>
      
      <div className="p-5">
        {/* Row 1: Phone Number and Email */}
        <div className="grid grid-cols-2 gap-4 mb-3 pb-3">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <PhoneCall size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">Phone Number</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-[#1C1C1E] dark:text-white mr-2">{phone} {getCountryFlag(countryCode)}</span>
                <button 
                  className="text-[#007AFF] dark:text-[#0A84FF] p-1 rounded-full hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]"
                  onClick={() => handleCopy(phone, 'Phone number')}
                >
                  {copied === 'Phone number' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <Mail size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">Email Address</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-[#1C1C1E] dark:text-white mr-2 truncate">{email}</span>
                <button 
                  className="text-[#007AFF] dark:text-[#0A84FF] p-1 rounded-full hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] flex-shrink-0"
                  onClick={() => handleCopy(email, 'Email')}
                >
                  {copied === 'Email' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Row 2: Country and City */}
        <div className="grid grid-cols-2 gap-4 mb-3 pb-3">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <MapPin size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">Country</span>
              <span className="text-sm font-medium text-[#1C1C1E] dark:text-white">{address.country}</span>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <Building size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">City</span>
              <span className="text-sm font-medium text-[#1C1C1E] dark:text-white">{address.city}</span>
            </div>
          </div>
        </div>
        
        {/* Row 3: Street Address and Postal Code */}
        <div className="grid grid-cols-2 gap-4 mb-3 pb-3">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <Home size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">Street Address</span>
              <span className="text-sm font-medium text-[#1C1C1E] dark:text-white">{address.street}</span>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <Globe size={16} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <div className="flex-grow">
              <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D] block">Postal Code</span>
              <span className="text-sm font-medium text-[#1C1C1E] dark:text-white">{address.postalCode || 'Not Provided'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apple-style toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1C1C1E]/90 dark:bg-[#2C2C2E]/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-medium z-10"
          >
            <div className="flex items-center">
              <Check size={14} className="mr-2 text-[#34C759] dark:text-[#30D158]" />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
