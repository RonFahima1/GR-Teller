/**
 * Notification Types for Global Remit Teller
 */

// Base notification type
export type NotificationType = 
  | "transaction" 
  | "client" 
  | "system" 
  | "security" 
  | "exchange"
  | "alert";

// Notification priority
export type NotificationPriority = "low" | "medium" | "high";

// Notification status
export type NotificationStatus = "unread" | "read" | "archived";

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  status: NotificationStatus;
  priority: NotificationPriority;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  icon?: string;
}

// Notification filter options
export interface NotificationFilters {
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

// Notification group by date
export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

// Notification preferences
export interface NotificationPreferences {
  enabledTypes: NotificationType[];
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
}
