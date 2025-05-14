'use client';

import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ 
  className, 
  showText = true,
  onClick 
}: LogoProps) {
  const [isSpinning, setIsSpinning] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 1000); // Reset after 1 second animation
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-3 font-bold text-xl transition-all duration-200',
        isDark ? 'text-white' : 'text-blue-600',
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        handleClick(e);
      }}
    >
      <div className={cn(
        'relative inline-block transition-transform duration-200',
        isSpinning && 'animate-spin-left'
      )}>
        <img 
          src={isDark ? "/app-logo.png" : "/logo-light.png"} 
          alt="Global Remit Logo" 
          className="h-12 w-auto max-w-[96px]" 
        />
      </div>
      {showText && (
        <span className="whitespace-nowrap font-bold text-2xl -ml-2">Global Remit</span>
      )}
    </Link>
  );
}
