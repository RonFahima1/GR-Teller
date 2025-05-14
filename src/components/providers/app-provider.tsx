"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "react-hot-toast";
import { ReactNode } from 'react';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <>{children}</>;
} 