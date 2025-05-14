"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, Check, CheckCheck, Filter, Clock, Trash2, Settings } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNotifications } from "@/context/NotificationContext";
import { Notification, NotificationType, NotificationFilters } from "@/types/notification.types";
import { cn } from "@/lib/utils";
import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "./EmptyState";
import { NotificationSkeleton } from "./NotificationSkeleton";
import { NotificationFiltersPanel } from "./NotificationFiltersPanel";

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    clearAll,
    refreshNotifications,
    filters,
    setFilters,
    groupByDate
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [showFilters, setShowFilters] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "unread") {
      return notification.status === "unread";
    }
    return true;
  });

  // Group notifications by date
  const groupedNotifications = groupByDate(filteredNotifications);
  const groupDates = Object.keys(groupedNotifications).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  // Toggle notification panel
  const togglePanel = () => {
    if (!isOpen) {
      refreshNotifications();
    }
    setIsOpen(!isOpen);
    setShowFilters(false);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // Handle clear all notifications
  const handleClearAll = async () => {
    await clearAll();
  };

  // Apply filters
  const applyFilters = (newFilters: NotificationFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl h-[40px] w-[40px] transition-colors duration-200 ease-ios active:scale-95"
        onClick={togglePanel}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-semibold"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-[380px] max-h-[calc(100vh-120px)] bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleClearAll}
                  disabled={notifications.length === 0}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <NotificationFiltersPanel
                    currentFilters={filters}
                    onApplyFilters={applyFilters}
                    onClose={() => setShowFilters(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "all" | "unread")}
              className="w-full"
            >
              <TabsList className="w-full p-0 h-10 bg-transparent border-b border-gray-100 dark:border-gray-800">
                <TabsTrigger
                  value="all"
                  className={cn(
                    "flex-1 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "text-sm font-medium text-gray-500 dark:text-gray-400 data-[state=active]:text-primary dark:data-[state=active]:text-primary"
                  )}
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className={cn(
                    "flex-1 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "text-sm font-medium text-gray-500 dark:text-gray-400 data-[state=active]:text-primary dark:data-[state=active]:text-primary"
                  )}
                >
                  Unread
                  {unreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 px-1.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="m-0">
                <NotificationList
                  groupDates={groupDates}
                  groupedNotifications={groupedNotifications}
                  isLoading={isLoading}
                  error={error}
                />
              </TabsContent>

              <TabsContent value="unread" className="m-0">
                <NotificationList
                  groupDates={groupDates}
                  groupedNotifications={groupedNotifications}
                  isLoading={isLoading}
                  error={error}
                  emptyMessage="No unread notifications"
                />
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
                onClick={refreshNotifications}
              >
                <Clock className="h-3 w-3" aria-hidden="true" />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
                onClick={() => console.log("Settings clicked")}
              >
                <Settings className="h-3 w-3" aria-hidden="true" />
                Preferences
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface NotificationListProps {
  groupDates: string[];
  groupedNotifications: Record<string, Notification[]>;
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
}

function NotificationList({
  groupDates,
  groupedNotifications,
  isLoading,
  error,
  emptyMessage = "No notifications"
}: NotificationListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="overflow-y-auto max-h-[400px] p-4 space-y-4">
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="overflow-y-auto max-h-[400px] p-4">
        <EmptyState
          icon={<X className="h-8 w-8 text-red-500" aria-hidden="true" />}
          title="Error loading notifications"
          description={error}
        />
      </div>
    );
  }

  // Empty state
  if (groupDates.length === 0) {
    return (
      <div className="overflow-y-auto max-h-[400px] p-4">
        <EmptyState
          icon={<Bell className="h-8 w-8 text-gray-400" aria-hidden="true" />}
          title={emptyMessage}
          description="You're all caught up!"
        />
      </div>
    );
  }

  // Notification list
  return (
    <div className="overflow-y-auto max-h-[400px] py-2">
      {groupDates.map((date) => (
        <div key={date} className="mb-4">
          <div className="px-4 py-2 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {formatDateHeader(date)}
            </h3>
          </div>
          <div className="space-y-1">
            {groupedNotifications[date].map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to format date headers
function formatDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}