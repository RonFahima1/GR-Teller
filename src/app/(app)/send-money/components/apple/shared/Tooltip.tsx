'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  delay?: number;
  offset?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 300,
  offset = 10
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  // Calculate position based on the child element
  const calculatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return;
    
    const rect = childRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - tooltipRect.width / 2;
        y = rect.bottom + offset;
        break;
      case 'left':
        x = rect.left - tooltipRect.width - offset;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = rect.right + offset;
        y = rect.top + rect.height / 2 - tooltipRect.height / 2;
        break;
    }
    
    // Ensure tooltip stays within viewport bounds
    x = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10));
    y = Math.max(10, Math.min(y, window.innerHeight - tooltipRect.height - 10));
    
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      // Need to wait for the tooltip to render before calculating position
      setTimeout(calculatePosition, 0);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) calculatePosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isVisible]);

  // Animation variants
  const variants = {
    hidden: { 
      opacity: 0,
      y: position === 'bottom' ? -5 : position === 'top' ? 5 : 0,
      x: position === 'right' ? -5 : position === 'left' ? 5 : 0,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { 
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { 
        duration: 0.1,
        ease: 'easeIn'
      }
    }
  };

  return (
    <>
      <div 
        ref={childRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className="fixed z-50 pointer-events-none"
            style={{ 
              left: coords.x,
              top: coords.y,
            }}
          >
            <div className="bg-[#1C1C1E] dark:bg-[#2C2C2E] text-white px-3 py-1.5 rounded-md shadow-md text-xs whitespace-nowrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
