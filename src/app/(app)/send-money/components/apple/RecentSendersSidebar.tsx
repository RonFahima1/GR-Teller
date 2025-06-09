import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Client } from '../../hooks/useSendMoneyForm';
import { cn } from '@/lib/utils';

interface RecentSendersSidebarProps {
  recentSenders: Client[];
  onSelectSender: (client: Client) => void;
  selectedSenderId?: string;
}

export const RecentSendersSidebar: React.FC<RecentSendersSidebarProps> = ({
  recentSenders,
  onSelectSender,
  selectedSenderId,
}) => {
  // Skip rendering if no recent senders
  if (!recentSenders || recentSenders.length === 0) return null;
  
  // No longer using dynamic colors for avatars as they should all be gray by default
  // and only turn blue when selected
  
  return (
    <div className="h-full py-2 border-r border-[#E5E5EA] dark:border-[#38383A]">
      <div className="flex items-center text-sm font-medium text-[#8E8E93] dark:text-[#98989D] px-3 mb-3">
        <Clock className="h-3.5 w-3.5 mr-1.5" />
        Recent Senders
      </div>
      <div className="space-y-2 pr-2">
        {recentSenders.map((sender) => (
          <motion.div
            key={sender.id}
            className={cn(
              "px-3 py-2 rounded-xl cursor-pointer transition-all",
              "hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]",
              "hover:shadow-sm",
              selectedSenderId === sender.id ? 
                "bg-[#E5E5EA] dark:bg-[#3A3A3C] ring-1 ring-[#007AFF] dark:ring-[#0A84FF] shadow-sm" : 
                "",
            )}
            onClick={() => onSelectSender(sender)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0",
                  "shadow-sm border border-white dark:border-[#1C1C1E]",
                  selectedSenderId === sender.id ? 
                    "bg-[#007AFF] dark:bg-[#0A84FF] text-white" : 
                    "bg-[#E5E5EA] dark:bg-[#48484A] text-[#8E8E93] dark:text-[#98989D]"
                )}
              >
                {sender.firstName?.[0]}{sender.lastName?.[0]}
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-sm font-medium text-[#1C1C1E] dark:text-white truncate">
                  {sender.firstName} {sender.lastName}
                </div>
                <div className="text-xs text-[#8E8E93] dark:text-[#98989D] truncate">
                  {sender.phone}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default RecentSendersSidebar;
