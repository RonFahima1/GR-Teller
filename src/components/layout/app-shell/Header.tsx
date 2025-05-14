'use client';

import { useTheme } from "next-themes";
import { Sun, Moon, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { CommandPalette } from "@/components/commands/CommandPalette";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  sidebarWidth: number;
  onMobileMenuClick: () => void;
}

export function Header({ sidebarWidth, onMobileMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const { direction } = useLanguage();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background border-b border-border transition-all duration-300",
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
      <div className="flex h-[70px] items-center justify-between gap-6 px-4 lg:px-6 w-full">
        <div className="flex items-center gap-4 flex-1">
          <div className="lg:hidden">
            <Logo 
              size={32} 
              isIcon={true} 
              showText={false} 
              className="hover:scale-105" 
              onClick={onMobileMenuClick}
            />
          </div>
          <div className="flex-1 w-full max-w-[800px]">
            <CommandPalette />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <NotificationCenter />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-[40px] w-[40px] transition-all duration-300 ease-ios active:scale-95"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-[40px] w-[40px] rounded-xl"
              >
                <Avatar className="h-[40px] w-[40px] rounded-xl">
                  <AvatarImage src="/images/avatar.svg" alt="Avatar" className="rounded-xl" />
                  <AvatarFallback className="bg-primary/10 text-primary rounded-xl text-[15px]">GR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="w-[240px] rounded-xl">
              <DropdownMenuItem className="rounded-lg h-[40px] text-[15px] transition-colors duration-200 ease-ios hover:bg-primary/5 dark:hover:bg-primary/10 focus:bg-primary/10 dark:focus:bg-primary/20">
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className={cn(
                    "h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110",
                    direction === "rtl" ? "ml-3" : "mr-3"
                  )} />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 dark:text-red-400 rounded-lg h-[40px] text-[15px] transition-colors duration-200 ease-ios hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-100 dark:focus:bg-red-950/30">
                <button 
                  onClick={logout}
                  className="flex items-center w-full"
                >
                  <LogOut className={cn(
                    "h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110",
                    direction === "rtl" ? "ml-3" : "mr-3"
                  )} />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
