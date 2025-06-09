'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IconButtonProps {
  icon: ReactNode;
  tooltip: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * IconButton - An icon-only button with tooltip on hover
 * Following Apple HIG guidelines for minimal, clean UI
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  variant = 'secondary',
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-full w-10 h-10 transition-all duration-150";
  
  const variants = {
    primary: "bg-[#007AFF] text-white hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#409CFF]",
    secondary: "bg-[#F2F2F7] text-[#1C1C1E] hover:bg-[#E5E5EA] dark:bg-[#2C2C2E] dark:text-white dark:hover:bg-[#3A3A3C]",
    tertiary: "bg-transparent text-[#8E8E93] hover:text-[#1C1C1E] dark:text-[#98989D] dark:hover:text-white",
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        group
        ${baseStyles}
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label={tooltip}
      title={tooltip}
    >
      {icon}
      
      {/* Tooltip */}
      <div className="
        absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-auto
        px-2 py-1 bg-[#1C1C1E] dark:bg-[#F2F2F7]
        text-white dark:text-[#1C1C1E] text-xs font-medium rounded-md
        opacity-0 group-hover:opacity-100 pointer-events-none
        transition-opacity duration-200 whitespace-nowrap z-10
      ">
        {tooltip}
        <div className="
          absolute -top-1 left-1/2 transform -translate-x-1/2 rotate-45
          w-2 h-2 bg-[#1C1C1E] dark:bg-[#F2F2F7]
        "></div>
      </div>
    </motion.button>
  );
};
