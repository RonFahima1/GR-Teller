'use client';

import React, { ReactNode } from 'react';

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
}

/**
 * InfoSection - A standardized section container for information display
 * Uses Apple HIG styling with clean typography and spacing
 */
export const InfoSection: React.FC<InfoSectionProps> = ({ 
  title, 
  children,
  className = '',
  collapsible = false
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className={`mb-5 last:mb-0 pb-5 border-b border-[#E5E5EA] dark:border-[#38383A] last:border-b-0 last:pb-0 ${className}`}>
      <div 
        className={`flex items-center justify-between mb-3 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={toggleCollapse}
      >
        <h4 className="text-[13px] font-semibold text-[#1C1C1E] dark:text-white uppercase tracking-wider">
          {title}
        </h4>
        {collapsible && (
          <button className="text-[#8E8E93] dark:text-[#98989D] p-1">
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            )}
          </button>
        )}
      </div>
      
      <div className={`space-y-2.5 ${isCollapsed ? 'hidden' : 'block'}`}>
        {children}
      </div>
    </div>
  );
};
