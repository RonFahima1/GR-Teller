import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AppleSendMoneyLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  pageHeader?: React.ReactNode;
  pageFooter?: React.ReactNode;
  sideContent?: React.ReactNode;
  isFullWidth?: boolean;
  className?: string;
}

/**
 * A layout component for the Send Money flow following Apple Human Interface Guidelines
 * This component handles the overall page structure, spacing, and responsive behavior
 */
const AppleSendMoneyLayout: React.FC<AppleSendMoneyLayoutProps> = ({
  children,
  title,
  subtitle,
  pageHeader,
  pageFooter,
  sideContent,
  isFullWidth = false,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex flex-col bg-gradient-to-b from-[#F9F9F9] to-[#F2F2F7] dark:from-[#1C1C1E] dark:to-[#121214] py-5 px-0"
    >
      {/* Page Title */}
      {(title || subtitle) && (
        <div className="px-6 pb-4">
          {title && (
            <h1 className="text-2xl font-semibold text-[#1C1C1E] dark:text-white">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[#8E8E93] dark:text-[#98989D] mt-1 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Page Header (Search bar, etc) */}
      {pageHeader && (
        <div className="mb-5">
          {pageHeader}
        </div>
      )}

      {/* Main content with optional sidebar */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden rounded-xl bg-white dark:bg-[#1C1C1E] shadow-md mx-4 lg:mx-6 border border-[#E5E5EA] dark:border-[#38383A]">
        {/* Side content / sidebar - visible on large screens */}
        {sideContent && (
          <div className="hidden lg:block w-64 lg:w-72 xl:w-80 flex-shrink-0 border-r border-[#E5E5EA] dark:border-[#38383A]">
            {sideContent}
          </div>
        )}

        {/* Main content area with proper padding */}
        <div className={cn(
          "flex-grow p-4 overflow-y-auto",
          className
        )}>
          {/* Main content - no duplicate sidebar */}
          {children}
        </div>
      </div>

      {/* Page footer if provided */}
      {pageFooter && (
        <div className="mt-5 w-full border rounded-xl border-[#E5E5EA] dark:border-[#38383A] bg-white dark:bg-[#1C1C1E] mx-4 lg:mx-6 shadow-sm">
          {pageFooter}
        </div>
      )}
    </motion.div>
  );
};

export default AppleSendMoneyLayout;
