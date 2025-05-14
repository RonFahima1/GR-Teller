"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, X, AlertCircle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { toast, ToastOptions } from "react-hot-toast";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const positions = {
  top: 'top-4',
  bottom: 'bottom-4'
};

const variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const styles = {
  success: "border-green-200 bg-green-50 text-green-600 dark:border-green-900 dark:bg-green-950 dark:text-green-400",
  error: "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400",
  info: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400",
};

export function Toast({
  open,
  onClose,
  title,
  description,
  type = 'info',
  duration = 5000,
  position = 'bottom'
}: ToastProps) {
  React.useEffect(() => {
    if (open && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            'fixed left-1/2 -translate-x-1/2 z-50',
            positions[position]
          )}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className={cn(
            'flex items-start gap-3 p-4 rounded-lg shadow-lg',
            styles[type],
            'border border-gray-200/50 dark:border-gray-700/50'
          )}>
            <div className="flex-shrink-0 pt-0.5">
              {icons[type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {title}
              </p>
              {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ToastClose({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

export function ToastDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {children}
    </p>
  );
}

export function ToastTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium text-gray-900 dark:text-white">
      {children}
    </p>
  );
}

export function ToastViewport({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-50 bottom-4">
      {children}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function showToast({ title, message, type = "info" }: { title: string; message?: string; type?: "success" | "error" | "info" | "warning"; }) {
  const Icon = icons[type];

  toast.custom(
    (t) => (
      <div
        className={cn(
          "flex w-full max-w-md items-center gap-3 rounded-lg border p-4 shadow-lg",
          styles[type],
          t.visible ? "animate-enter" : "animate-leave"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <div className="flex-1 space-y-1">
          <h3 className="font-medium">{title}</h3>
          {message && <p className="text-sm opacity-90">{message}</p>}
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: type === "error" ? 5000 : 3000,
    }
  );
}
