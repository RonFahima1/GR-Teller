"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NotificationSkeleton() {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        <Skeleton className="w-1 h-16 rounded-full" />
        
        {/* Icon */}
        <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          
          <div className="mt-2 space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          
          <div className="mt-2">
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
