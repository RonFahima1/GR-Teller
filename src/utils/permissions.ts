import { CurrentUser } from '@/context/CurrentUserContext';

export function isAdmin(user: CurrentUser) {
  return user.role === 'admin';
}

export function isManager(user: CurrentUser) {
  return user.role === 'manager';
}

export function isCompliance(user: CurrentUser) {
  return user.role === 'compliance';
}

export function canManageUsers(user: CurrentUser) {
  return user.role === 'admin';
}

export function canApproveKYC(user: CurrentUser) {
  return user.role === 'compliance' || user.role === 'admin';
}

export function canEditComplianceFlags(user: CurrentUser) {
  return user.role === 'manager' || user.role === 'admin';
}

export function isTeller(user: CurrentUser) {
  return user.role === 'teller';
} 