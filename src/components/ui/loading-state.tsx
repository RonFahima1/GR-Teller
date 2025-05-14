"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
  fullScreen?: boolean
  message?: string
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8"
}

const variantClasses = {
  default: "border-gray-300 dark:border-gray-600",
  primary: "border-primary",
  secondary: "border-secondary"
}

export function LoadingState({
  className,
  size = "md",
  variant = "default",
  fullScreen = false,
  message = "Loading..."
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          {content}
        </div>
      </div>
    )
  }

  return content
}

interface LoadingSkeletonProps {
  rows?: number
  className?: string
}

export function LoadingSkeleton({ rows = 3, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

interface LoadingCardProps {
  rows?: number
}

export function LoadingCard({ rows = 3 }: LoadingCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="h-8 w-1/3 mb-6" />
      <LoadingSkeleton rows={rows} />
    </div>
  )
} 