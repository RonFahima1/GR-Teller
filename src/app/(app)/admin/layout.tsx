'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Building,
  Users,
  DollarSign,
  Globe,
  PanelLeft,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';

// Main navigation structure with five major sections
const adminNavigation = [
  { 
    title: 'Organization Settings', 
    path: '/admin/organization-settings', 
    icon: Building,
  },
  { 
    title: 'Users & Roles', 
    path: '/admin/users', 
    icon: Users,
  },
  { 
    title: 'Exchange Rates', 
    path: '/admin/exchange-rates', 
    icon: DollarSign,
  },
  { 
    title: 'Operator', 
    path: '/admin/operator', 
    icon: Globe,
  },
  { 
    title: 'Product Config', 
    path: '/admin/product', 
    icon: PanelLeft,
  },
];

// Helper to check if a route is active
function isActive(pathname: string, path: string): boolean {
  if (path.includes('?')) {
    const [basePath] = path.split('?');
    return pathname === basePath || pathname.startsWith(`${basePath}/`);
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeSection = adminNavigation.find(item => isActive(pathname, item.path));
  
  return (
    <div className="bg-white min-h-screen pb-12">
      {/* Top navigation bar inspired by Apple Design Guidelines */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 lg:px-8 shadow-sm">
        <div className="flex h-14 items-center justify-between">
          {/* Back button to main app */}
          <Link href="/" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to App</span>
          </Link>
          
          {/* Admin section title */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-base font-medium">
              {activeSection?.title || 'Administration'}
            </h1>
          </div>
          
          {/* Optional right side actions */}
          <div></div>
        </div>
      </div>
      
      {/* Clean horizontal navigation */}
      <div className="sticky top-14 z-10 bg-white border-b border-gray-100 overflow-x-auto shadow-sm">
        <div className="flex px-4 lg:px-8 space-x-1 min-w-max py-2">
          {adminNavigation.map((item) => {
            const active = isActive(pathname, item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 text-sm rounded-full transition-all flex items-center gap-2 whitespace-nowrap
                  ${active 
                    ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-700'}`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Main content area with proper spacing */}
      <div className="pt-8 px-4 lg:px-8">
        {children}
      </div>
    </div>
  );
}
