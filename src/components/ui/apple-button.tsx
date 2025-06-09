import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Button variants following Apple's design language
const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        // Apple-style primary button
        primary: "bg-[#007AFF] text-white hover:bg-[#0071E3] active:bg-[#0062C3] shadow-sm",
        // Secondary/gray button
        secondary: "bg-[#F2F2F7] text-[#1C1C1E] hover:bg-[#E5E5EA] active:bg-[#D1D1D6] dark:bg-[#3A3A3C] dark:text-white dark:hover:bg-[#48484A] dark:active:bg-[#545456]",
        // Subtle outline button
        outline: "border border-[#D1D1D6] bg-transparent text-[#007AFF] hover:bg-[#F2F2F7] active:bg-[#E5E5EA] dark:border-[#48484A] dark:text-[#0A84FF] dark:hover:bg-[#2C2C2E] dark:active:bg-[#3A3A3C]",
        // Ghost/transparent button
        ghost: "bg-transparent text-[#007AFF] hover:bg-[#F2F2F7] hover:text-[#0071E3] active:bg-[#E5E5EA] dark:text-[#0A84FF] dark:hover:bg-[#2C2C2E] dark:active:bg-[#3A3A3C]",
        // Destructive/red button
        destructive: "bg-[#FF3B30] text-white hover:bg-[#FF2D55] active:bg-[#D70015] dark:bg-[#FF453A] dark:hover:bg-[#FF375F] dark:active:bg-[#D70015]",
        // Success/green button
        success: "bg-[#34C759] text-white hover:bg-[#30B350] active:bg-[#248A3D] dark:bg-[#30D158] dark:hover:bg-[#2CC156] dark:active:bg-[#248A3D]",
      },
      size: {
        // Standard sizes with Apple-style rounded corners
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 rounded-lg", 
        lg: "h-12 px-6 rounded-lg",
        xl: "h-14 px-8 rounded-lg",
        // Icon button variants
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface AppleButtonProps
  extends React.ComponentPropsWithoutRef<typeof motion.button>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

export const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ className, variant, size, isLoading, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;
    
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileTap={{ scale: 0.97 }}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {props.children}
      </Comp>
    );
  }
);

AppleButton.displayName = "AppleButton";

export { buttonVariants as appleButtonVariants };
