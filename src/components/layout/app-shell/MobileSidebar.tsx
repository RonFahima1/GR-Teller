'use client';

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import { NavItem } from "./types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MobileSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: NavItem[];
}

export function MobileSidebar({ isOpen, onOpenChange, navItems }: MobileSidebarProps) {
  const { direction } = useLanguage();
  const pathname = usePathname();
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side={direction === "rtl" ? "right" : "left"} 
        className="w-[280px] p-0 rounded-r-2xl transition-transform duration-300 ease-ios"
      >
        <div className="h-full ios-blur rounded-r-2xl">
          <div className="flex h-[70px] items-center px-6 border-b">
            <Logo className="hover:scale-105" onClick={() => onOpenChange(false)} />
          </div>
          <div className="py-6">
            <nav className="space-y-2 px-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <div key={item.href} className="relative flex items-center">
                    {isActive && (
                      <motion.div
                        layoutId="mobile-sidebar-indicator"
                        className="absolute left-0 h-6 w-1 bg-blue-500 rounded-r"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      className={cn(
                        "ios-nav-link group flex items-center gap-3 px-4 relative transition-all duration-200 ease-ios",
                        isActive && "scale-110"
                      )}
                      onClick={e => {
                        e.preventDefault();
                        onOpenChange(false);
                        window.location.href = item.href;
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-[15px] font-medium">{item.title}</span>
                      <span className="ml-auto opacity-0 transition-all duration-200 ease-ios group-hover:opacity-100 group-hover:translate-x-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
