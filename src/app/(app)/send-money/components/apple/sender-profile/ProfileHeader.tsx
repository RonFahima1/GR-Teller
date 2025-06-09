'use client';

import React from 'react';
import { Eye, Edit, UserPlus, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../shared/Badge';
import { IconButton } from '../shared/IconButton';

interface Action {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

interface ProfileHeaderProps {
  fullName: string;
  status: string;
  actions: Action[];
  showActions?: boolean;
  onBack?: () => void;
}

/**
 * ProfileHeader - Clean, Apple HIG compliant header with icon buttons
 * Features a back pattern and action buttons with hover tooltips
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  fullName,
  status,
  actions,
  showActions = true,
  onBack,
}) => {
  return (
    <div className="relative z-10 bg-white dark:bg-[#1C1C1E] shadow-sm border-b border-[#E5E5EA] dark:border-[#38383A]">
      {/* Background pattern - adds visual interest behind the sender name */}
      <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent" />
        <div className="grid grid-cols-10 h-full w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border-r border-blue-500/20 h-full" />
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-3 relative z-10">
        <div className="flex items-center justify-between">
          {/* Left side - Name and back button */}
          <div className="flex items-center space-x-2">
            {onBack && (
              <IconButton 
                icon={<ArrowLeft size={18} />} 
                tooltip="Back"
                variant="tertiary"
                onClick={onBack}
              />
            )}
            <div>
              <h2 className="text-[17px] font-semibold text-[#1C1C1E] dark:text-white flex items-center gap-2">
                {fullName}
                <Badge variant={status === 'active' ? 'success' : 'warning'} label={status === 'active' ? 'Active' : 'Inactive'} />
              </h2>
            </div>
          </div>
          
          {/* Right side - Dynamic Action buttons */}
          {showActions && actions && actions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-2"
            >
              {actions.map((action, index) => (
                <IconButton 
                  key={`action-${index}`}
                  icon={action.icon} 
                  tooltip={action.tooltip}
                  variant={action.variant || 'secondary'}
                  onClick={action.onClick}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
