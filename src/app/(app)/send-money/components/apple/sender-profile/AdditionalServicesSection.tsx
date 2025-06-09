'use client';

import React from 'react';
import { ChevronRight, FileText, Shield, CreditCard, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdditionalServicesProps {
  onShowDocuments?: () => void;
  onShowLimits?: () => void;
  onAddPrepaidCard?: () => void;
  onAddSimCard?: () => void;
}

export const AdditionalServicesSection: React.FC<AdditionalServicesProps> = ({
  onShowDocuments,
  onShowLimits,
  onAddPrepaidCard,
  onAddSimCard
}) => {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden mb-4">
      <h3 className="text-[16px] font-semibold px-4 py-3 border-b border-[#E5E5EA] dark:border-[#38383A] text-[#1C1C1E] dark:text-white">
        ADDITIONAL SERVICES
      </h3>
      
      <div className="grid grid-cols-1 divide-y divide-[#E5E5EA] dark:divide-[#38383A]">
        {/* Documents Section */}
        <div className="p-4">
          <h4 className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-2">Documents</h4>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onShowDocuments}
            className="flex items-center justify-between w-full py-2 text-[#007AFF] dark:text-[#0A84FF]"
          >
            <div className="flex items-center">
              <FileText size={18} className="mr-2" />
              <span className="text-[15px]">Show Documents</span>
            </div>
            <ChevronRight size={18} />
          </motion.button>
        </div>
        
        {/* Limits Section */}
        <div className="p-4">
          <h4 className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-2">Limits</h4>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onShowLimits}
            className="flex items-center justify-between w-full py-2 text-[#007AFF] dark:text-[#0A84FF]"
          >
            <div className="flex items-center">
              <Shield size={18} className="mr-2" />
              <span className="text-[15px]">Show Limits</span>
            </div>
            <ChevronRight size={18} />
          </motion.button>
        </div>
        
        {/* Products Section */}
        <div className="p-4">
          <h4 className="text-[13px] text-[#8E8E93] dark:text-[#98989D] mb-2">Products</h4>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onAddPrepaidCard}
            className="flex items-center w-full py-2 text-[#007AFF] dark:text-[#0A84FF]"
          >
            <div className="flex items-center">
              <CreditCard size={18} className="mr-2" />
              <span className="text-[15px]">+ Add Prepaid Card</span>
            </div>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onAddSimCard}
            className="flex items-center w-full py-2 text-[#007AFF] dark:text-[#0A84FF]"
          >
            <div className="flex items-center">
              <Smartphone size={18} className="mr-2" />
              <span className="text-[15px]">+ Add SIM Card</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
