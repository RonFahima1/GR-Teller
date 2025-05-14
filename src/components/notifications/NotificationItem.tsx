"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Shield, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingDown,
  FileText,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import { Notification } from "@/types/notification.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead, removeNotification, formatDate } = useNotifications();
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  // Handle notification click
  const handleClick = async () => {
    if (notification.status === "unread") {
      await markAsRead(notification.id);
    }
    setIsExpanded(!isExpanded);
  };

  // Handle action click
  const handleActionClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (notification.status === "unread") {
      await markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  // Handle remove click
  const handleRemoveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await removeNotification(notification.id);
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "transaction":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "client":
        return <User className="h-5 w-5 text-green-500" />;
      case "system":
        return <Info className="h-5 w-5 text-purple-500" />;
      case "security":
        return <Shield className="h-5 w-5 text-red-500" />;
      case "exchange":
        return <TrendingDown className="h-5 w-5 text-orange-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get priority indicator color
  const getPriorityColor = () => {
    switch (notification.priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div
      className={cn(
        "px-4 py-3 cursor-pointer transition-colors duration-200",
        notification.status === "unread"
          ? "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        <div className={cn("w-1 h-full self-stretch rounded-full", getPriorityColor())} />
        
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {notification.icon ? getIcon() : getIcon()}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "text-sm font-medium line-clamp-1",
              notification.status === "unread" ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
            )}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
              {formatDate(notification.timestamp)}
            </span>
          </div>
          
          <p className={cn(
            "text-xs mt-1",
            notification.status === "unread" ? "text-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400",
            isExpanded ? "" : "line-clamp-2"
          )}>
            {notification.message}
          </p>
          
          {/* Action button */}
          {notification.actionLabel && notification.actionUrl && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                onClick={handleActionClick}
              >
                {notification.actionLabel}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
          
          {/* Metadata (expanded view) */}
          {isExpanded && notification.metadata && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
            >
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                    <span>{typeof value === 'object' ? JSON.stringify(value) : value.toString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
