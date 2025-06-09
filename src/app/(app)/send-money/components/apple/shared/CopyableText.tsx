'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CopyableTextProps {
  text: string;
  formatText?: boolean;
  className?: string;
}

/**
 * CopyableText - A component for displaying text with a copy button
 * Provides visual feedback when text is copied
 */
export const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  formatText = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  
  // Format text for display if needed (e.g., adding spaces to IBANs)
  const displayText = formatText 
    ? text.replace(/(.{4})/g, '$1 ').trim()
    : text;
  
  const handleCopy = async () => {
    try {
      // Copy original text without formatting
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-[15px] text-[#1C1C1E] dark:text-white truncate max-w-[calc(100%-2rem)]">
        {displayText || 'Not Provided'}
      </span>
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={handleCopy}
        className="ml-1.5 text-[#007AFF] dark:text-[#0A84FF] hover:text-[#0071E3] dark:hover:text-[#0071E3] transition-colors p-1.5 rounded-full hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/20"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check size={14} className="text-[#34C759] dark:text-[#30D158]" />
        ) : (
          <Copy size={14} />
        )}
      </motion.button>
    </div>
  );
};
