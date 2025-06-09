'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, Mail, Globe, ChevronRight, Copy, Check, MessageSquare } from 'lucide-react';
import { extractCountryCode, getCountryFlag, copyToClipboard } from './utils';

interface ContactDetailsSectionProps {
  phone: string;
  email: string;
}

export const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({ phone, email }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Get country code from phone number to display flag
  const countryCode = extractCountryCode(phone);
  const flag = getCountryFlag(countryCode);
  
  const handleCopy = async (text: string, type: string) => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(type);
      setToastMessage(`${type} copied to clipboard`);
      setShowToast(true);
      
      // Hide the check icon after 1.5s
      setTimeout(() => setCopied(null), 1500);
      
      // Hide the toast after 2s
      setTimeout(() => setShowToast(false), 2000);
    }
  };
  
  return (
    <div className="relative bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#38383A] overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-[#E5E5EA] dark:border-[#38383A] bg-[#F9F9FB] dark:bg-[#2C2C2E]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] flex items-center justify-center mr-3">
            <PhoneCall size={18} className="text-[#007AFF] dark:text-[#0A84FF]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C1E] dark:text-white">
            Contact Information
          </h3>
        </div>
      </div>
      <div className="p-6">
        {/* Phone section with improved visual design */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mb-6 pb-6 border-b border-[#E5E5EA] dark:border-[#38383A]"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <PhoneCall size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D]">
              Phone Number
            </span>
          </div>
          <div className="flex items-center justify-between pl-12">
            <div className="flex items-center">
              <span className="mr-2 text-xl">{flag}</span>
              <span className="text-base font-medium tracking-wide text-[#1C1C1E] dark:text-white">
                {phone}
              </span>
            </div>
            <div className="flex space-x-2">
              {/* Call button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: '#E5E5EA', scale: 1.05 }}
                className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] dark:text-[#0A84FF] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors shadow-sm"
                aria-label="Call phone number"
              >
                <PhoneCall size={18} />
              </motion.button>
              
              {/* Message button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: '#E5E5EA', scale: 1.05 }}
                className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] dark:text-[#0A84FF] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors shadow-sm"
                aria-label="Message phone number"
              >
                <MessageSquare size={18} />
              </motion.button>
              
              {/* Copy button */}
              {phone && (
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ backgroundColor: '#E5E5EA', scale: 1.05 }}
                  onClick={() => handleCopy(phone, 'Phone number')}
                  className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] dark:text-[#98989D] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] hover:text-[#007AFF] dark:hover:text-[#0A84FF] transition-colors shadow-sm"
                  aria-label="Copy phone number"
                >
                  {copied === 'Phone number' ? (
                    <Check size={18} className="text-[#34C759] dark:text-[#30D158]" />
                  ) : (
                    <Copy size={18} />
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Email section with improved visual design */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mb-6 pb-6 border-b border-[#E5E5EA] dark:border-[#38383A]"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-3 flex-shrink-0">
              <Mail size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <span className="text-sm font-medium text-[#6C6C70] dark:text-[#98989D]">
              Email Address
            </span>
          </div>
          <div className="flex items-center justify-between pl-12">
            <span className="text-base font-medium tracking-wide text-[#1C1C1E] dark:text-white break-all mr-3">
              {email || 'Not Provided'}
            </span>
            <div className="flex space-x-2 flex-shrink-0">
              {/* Email button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: '#E5E5EA', scale: 1.05 }}
                className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#007AFF] dark:text-[#0A84FF] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors shadow-sm"
                aria-label="Send email"
              >
                <Mail size={18} />
              </motion.button>
              
              {/* Copy button */}
              {email && (
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ backgroundColor: '#E5E5EA', scale: 1.05 }}
                  onClick={() => handleCopy(email, 'Email')}
                  className="p-2.5 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] text-[#8E8E93] dark:text-[#98989D] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] hover:text-[#007AFF] dark:hover:text-[#0A84FF] transition-colors shadow-sm"
                  aria-label="Copy email"
                >
                  {copied === 'Email' ? (
                    <Check size={18} className="text-[#34C759] dark:text-[#30D158]" />
                  ) : (
                    <Copy size={18} />
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* More contact options button */}
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: '#E5E5EA' }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between py-4 text-[#007AFF] dark:text-[#0A84FF] bg-[#F2F2F7] dark:bg-[#2C2C2E] hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C] transition-colors rounded-xl px-5 shadow-sm"
          onClick={() => {
            // Would navigate to contact options in a real app
            // Currently just provide haptic feedback
            if (navigator && 'vibrate' in navigator && navigator.vibrate) {
              navigator.vibrate(50); 
            }
          }}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#E5E5EA]/70 dark:bg-[#3A3A3C] flex items-center justify-center mr-3">
              <Globe size={20} className="text-[#007AFF] dark:text-[#0A84FF]" />
            </div>
            <span className="text-base font-medium">
              More Contact Options
            </span>
          </div>
          <ChevronRight size={20} />
        </motion.button>
      </div>
      
      {/* Apple-style toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1C1C1E]/90 dark:bg-[#2C2C2E]/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-lg text-base font-medium z-10"
          >
            <div className="flex items-center">
              <Check size={16} className="mr-2 text-[#34C759] dark:text-[#30D158]" />
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
