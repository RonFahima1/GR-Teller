'use client';

import React from 'react';
import { Plus, CreditCard, Smartphone } from 'lucide-react';
import { InfoSection } from '../shared/InfoSection';

interface ProductsSectionProps {
  products: {
    prepaidCard?: any | null;
    simCard?: any | null;
  };
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
  return (
    <InfoSection title="Products">
      <div className="space-y-4">
        {/* Prepaid Card Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <CreditCard className="text-[#007AFF] dark:text-[#0A84FF]" size={20} />
            <span className="text-[15px] text-[#1C1C1E] dark:text-white font-medium">
              Prepaid Card
            </span>
          </div>
          <button 
            className="flex items-center text-[14px] text-[#007AFF] dark:text-[#0A84FF] font-medium hover:opacity-80 transition-opacity"
            onClick={() => console.log('Add card')}
          >
            <Plus size={16} className="mr-1" />
            Add Card
          </button>
        </div>
        
        {/* SIM Card Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Smartphone className="text-[#007AFF] dark:text-[#0A84FF]" size={20} />
            <span className="text-[15px] text-[#1C1C1E] dark:text-white font-medium">
              SIM Card
            </span>
          </div>
          <button 
            className="flex items-center text-[14px] text-[#007AFF] dark:text-[#0A84FF] font-medium hover:opacity-80 transition-opacity"
            onClick={() => console.log('Add SIM')}
          >
            <Plus size={16} className="mr-1" />
            Add SIM
          </button>
        </div>
        
        {/* Separator */}
        <div className="border-t border-[#E5E5EA] dark:border-[#38383A] my-2 pt-2" />
      </div>
    </InfoSection>
  );
};
