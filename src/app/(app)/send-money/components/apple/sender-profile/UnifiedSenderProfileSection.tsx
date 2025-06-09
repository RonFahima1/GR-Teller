'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Users, CalendarDays, Flag,  // Personal info icons
  Phone, Mail, MapPin, Building, Map, Home, // Contact info icons
  CreditCard, Globe, FileText, CalendarRange, // Identification icons
  Wallet, FileCheck, Gauge, Smartphone, // Product icons
  Copy, Check // For copy functionality
} from 'lucide-react';

// Simple tooltip component for icon hover
interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block" 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

// Copyable text component with visual feedback
interface CopyableTextProps {
  text: string;
  formatFn?: (text: string) => string;
  isPhone?: boolean;
  isEmail?: boolean;
}

const CopyableText: React.FC<CopyableTextProps> = ({ text, formatFn, isPhone = false, isEmail = false }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering any parent click handlers
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };
  
  const displayText = formatFn ? formatFn(text) : text;
  
  // Determine if we should render as a link
  const isClickable = isPhone || isEmail;
  const href = isPhone ? `tel:${text.replace(/[\s-]/g, '')}` : isEmail ? `mailto:${text}` : undefined;
  
  return (
    <div className="group flex items-center">
      {isClickable ? (
        <a href={href} className="text-[15px] text-[#007AFF] dark:text-[#0A84FF] underline-offset-2 hover:underline">
          {displayText}
        </a>
      ) : (
        <span className="text-[15px] text-[#1C1C1E] dark:text-white">
          {displayText}
        </span>
      )}
      
      <button 
        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
        aria-label={`Copy ${isPhone ? 'phone number' : isEmail ? 'email' : 'text'}`}
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy size={14} className="text-[#8E8E93] dark:text-[#98989D] hover:text-[#007AFF] dark:hover:text-[#0A84FF]" />
        )}
      </button>
    </div>
  );
};

interface Identification {
  type: string;
  issuanceCountry?: string;
  number: string;
  expiryDate?: string;
  issueDate?: string;
}

interface Contact {
  phoneNumber: string;
  email: string;
  country: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

interface Products {
  prepaidCard?: any | null;
  simCard?: any | null;
  [key: string]: any;
}

interface Sender {
  firstName: string;
  middleName?: string;
  lastName: string;
  status: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  identification: Identification;
  contact: Contact;
  products: Products;
}

interface UnifiedSenderProfileSectionProps {
  sender: Sender;
}

// Helper function for formatting dates consistently
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(date.getDate()).padStart(2, '0')}-${months[date.getMonth()]}-${date.getFullYear()}`;
};

export const UnifiedSenderProfileSection: React.FC<UnifiedSenderProfileSectionProps> = ({ sender }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-[#1C1C1E] shadow-sm overflow-hidden h-full">
      <div className="h-full overflow-auto" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: '#8E8E93 transparent'
      }}>
        {/* Personal Information */}
        <div className="p-3 border-b border-[#E5E5EA] dark:border-[#38383A]">
          <h3 className="text-[15px] font-semibold mb-2 text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif] tracking-tight">
            PERSONAL INFORMATION
          </h3>
          
          {/* First row: First, Middle, Last Name in a 3-column grid */}
          <div className="mb-4 grid grid-cols-3 gap-4">
            {/* First Name */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                  <User size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">First Name</div>
                <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                  {sender.firstName}
                </div>
              </div>
            </div>
            
            {/* Middle Name */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                  <User size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Middle Name</div>
                <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                  {sender.middleName || '-'}
                </div>
              </div>
            </div>
            
            {/* Last Name */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                  <User size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Last Name</div>
                <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                  {sender.lastName}
                </div>
              </div>
            </div>
          </div>
          
          {/* Second row: Date of Birth, Nationality, and Gender in a 3-column grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Date of Birth */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                  <CalendarDays size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Date of Birth</div>
                <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                  {formatDate(sender.dateOfBirth)}
                </div>
              </div>
            </div>
            
            {/* Nationality */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                  <Flag size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Nationality</div>
                <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                  {sender.nationality}
                </div>
              </div>
            </div>
            
            {/* Gender */}
            <div className="flex items-start">
              <div className="mr-2 mt-0.5">
                <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                  <Users size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Gender</div>
                <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                  {sender.gender}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="p-3 border-b border-[#E5E5EA] dark:border-[#38383A]">
        <h3 className="text-[15px] font-semibold mb-2 text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif] tracking-tight">
          CONTACT INFORMATION
        </h3>
        
        {/* Phone & Email */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Phone size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Phone Number</div>
              <CopyableText text={sender.contact.phoneNumber} isPhone={true} />
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Mail size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Email</div>
              <CopyableText text={sender.contact.email} isEmail={true} />
            </div>
          </div>
        </div>
        
        {/* Address divider line */}
        <div className="h-px bg-[#E5E5EA] dark:bg-[#38383A] my-3"></div>
        
        {/* Address details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Globe size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Country</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.contact.country}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Building size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">City</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.contact.city || '-'}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Home size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Address</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.contact.address}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <MapPin size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Postal Code</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.contact.postalCode || '-'}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Identification Section */}
      <div className="p-3 border-b border-[#E5E5EA] dark:border-[#38383A]">
        <h3 className="text-[15px] font-semibold mb-2 text-[#1C1C1E] dark:text-white font-['SF Pro Display','Helvetica','Arial',sans-serif] tracking-tight">
          IDENTIFICATION
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <CreditCard size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">ID Type</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.identification.type}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <Globe size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Issue Country</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.identification.issuanceCountry || '-'}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <FileText size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">ID Number</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">{sender.identification.number}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-2 mt-0.5">
              <div className="w-7 h-7 bg-[#E5E5EA]/50 dark:bg-[#3A3A3C] rounded-full flex items-center justify-center">
                <CalendarRange size={14} className="text-[#007AFF] dark:text-[#0A84FF]" />
              </div>
            </div>
            <div>
              <div className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-1">Expiry Date</div>
              <div className="text-[15px] text-[#1C1C1E] dark:text-white">
                {sender.identification.expiryDate ? formatDate(sender.identification.expiryDate || '') : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* No Products Section - moved to AccountBalancesSection */}
    </div>
  );
};
