/**
 * Notification Service
 * Handles fetching, creating, and managing notifications
 */

import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus,
  NotificationFilters
} from '@/types/notification.types';

// Mock data for notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'transaction',
    title: 'Transaction Completed',
    message: 'Transfer of $1,200 to John Smith has been completed successfully.',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    status: 'unread',
    priority: 'medium',
    actionUrl: '/transactions/tx-123456',
    actionLabel: 'View Transaction',
    metadata: {
      transactionId: 'tx-123456',
      amount: 1200,
      currency: 'USD',
      recipient: 'John Smith'
    },
    icon: 'check-circle'
  },
  {
    id: '2',
    type: 'client',
    title: 'New Client Registration',
    message: 'Sarah Johnson has registered as a new client.',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    status: 'unread',
    priority: 'medium',
    actionUrl: '/clients/cl-789012',
    actionLabel: 'View Client',
    metadata: {
      clientId: 'cl-789012',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com'
    },
    icon: 'user-plus'
  },
  {
    id: '3',
    type: 'system',
    title: 'System Maintenance',
    message: 'The system will undergo maintenance on May 15, 2025 from 2:00 AM to 4:00 AM UTC.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    status: 'read',
    priority: 'high',
    icon: 'alert-triangle'
  },
  {
    id: '4',
    type: 'exchange',
    title: 'Exchange Rate Alert',
    message: 'USD/EUR exchange rate has changed by more than 2% in the last 24 hours.',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    status: 'read',
    priority: 'medium',
    actionUrl: '/exchange',
    actionLabel: 'View Rates',
    metadata: {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      oldRate: 0.92,
      newRate: 0.89,
      percentChange: -3.26
    },
    icon: 'trending-down'
  },
  {
    id: '5',
    type: 'security',
    title: 'New Device Login',
    message: 'Your account was accessed from a new device in London, UK.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    status: 'read',
    priority: 'high',
    actionUrl: '/settings/security',
    actionLabel: 'Review Activity',
    metadata: {
      location: 'London, UK',
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows'
    },
    icon: 'shield'
  },
  {
    id: '6',
    type: 'transaction',
    title: 'Transaction Pending',
    message: 'Transfer of $500 to Maria Garcia is awaiting approval.',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    status: 'read',
    priority: 'low',
    actionUrl: '/transactions/tx-654321',
    actionLabel: 'Review Transaction',
    metadata: {
      transactionId: 'tx-654321',
      amount: 500,
      currency: 'USD',
      recipient: 'Maria Garcia'
    },
    icon: 'clock'
  },
  {
    id: '7',
    type: 'alert',
    title: 'Compliance Alert',
    message: 'Please update your identification documents before June 1, 2025.',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    status: 'read',
    priority: 'high',
    actionUrl: '/settings/documents',
    actionLabel: 'Update Documents',
    icon: 'file-text'
  }
];

// Local storage keys
const NOTIFICATION_STORAGE_KEY = 'grt_notifications';
const NOTIFICATION_PREFERENCES_KEY = 'grt_notification_preferences';

/**
 * Get all notifications with optional filtering
 */
export async function getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
  // In a real app, this would be an API call
  // For now, we'll use local storage with mock data fallback
  
  let notifications: Notification[] = [];
  
  try {
    const storedNotifications = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    
    if (storedNotifications) {
      notifications = JSON.parse(storedNotifications);
    } else {
      // Use mock data for initial load
      notifications = MOCK_NOTIFICATIONS;
      // Save to local storage
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    }
    
    // Apply filters if provided
    if (filters) {
      return filterNotifications(notifications, filters);
    }
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return MOCK_NOTIFICATIONS;
  }
}

/**
 * Add a new notification
 */
export async function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'status'>): Promise<Notification> {
  try {
    const notifications = await getNotifications();
    
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: Date.now(),
      status: 'unread'
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
    
    return newNotification;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id: string): Promise<void> {
  try {
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'read' as NotificationStatus } 
        : notification
    );
    
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
  try {
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      status: 'read' as NotificationStatus
    }));
    
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  try {
    const notifications = await getNotifications();
    
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const notifications = await getNotifications();
    return notifications.filter(notification => notification.status === 'unread').length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Filter notifications based on criteria
 */
function filterNotifications(notifications: Notification[], filters: NotificationFilters): Notification[] {
  return notifications.filter(notification => {
    // Filter by type
    if (filters.type && notification.type !== filters.type) {
      return false;
    }
    
    // Filter by status
    if (filters.status && notification.status !== filters.status) {
      return false;
    }
    
    // Filter by priority
    if (filters.priority && notification.priority !== filters.priority) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const notificationDate = new Date(notification.timestamp);
      
      if (filters.dateRange.from && notificationDate < filters.dateRange.from) {
        return false;
      }
      
      if (filters.dateRange.to && notificationDate > filters.dateRange.to) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Group notifications by date
 */
export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};
  
  notifications.forEach(notification => {
    const date = new Date(notification.timestamp);
    const dateString = date.toDateString();
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(notification);
  });
  
  return groups;
}

/**
 * Format notification date for display
 */
export function formatNotificationDate(timestamp: number): string {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  
  // Format as date for older notifications
  return notificationDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
