"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { LoadingState } from '@/components/ui/loading-state';
import { CustomSidebarProvider } from '@/components/providers/SidebarProvider';
import { SearchProvider } from '@/components/providers/SearchProvider';
import { useLoadingTransition } from '@/hooks/useLoadingTransition';

export default function AppAreaLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const showLoading = useLoadingTransition(loading);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (showLoading) {
    return <LoadingState fullScreen message="Loading..." />;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <CustomSidebarProvider>
      <SearchProvider>
        <AppLayout>{children}</AppLayout>
      </SearchProvider>
    </CustomSidebarProvider>
  );
}

