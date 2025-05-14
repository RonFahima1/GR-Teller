'use client';

import { createContext, useContext } from 'react';

export type UserRole = 'teller' | 'manager' | 'admin' | 'compliance';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

const mockCurrentUser: CurrentUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@globalremit.com',
  role: 'admin',
  permissions: [
    'manage_users',
    'manage_transactions',
    'manage_clients',
    'approve_kyc',
    'manage_compliance',
    'view_reports',
    'manage_settings'
  ]
};

// Permission utility functions
export function canManageUsers(user: CurrentUser): boolean {
  return user.role === 'admin' || user.permissions.includes('manage_users');
}

export function canManageTransactions(user: CurrentUser): boolean {
  return ['admin', 'manager', 'teller'].includes(user.role) || user.permissions.includes('manage_transactions');
}

export function canManageClients(user: CurrentUser): boolean {
  return ['admin', 'manager', 'teller'].includes(user.role) || user.permissions.includes('manage_clients');
}

export function canApproveKYC(user: CurrentUser): boolean {
  return ['admin', 'compliance'].includes(user.role) || user.permissions.includes('approve_kyc');
}

export function canManageCompliance(user: CurrentUser): boolean {
  return ['admin', 'compliance'].includes(user.role) || user.permissions.includes('manage_compliance');
}

export function canViewReports(user: CurrentUser): boolean {
  return ['admin', 'manager'].includes(user.role) || user.permissions.includes('view_reports');
}

export function canManageSettings(user: CurrentUser): boolean {
  return user.role === 'admin' || user.permissions.includes('manage_settings');
}

export const CurrentUserContext = createContext<CurrentUser>(mockCurrentUser);

export function useCurrentUser() {
  return useContext(CurrentUserContext);
}

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  // In a real app, fetch user from auth/session
  return (
    <CurrentUserContext.Provider value={mockCurrentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
} 