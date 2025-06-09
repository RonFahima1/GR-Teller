/**
 * Design Tokens for Apple-style UI
 * Based on Apple Human Interface Guidelines (HIG)
 */

export const colors = {
  light: {
    primary: '#007AFF', // iOS blue
    primaryTint: '#E8F3FF',
    primaryShade: '#0062CC',
    background: {
      primary: '#FFFFFF',
      secondary: '#F2F2F7',
      tertiary: '#E5E5EA',
    },
    text: {
      primary: '#1C1C1E',    // Almost black
      secondary: '#6C6C70',  // Medium gray
      tertiary: '#AEAEB2',   // Light gray
    },
    border: '#E5E5EA',       // Light gray
    success: '#34C759',      // Green
    warning: '#FF9500',      // Orange
    error: '#FF3B30',        // Red
  },
  dark: {
    primary: '#0A84FF',      // iOS blue (dark mode)
    primaryTint: '#0A84FF20',
    primaryShade: '#409CFF',
    background: {
      primary: '#1C1C1E',     // Almost black
      secondary: '#2C2C2E',   // Dark gray
      tertiary: '#3A3A3C',    // Medium gray
    },
    text: {
      primary: '#FFFFFF',     // White
      secondary: '#AEAEB2',   // Light gray
      tertiary: '#8E8E93',    // Medium gray
    },
    border: '#3A3A3C',        // Medium gray
    success: '#30D158',       // Green
    warning: '#FF9F0A',       // Orange
    error: '#FF453A',         // Red
  }
};

// Spacing system based on 4px grid
export const spacing = {
  '0': '0px',
  '0.5': '2px',
  '1': '4px',
  '1.5': '6px',
  '2': '8px',
  '2.5': '10px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
};

// Typography scale
export const typography = {
  fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: '11px',
    sm: '13px',
    base: '15px',
    lg: '17px',
    xl: '19px',
    '2xl': '21px',
    '3xl': '24px',
  },
  lineHeights: {
    tight: '1.2',
    normal: '1.4',
    relaxed: '1.6',
  }
};

// Border radius
export const borderRadius = {
  xs: '4px',
  sm: '6px', 
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Animation timings
export const animation = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  easing: {
    default: 'cubic-bezier(0.42, 0, 0.58, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  }
};

// Shadows
export const shadows = {
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  lg: '0px 8px 16px rgba(0, 0, 0, 0.15)',
};

// Breakpoints
export const breakpoints = {
  sm: '390px',  // iPhone 12/13
  md: '744px',  // iPad mini
  lg: '1024px', // iPad Pro
  xl: '1280px', // Smaller desktops
};
