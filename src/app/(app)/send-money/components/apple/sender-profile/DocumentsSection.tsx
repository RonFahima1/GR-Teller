import React from 'react';
import { ChevronRight } from 'lucide-react';

export const DocumentsSection: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-xl shadow-sm border border-[#E5E5EA] dark:border-[#38383A]">
      <div className="px-4 py-3 border-b border-[#E5E5EA] dark:border-[#38383A]">
        <h3 className="text-base font-semibold text-[#1C1C1E] dark:text-white">
          Documents
        </h3>
      </div>

      <button 
        className="w-full p-4 flex justify-between items-center text-left"
        onClick={() => console.log('Show sender documents')}
      >
        <span className="text-sm font-medium text-[#007AFF] dark:text-[#0A84FF]">
          Show Sender Documents
        </span>
        <ChevronRight size={16} className="text-[#8E8E93] dark:text-[#98989D]" />
      </button>
    </div>
  );
};
