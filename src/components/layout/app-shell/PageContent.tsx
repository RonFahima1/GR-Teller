'use client';

import { ReactNode, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface PageContentProps {
  children: ReactNode;
  sidebarWidth: number;
  isLoading?: boolean;
  error?: string | null;
  showFallback?: boolean;
  onRetry?: () => void;
}

export function PageContent({
  children,
  sidebarWidth,
  isLoading = false,
  error = null,
  showFallback = false,
  onRetry
}: PageContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const contentRef = useRef<HTMLElement>(null);
  const { direction } = useLanguage();

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-300",
        direction === "rtl"
          ? `lg:pr-[${sidebarWidth}px] lg:pl-0 pr-0 pl-0`
          : `lg:pl-[${sidebarWidth}px] lg:pr-0 pl-0 pr-0`
      )}
      style={{
        transition: 'padding 0.3s cubic-bezier(0.4,0,0.2,1), margin 0.3s cubic-bezier(0.4,0,0.2,1)',
        ...(window.innerWidth >= 1024
          ? (direction === "rtl"
              ? { paddingRight: sidebarWidth, paddingLeft: 0 }
              : { paddingLeft: sidebarWidth, paddingRight: 0 })
          : { paddingLeft: 0, paddingRight: 0 })
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          ref={contentRef}
          key={pathname}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-[calc(100vh-70px)] py-4 lg:py-6 relative"
        >
          {isLoading && <LoadingOverlay />}
          
          {showFallback && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 gap-4">
              <div className="text-destructive text-lg font-medium">Content failed to load.</div>
              <Button onClick={onRetry}>Retry</Button>
            </div>
          )}
          
          {error && (
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="text-destructive text-lg font-medium">{error}</div>
                <Button 
                  variant="default" 
                  onClick={onRetry}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
          
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
