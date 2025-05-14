"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-xl h-[40px] w-[40px] transition-colors duration-200 ease-ios active:scale-95"
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">Language</span>
    </Button>
  );
} 