'use client';

import React, { ReactNode, useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoItemProps {
  label: string;
  value: string | ReactNode;
  icon?: ReactNode;
  copyable?: boolean;
  hasInfo?: boolean;
  infoContent?: ReactNode;
  className?: string;
}

/**
 * InfoItem - A standardized component for displaying label/value pairs
 * Uses Apple HIG styling with consistent typography and spacing
 */
export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  icon,
  copyable = false,
  hasInfo = false,
  infoContent,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleCopy = async () => {
    if (typeof value === 'string') {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className={`flex items-start ${className}`}>
      {icon && (
        <div className="w-6 h-6 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center mr-2.5 flex-shrink-0 shadow-sm">
          {React.cloneElement(icon as React.ReactElement, { size: 16 })}
        </div>
      )}
      
      <div className="flex-grow">
        <div className="flex items-center">
          <span className="text-[11px] font-medium text-[#6C6C70] dark:text-[#98989D]">{label}</span>
          {hasInfo && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleInfo}
              className="ml-1.5 text-[#8E8E93] hover:text-[#007AFF] dark:hover:text-[#0A84FF] transition-colors"
              aria-label="More info"
            >
              <Info size={12} />
            </motion.button>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[15px] text-[#1C1C1E] dark:text-white truncate max-w-[calc(100%-2rem)]">
            {value || 'Not Provided'}
          </span>
          {copyable && (
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="ml-1.5 text-[#007AFF] dark:text-[#0A84FF] hover:text-[#0071E3] dark:hover:text-[#0071E3] transition-colors p-1.5 rounded-full hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/20"
              aria-label={`Copy ${label}`}
            >
              {copied ? (
                <Check size={12} className="text-[#34C759] dark:text-[#30D158]" />
              ) : (
                <Copy size={12} />
              )}
            </motion.button>
          )}
        </div>
        
        {hasInfo && showInfo && infoContent && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-2 p-2 text-[11px] bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-md text-[#6C6C70] dark:text-[#AEAEB2]"
          >
            {infoContent}
          </motion.div>
        )}
      </div>
    </div>
  );
};
