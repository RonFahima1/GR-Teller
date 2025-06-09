'use client';

import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  label: string;
  size?: 'sm' | 'md';
}

/**
 * Badge component following Apple HIG guidelines
 * Used to display status indicators throughout the app
 */
export const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  label,
  size = 'sm'
}) => {
  const variants = {
    success: 'bg-[#34C759]/10 dark:bg-[#30D158]/20 text-[#34C759] dark:text-[#30D158] border-[#34C759]/20 dark:border-[#30D158]/30',
    warning: 'bg-[#FF9500]/10 dark:bg-[#FF9F0A]/20 text-[#FF9500] dark:text-[#FF9F0A] border-[#FF9500]/20 dark:border-[#FF9F0A]/30',
    error: 'bg-[#FF3B30]/10 dark:bg-[#FF453A]/20 text-[#FF3B30] dark:text-[#FF453A] border-[#FF3B30]/20 dark:border-[#FF453A]/30',
    info: 'bg-[#007AFF]/10 dark:bg-[#0A84FF]/20 text-[#007AFF] dark:text-[#0A84FF] border-[#007AFF]/20 dark:border-[#0A84FF]/30',
    default: 'bg-[#8E8E93]/10 dark:bg-[#8E8E93]/20 text-[#8E8E93] dark:text-[#AEAEB2] border-[#8E8E93]/20 dark:border-[#8E8E93]/30',
  };
  
  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-[11px] px-2 py-0.5',
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      font-semibold rounded-full
      border
      ${variants[variant]}
      ${sizes[size]}
    `} role="status">
      {label}
    </span>
  );
};
