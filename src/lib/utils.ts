import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const themeColors = {
  primary: "#0066cc", // Global Remit blue
  accent: "#ffd700", // Global Remit gold
  background: {
    light: "#ffffff",
    dark: "#0a0a0a",
  },
  text: {
    light: "#0a0a0a",
    dark: "#ffffff",
  },
}
