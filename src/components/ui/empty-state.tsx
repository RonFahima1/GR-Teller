"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/50",
        className
      )}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800"
        >
          {icon}
        </motion.div>
      )}
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
} 