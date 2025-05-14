'use client';

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PageContent } from "./PageContent";
import { MobileSidebar } from "./MobileSidebar";
import { ErrorBoundary } from "./ErrorBoundary";
import { NavItem } from "./types";
import { 
  Home, 
  Send, 
  ArrowLeftRight,
  Wallet,
  Calculator,
  History,
  Building2,
  BarChart2,
  ShieldCheck,
  Settings,
  Cog
} from "lucide-react";

// Constants
const SIDEBAR_COLLAPSE_KEY = "sidebar_collapsed";
const SIDEBAR_EXPANDED = 300;
const SIDEBAR_COLLAPSED = 80;

// Navigation items
const mainNav: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Send Money", href: "/send-money", icon: Send },
  { title: "Currency Exchange", href: "/exchange", icon: ArrowLeftRight },
  { title: "Client Balance", href: "/client-balance", icon: Wallet },
  { title: "Cash Register", href: "/cash-register", icon: Calculator },
  { title: "Transactions", href: "/transactions", icon: History },
  { title: "Payout", href: "/payout", icon: Building2 },
  { title: "Reports", href: "/reports", icon: BarChart2 },
  { title: "KYC / Compliance", href: "/kyc", icon: ShieldCheck },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Administration", href: "/admin", icon: Cog },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { direction } = useLanguage();
  
  // State
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [reloadAttempts, setReloadAttempts] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
    }
    return false;
  });

  // Refs
  const contentRef = useRef<HTMLElement>(null);
  const whiteScreenTimeoutRef = useRef<NodeJS.Timeout>();
  const lastPathnameRef = useRef(pathname);
  const errorCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const emptyPageTimeoutRef = useRef<NodeJS.Timeout>();
  const [previousChildren, setPreviousChildren] = useState<ReactNode>(children);

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  // Handle initial mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle page transitions and error detection
  useEffect(() => {
    // Clear any existing timeouts
    if (whiteScreenTimeoutRef.current) {
      clearTimeout(whiteScreenTimeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Reset error state on pathname change
    setError(null);
    setIsLoading(true);

    // Keep previous children during transition
    setPreviousChildren(children);

    // Set a new timeout to check for white screen
    whiteScreenTimeoutRef.current = setTimeout(() => {
      const mainContent = contentRef.current;
      if (mainContent && (mainContent.children.length === 0 || mainContent.clientHeight === 0)) {
        errorCountRef.current++;
        
        if (errorCountRef.current >= 3) {
          // After 3 failures, show error and try to recover
          setError("Unable to load content. Please try again.");
          retryTimeoutRef.current = setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          // Try a soft navigation first
          router.refresh();
        }
      } else {
        // Content loaded successfully
        errorCountRef.current = 0;
        setIsLoading(false);
      }
    }, 1000);

    // Update the last pathname
    lastPathnameRef.current = pathname;

    // Cleanup timeouts on unmount or pathname change
    return () => {
      if (whiteScreenTimeoutRef.current) {
        clearTimeout(whiteScreenTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      setIsLoading(false);
    };
  }, [pathname, router, children]);

  // Enhanced empty page check with fallback UI and debounce
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      setShowFallback(false);
      if (emptyPageTimeoutRef.current) clearTimeout(emptyPageTimeoutRef.current);
      emptyPageTimeoutRef.current = setTimeout(() => {
        const mainContent = contentRef.current;
        const hasContent = mainContent && (
          mainContent.children.length > 0 ||
          (mainContent.textContent?.trim().length ?? 0) > 0 ||
          mainContent.querySelector('img, svg, canvas, video') !== null
        );
        if (!hasContent) {
          if (reloadAttempts < 2) {
            setReloadAttempts(r => r + 1);
            router.refresh();
          } else {
            setShowFallback(true);
          }
        } else {
          setReloadAttempts(0);
        }
      }, 2000);
      lastPathnameRef.current = pathname;
    }
    return () => {
      if (emptyPageTimeoutRef.current) clearTimeout(emptyPageTimeoutRef.current);
    };
  }, [pathname, router, reloadAttempts]);

  // Keyboard shortcut for collapse/expand
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(newValue));
      return newValue;
    });
  };

  const handleRetry = () => {
    setReloadAttempts(0);
    setShowFallback(false);
    setError(null);
    router.refresh();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 dark:bg-gray-900",
      direction === "rtl" && "rtl"
    )}>
      <ErrorBoundary>
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isSidebarOpen} 
          onOpenChange={setIsSidebarOpen} 
          navItems={mainNav} 
        />

        {/* Desktop Sidebar */}
        <Sidebar 
          navItems={mainNav} 
          isCollapsed={sidebarCollapsed} 
          toggleCollapsed={toggleSidebar} 
        />

        {/* Header */}
        <Header 
          sidebarWidth={sidebarWidth} 
          onMobileMenuClick={() => setIsSidebarOpen(true)} 
        />

        {/* Page Content */}
        <PageContent 
          sidebarWidth={sidebarWidth}
          isLoading={isLoading}
          error={error}
          showFallback={showFallback}
          onRetry={handleRetry}
          children={children}
        />
      </ErrorBoundary>
    </div>
  );
}
