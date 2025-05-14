'use client';

import React, { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by ErrorBoundary:", error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="text-destructive text-lg font-medium">Something went wrong.</div>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }

  return <>{children}</>;
}
