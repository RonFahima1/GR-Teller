'use client';

import { transactionTypes } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function TransactionNav() {
  const [navLoading, setNavLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    setNavLoading(true);
    router.push(href);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {transactionTypes.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => handleNavigation(href)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                  : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/10"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      {navLoading && <LoadingOverlay />}
    </>
  );
} 