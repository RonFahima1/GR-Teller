'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './LanguageProvider';
import { AuthProvider } from '@/context/AuthContext';
import { CurrentUserProvider } from '@/context/CurrentUserContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <LanguageProvider children={
        <AuthProvider children={
          <CurrentUserProvider children={
            <NotificationProvider children={
              <>
                {children}
                <Toaster />
                <SonnerToaster position="top-right" />
              </>
            } />
          } />
        } />
      } />
    </ThemeProvider>
  );
}