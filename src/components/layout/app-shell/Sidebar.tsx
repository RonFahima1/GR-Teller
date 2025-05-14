'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { NavItem } from "./types";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface SidebarProps {
  navItems: NavItem[];
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMobile?: boolean;
  onMobileClose?: () => void;
}

// Constants
const SIDEBAR_EXPANDED = 300;
const SIDEBAR_COLLAPSED = 80;

export function Sidebar({
  navItems,
  isCollapsed,
  toggleCollapsed,
  isMobile = false,
  onMobileClose
}: SidebarProps) {
  const pathname = usePathname();
  const { direction } = useLanguage();
  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <aside
      className={cn(
        "ios-sidebar fixed inset-y-0 z-50 transition-all duration-300 flex flex-col",
        "bg-white/70 dark:bg-[#18181b]/80 backdrop-blur-2xl border-r border-white/30 dark:border-white/10 shadow-2xl rounded-r-3xl",
        isCollapsed ? `w-[${SIDEBAR_COLLAPSED}px]` : `w-[${SIDEBAR_EXPANDED}px]`,
        direction === "rtl" && "left-auto right-0",
        isMobile ? "block" : "lg:block hidden"
      )}
      style={{ width: sidebarWidth }}
    >
      <div className={cn(
        "flex items-center border-b border-border/30 transition-all duration-300",
        isCollapsed ? "h-[70px] px-3 justify-center" : "h-[80px] px-8 justify-start"
      )}>
        <div 
          className={cn("flex items-center gap-2 cursor-pointer", isCollapsed && "justify-center w-full")}
          onClick={toggleCollapsed}
        >
          <Logo 
            size={isCollapsed ? 32 : 40} 
            isIcon={isCollapsed} 
            showText={!isCollapsed} 
            className="hover:scale-105" 
          />
        </div>
      </div>
      <div className={cn("flex-1 overflow-y-auto transition-all duration-300", isCollapsed ? "py-4" : "py-8")}>
        <nav className={cn("flex flex-col gap-2", isCollapsed ? "px-2" : "px-4")}>
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const navLink = (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center transition-all duration-200 ease-ios relative font-semibold",
                    isCollapsed
                      ? "justify-center rounded-2xl p-0 w-[56px] h-[56px] mx-auto hover:bg-blue-50/80 dark:hover:bg-blue-900/30"
                      : "gap-5 px-5 py-3 rounded-2xl text-gray-800 dark:text-gray-100 hover:bg-blue-50/80 dark:hover:bg-blue-900/30",
                    isActive && !isCollapsed && "bg-blue-100/70 dark:bg-blue-900/40 scale-105 shadow-md",
                    isActive && isCollapsed && "bg-blue-100/70 dark:bg-blue-900/40 scale-105 shadow-md"
                  )}
                  style={{ minHeight: 48 }}
                  onClick={(e) => {
                    if (isMobile && onMobileClose) {
                      e.preventDefault();
                      onMobileClose();
                      window.location.href = item.href;
                    }
                  }}
                  tabIndex={0}
                  aria-label={item.title}
                >
                  <item.icon className="h-7 w-7 drop-shadow mx-auto" />
                  {!isCollapsed && <span className="font-medium tracking-tight ml-3">{item.title}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className={cn(
                        "absolute left-0 top-2 bottom-2 w-2 bg-blue-500 rounded-r-xl shadow-lg",
                        isCollapsed ? "left-0 top-2 bottom-2 w-2" : "left-0 top-2 bottom-2 w-2"
                      )}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
              
              return isCollapsed ? (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.href} className="relative flex items-center">{navLink}</div>
              );
            })}
          </TooltipProvider>
        </nav>
      </div>
    </aside>
  );
}
