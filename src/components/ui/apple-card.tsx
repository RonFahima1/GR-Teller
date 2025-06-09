import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AppleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  selectable?: boolean;
  interactive?: boolean;
  elevation?: "none" | "xs" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

/**
 * AppleCard component that follows Apple's design guidelines
 * with subtle shadows and rounded corners
 */
export const AppleCard = React.forwardRef<HTMLDivElement, AppleCardProps>(
  ({ className, selected = false, selectable = true, interactive = true, elevation = "sm", children, ...props }, ref) => {
    // Dynamic shadow classes based on elevation
    const elevationClasses = {
      none: "shadow-none",
      xs: "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
      sm: "shadow-[0_2px_5px_rgba(0,0,0,0.08)]",
      md: "shadow-[0_4px_10px_rgba(0,0,0,0.12)]",
      lg: "shadow-[0_8px_20px_rgba(0,0,0,0.16)]",
    };
    
    // State-specific shadows for interactive cards
    const hoverShadow = interactive ? {
      xs: "hover:shadow-[0_2px_3px_rgba(0,0,0,0.07)]",
      sm: "hover:shadow-[0_3px_7px_rgba(0,0,0,0.10)]",
      md: "hover:shadow-[0_6px_14px_rgba(0,0,0,0.14)]",
      lg: "hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)]",
    }[elevation] : "";
    
    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { y: -2, transition: { duration: 0.2 } } : {}}
        whileTap={interactive ? { y: 0, scale: 0.98 } : {}}
        className={cn(
          "bg-white dark:bg-[#1C1C1E] rounded-xl border border-[#E5E5EA] dark:border-[#3A3A3C]",
          elevationClasses[elevation],
          hoverShadow,
          selected && "ring-2 ring-offset-1 ring-[#007AFF] dark:ring-[#0A84FF]",
          selectable && "cursor-pointer",
          interactive && "transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AppleCard.displayName = "AppleCard";

export default AppleCard;
