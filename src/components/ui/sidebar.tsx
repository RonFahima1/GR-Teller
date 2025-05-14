// src/components/ui/sidebar.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft, ChevronDown, ChevronRight, BarChart2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Home, Send, RefreshCw, Users, DollarSign, List, CreditCard, Settings, Building2, Coins, UserCog, Shield, Cog } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import LoadingOverlay from '@/components/ui/LoadingOverlay'
import { useCurrentUser, canViewReports, canApproveKYC } from '@/context/CurrentUserContext'
import { Logo } from "@/components/ui/logo"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "20rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "4rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

const settingsLinks = [
  { href: "/settings/branches", label: "Branch Management" },
  { href: "/settings/currencies", label: "Currency & Rate Management" },
];

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home, iconSize: 18 },
  { href: "/send-money", label: "Send Money", icon: Send, iconSize: 18 },
  { href: "/currency-exchange", label: "Currency Exchange", icon: RefreshCw, iconSize: 18 },
  { href: "/client-balance", label: "Client Balance", icon: Users, iconSize: 18 },
  { href: "/cash-register", label: "Cash Register", icon: DollarSign, iconSize: 18 },
  { href: "/transactions", label: "Transactions", icon: List, iconSize: 18 },
  { href: "/payout", label: "Payout", icon: CreditCard, iconSize: 18 },
  { href: "/settings", label: "Settings", icon: Settings, iconSize: 18 },
  { href: "/admin", label: "Administration", icon: Cog, iconSize: 18 }, // Always visible!
];

const mockUser = {
  name: 'Alex Morgan',
  avatar: '', // You can use a placeholder or real avatar URL
};

// Add SidebarProvider implementation
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [navLoading, setNavLoading] = React.useState(false);
    const [expandedMenus, setExpandedMenus] = React.useState<{ [label: string]: boolean }>({});
    const user = useCurrentUser();

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {navLoading && <LoadingOverlay />}
            {/* Top Bar for Mobile */}
            {isMobile && (
              <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border-b border-white/30 dark:border-white/10 shadow-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={toggleSidebar}
                  aria-label="Open sidebar"
                >
                  <PanelLeft className="h-5 w-5" />
                </Button>
                <span className="text-xl font-bold text-blue-600 tracking-tight">GR</span>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    {mockUser.avatar ? (
                      <img src={mockUser.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      mockUser.name[0]
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Sidebar UI */}
            <aside
              className={cn(
                "fixed z-30 top-0 left-0 h-full bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-xl border-r border-white/30 dark:border-white/10 shadow-2xl transition-all duration-300 rounded-r-2xl",
                "flex flex-col items-center py-4 gap-4",
                "w-20 md:w-80",
                open ? "md:w-80" : "md:w-20",
                isMobile && !openMobile && "-translate-x-full",
                isMobile && openMobile && "translate-x-0",
                "md:translate-x-0"
              )}
              style={{ width: open ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON }}
              data-state={state}
            >
              {/* Logo or App Name (hidden on mobile) */}
              <div className="mb-4 flex items-center justify-center w-full md:block hidden">
                <Logo className="hover:scale-105" />
              </div>
              {/* Navigation Links */}
              <nav className="flex flex-col gap-3 w-full px-4 mt-4 md:mt-0">
                {navLinks.slice(0, 7).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-all duration-150 group relative",
                      open ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {open && <span className="ml-3 text-lg">{item.label}</span>}
                  </Link>
                ))}
                {/* Section separator */}
                <div className="my-3 border-t border-gray-200 dark:border-gray-700 w-full" />
                {/* Settings & Administration */}
                {navLinks.slice(7).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-4 py-3 font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition-all duration-150 group relative",
                      open ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {open && <span className="ml-3 text-lg">{item.label}</span>}
                  </Link>
                ))}
              </nav>
              {/* User Avatar/Profile (desktop only) */}
              <div className="mt-auto w-full flex flex-col items-center gap-2 pb-4 md:block hidden">
                <div className="flex flex-col items-center gap-1 mb-2">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    {mockUser.avatar ? (
                      <img src={mockUser.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      mockUser.name[0]
                    )}
                  </div>
                  {open && <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{mockUser.name}</span>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                >
                  <PanelLeft className="h-5 w-5" />
                </Button>
              </div>
              {/* Sidebar Toggle Button (mobile only) */}
              {isMobile && (
                <div className="mt-auto w-full flex justify-center pb-4 md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                  >
                    <PanelLeft className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </aside>
            {/* Main content (children) */}
            <div className={cn("flex-1 transition-all duration-300", isMobile ? "pt-14" : "ml-16 md:ml-64")}> {/* Add top padding for mobile top bar */}
              {children}
            </div>
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

export {
  SidebarProvider,
  useSidebar
}
