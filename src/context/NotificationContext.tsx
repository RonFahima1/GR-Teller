"use client";

import { createContext, useContext, useState, useCallback, useReducer, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus,
  NotificationFilters 
} from '@/types/notification.types';
import {
  getNotifications,
  addNotification as addNotificationService,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  formatNotificationDate,
  groupNotificationsByDate
} from '@/services/notificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filters: NotificationFilters;
}

type NotificationAction =
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "CLEAR_ALL" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FILTERS"; payload: NotificationFilters };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  filters: {}
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
      };
    case "SET_UNREAD_COUNT":
      return {
        ...state,
        unreadCount: action.payload,
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
        unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === action.payload)?.status === 'unread' ? 1 : 0),
      };
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, status: 'read' as NotificationStatus } : n
        ),
        unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === action.payload)?.status === 'unread' ? 1 : 0),
      };
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, status: 'read' as NotificationStatus })),
        unreadCount: 0,
      };
    case "CLEAR_ALL":
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  filters: NotificationFilters;
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    priority?: NotificationPriority,
    actionUrl?: string,
    actionLabel?: string,
    metadata?: Record<string, any>,
    icon?: string
  ) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  setFilters: (filters: NotificationFilters) => void;
  formatDate: (timestamp: number) => string;
  groupByDate: (notifications: Notification[]) => Record<string, Notification[]>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  
  // Load notifications on mount
  useEffect(() => {
    refreshNotifications();
    
    // Set up polling for new notifications every minute
    const intervalId = setInterval(() => {
      refreshNotifications();
    }, 60000); // 1 minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Refresh notifications when filters change
  useEffect(() => {
    refreshNotifications();
  }, [state.filters]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      
      const notifications = await getNotifications(state.filters);
      const unreadCount = notifications.filter(n => n.status === 'unread').length;
      
      dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
      dispatch({ type: "SET_UNREAD_COUNT", payload: unreadCount });
      dispatch({ type: "SET_ERROR", payload: null });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      dispatch({ type: "SET_ERROR", payload: 'Failed to load notifications' });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.filters]);

  // Add notification
  const addNotification = useCallback(
    async (
      type: NotificationType,
      title: string,
      message: string,
      priority: NotificationPriority = 'medium',
      actionUrl?: string,
      actionLabel?: string,
      metadata?: Record<string, any>,
      icon?: string
    ) => {
      try {
        const newNotification = await addNotificationService({
          type,
          title,
          message,
          priority,
          actionUrl,
          actionLabel,
          metadata,
          icon
        });
        
        dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
        
        // Show toast notification
        toast(message, {
          description: title,
          duration: 5000,
        });
        
        await refreshNotifications();
      } catch (error) {
        console.error('Error adding notification:', error);
        dispatch({ type: "SET_ERROR", payload: 'Failed to add notification' });
      }
    },
    [refreshNotifications]
  );

  // Remove notification
  const removeNotification = useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
      dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
    } catch (error) {
      console.error('Error removing notification:', error);
      dispatch({ type: "SET_ERROR", payload: 'Failed to remove notification' });
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await markAsRead(id);
      dispatch({ type: "MARK_AS_READ", payload: id });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      dispatch({ type: "SET_ERROR", payload: 'Failed to mark notification as read' });
    }
  }, []);

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      dispatch({ type: "MARK_ALL_AS_READ" });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      dispatch({ type: "SET_ERROR", payload: 'Failed to mark all notifications as read' });
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(async () => {
    try {
      await clearAllNotifications();
      dispatch({ type: "CLEAR_ALL" });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      dispatch({ type: "SET_ERROR", payload: 'Failed to clear notifications' });
    }
  }, []);
  
  // Set filters
  const setFilters = useCallback((filters: NotificationFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        isLoading: state.isLoading,
        error: state.error,
        filters: state.filters,
        addNotification,
        removeNotification,
        markAsRead: markNotificationAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        clearAll: clearAllNotifications,
        refreshNotifications,
        setFilters,
        formatDate: formatNotificationDate,
        groupByDate: groupNotificationsByDate
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export { useNotification as useNotifications }; 