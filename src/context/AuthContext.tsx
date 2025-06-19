'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn, signOut, useSession } from 'next-auth/react';

// Define the shape of the context data
interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false);
    }
  }, [status]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Wait a moment for the session to update, then redirect based on onboarding status and role
      setTimeout(() => {
        const onboardingStatus = (session?.user as any)?.onboardingStatus || 'PENDING';
        if (onboardingStatus !== 'COMPLETED') {
          router.push('/onboarding');
          toast('Please complete onboarding to access your dashboard.');
          return;
        }
        const userRole = session?.user?.role || 'ORG_USER';
        let dashboardUrl = '/dashboard';
        switch (userRole) {
          case 'ORG_ADMIN':
            dashboardUrl = '/admin';
            break;
          case 'AGENT_ADMIN':
            dashboardUrl = '/manager';
            break;
          case 'AGENT_USER':
            dashboardUrl = '/teller';
            break;
          case 'COMPLIANCE_USER':
            dashboardUrl = '/compliance';
            break;
          case 'ORG_USER':
          default:
            dashboardUrl = '/dashboard';
        }
        router.push(dashboardUrl);
      }, 100);

      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout');
    }
  };

  const value = {
    user: session?.user || null,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
