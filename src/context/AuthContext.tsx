'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define our own User type since we're not using actual Firebase
interface User {
  id: string;
  email: string;
  name: string;
}

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database with proper types
const MOCK_USERS: Record<string, { uid: string; email: string; displayName: string; photoURL: string; password: string }> = {
  'demo@example.com': {
    uid: 'demo-user',
    email: 'demo@example.com',
    displayName: 'Demo User',
    photoURL: 'https://picsum.photos/32/32',
    password: 'demo',
  },
  'teller@globalremit.com': {
    uid: 'teller-user',
    email: 'teller@globalremit.com',
    displayName: 'Teller User',
    photoURL: 'https://picsum.photos/32/32?grayscale',
    password: 'password',
  },
};

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Validate against mock users
      const mockUser = MOCK_USERS[email];
      if (!mockUser || mockUser.password !== password) {
        throw new Error('Invalid credentials');
      }

      const userData = {
        id: mockUser.uid,
        email: mockUser.email,
        name: mockUser.displayName,
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      router.push('/dashboard');
      toast.success(`Welcome back, ${mockUser.displayName}!`);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
    toast.success('Logged out successfully');
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
  }), [user, loading]);

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
