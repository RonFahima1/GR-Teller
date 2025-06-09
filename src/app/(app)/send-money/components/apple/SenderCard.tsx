import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, User } from 'lucide-react';
import { Client } from '../../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';

interface SenderCardProps {
  client: Client;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onViewHistory?: (id: string) => void;
  onViewDetails: (client: Client) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigateToProfile?: (id: string) => void;
}

/**
 * SenderCard component represents a client/sender in the Send Money flow
 * Following Apple's Human Interface Guidelines for cards and lists
 * Designed with careful attention to typography, spacing, and interaction states
 */
export const SenderCard: React.FC<SenderCardProps> = ({
  client,
  isSelected,
  isHovered,
  onSelect,
  onViewHistory,
  onViewDetails,
  onMouseEnter,
  onMouseLeave,
  onNavigateToProfile,
}) => {
  // Format full name
  const formatFullName = () => {
    return `${client.firstName} ${client.lastName}`;
  };
  
  // Format ID
  const formatId = () => {
    return `${client.idType || 'ID'}: ${client.idNumber}`;
  };
  
  // Generate initials for avatar
  const getInitials = () => {
    const first = client.firstName ? client.firstName.charAt(0) : '';
    const last = client.lastName ? client.lastName.charAt(0) : '';
    return (first + last).toUpperCase();
  };

  // Track clicks for single vs double click handling
  const [clickCount, setClickCount] = useState<number>(0);
  const [singleClickTimer, setSingleClickTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle click events - support single and double click patterns
  const handleCardClick = (e: React.MouseEvent) => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    // Clear any existing click timer
    if (singleClickTimer) {
      clearTimeout(singleClickTimer);
      setSingleClickTimer(null);
    }
    
    // Handle based on click count
    if (newClickCount === 1) {
      // Single click - wait briefly to see if it becomes a double click
      const timer = setTimeout(() => {
        setClickCount(0);
        onSelect(); // Just select on single click
      }, 300); // 300ms is standard double-click threshold
      setSingleClickTimer(timer);
    } else if (newClickCount === 2) {
      // Double click - navigate to full profile
      setClickCount(0);
      if (onNavigateToProfile) {
        // Provide haptic feedback for double click
        if (navigator && 'vibrate' in navigator && navigator.vibrate) {
          navigator.vibrate(50);
        }
        onNavigateToProfile(client.id);
      } else {
        // Fallback to single-click behavior
        onSelect();
        if (isSelected) {
          onViewDetails(client);
        }
      }
    }
  };
  
  // Map risk rating to color
  const getRiskRatingColor = () => {
    switch(client.riskRating?.toLowerCase()) {
      case 'high': return 'bg-[#FF453A] dark:bg-[#FF453A]'; // SF Red
      case 'medium': return 'bg-[#FF9F0A] dark:bg-[#FF9F0A]'; // SF Orange
      default: return 'bg-[#30D158] dark:bg-[#30D158]'; // SF Green
    }
  };
  
  // iOS system font implementation with Tailwind
  const systemFont = 'font-sans text-[#000000] dark:text-white antialiased';

  return (
    <motion.div 
      className={cn(
        // Card base styling with proper contrast against background
        "rounded-xl h-full w-full", 
        
        // Pure white background to contrast with gray container
        isSelected 
          ? "bg-white dark:bg-[#2C2C2E] ring-2 ring-[#007AFF] dark:ring-[#0A84FF]" 
          : "bg-white dark:bg-[#2C2C2E]",
          
        // Enhanced shadows for better visual separation
        "shadow-[0_2px_6px_rgba(0,0,0,0.05),_0_0.5px_1px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.3)]",
          
        "transition-all duration-150"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col h-full p-4 relative">
        {/* Selection indicator - subtle checkmark */}
        {isSelected && (
          <div className="absolute top-3.5 right-3.5">
            <Check className="h-[18px] w-[18px] text-[#007AFF] dark:text-[#0A84FF]" />
          </div>
        )}
        
        {/* Full name - primary information with more space */}
        <h3 className={cn(
          "text-base font-medium mb-3 w-full overflow-hidden whitespace-nowrap pr-7",
          isSelected 
            ? "text-[#007AFF] dark:text-[#0A84FF]" 
            : "text-[#1C1C1E] dark:text-white"
        )}>
          {formatFullName()}
        </h3>
        
        {/* Phone number - second row */}
        <p className={cn(
          "text-[15px] font-normal mb-2.5 w-full overflow-hidden whitespace-nowrap",
          "text-[#3A3A3C] dark:text-[#E5E5EA]"
        )}>
          {client.phone}
        </p>
        
        {/* ID number - third row */}
        <p className={cn(
          "text-sm w-full overflow-hidden whitespace-nowrap",
          "text-[#6C6C70] dark:text-[#98989D]"
        )}>
          {formatId()}
        </p>
        
        {/* Subtle bottom separator - no status indicator */}
        <div className="mt-auto pt-3 opacity-50">
          <div className="border-t border-[#E5E5EA] dark:border-[#38383A]"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default SenderCard;
