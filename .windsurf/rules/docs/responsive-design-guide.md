# Responsive Design Guide

This guide outlines best practices and implementation strategies for creating a responsive and accessible user interface in our Next.js application.

## 1. Core Responsive Design Principles

### 1.1 Layout System
- Use CSS Grid and Flexbox for responsive layouts
- Implement a consistent spacing system based on 4px increments
- Use CSS variables for consistent design tokens

```css
/* Design tokens */
:root {
  --spacing-unit: 4px;
  --spacing-sm: calc(var(--spacing-unit) * 2);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 8);
}

/* Responsive layout example */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}
```

### 1.2 Breakpoints
- Use semantic breakpoint names
- Implement mobile-first approach
- Optimize for common device sizes

```typescript
// breakpoints.ts
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px'
} as const;

// Usage in Tailwind config
module.exports = {
  theme: {
    extend: {
      screens: {
        xs: breakpoints.xs,
        sm: breakpoints.sm,
        md: breakpoints.md,
        lg: breakpoints.lg,
        xl: breakpoints.xl,
        '2xl': breakpoints.xxl
      }
    }
  }
}
```

## 2. Performance Optimizations

### 2.1 Image Optimization
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function OptimizedImage({ src, alt, width, height, priority = false }: OptimizedImageProps) {
  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        loading={priority ? 'eager' : 'lazy'}
        quality={85}
        priority={priority}
      />
    </div>
  );
}
```

### 2.2 Code Splitting
```typescript
// pages/[dynamic]/index.tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

export default function DynamicPage() {
  return (
    <div>
      <DynamicComponent />
    </div>
  );
}
```

## 3. Accessibility Implementation

### 3.1 Accessible Components
```typescript
// components/AccessibleButton.tsx
import { useEffect, useRef } from 'react';

interface AccessibleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}

export function AccessibleButton({ onClick, children, ariaLabel }: AccessibleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.setAttribute('aria-pressed', 'false');
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="p-2 rounded focus:outline-none focus:ring-2"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
```

### 3.2 Responsive Typography
```typescript
// components/ResponsiveText.tsx
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveText({ children, className = '' }: ResponsiveTextProps) {
  return (
    <div className={`text-base md:text-lg lg:text-xl ${className}`}>
      {children}
    </div>
  );
}
```

## 4. Theme System

### 4.1 Theme Provider
```typescript
// context/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
```

### 4.2 Theme Styles
```css
/* _app.css */
:root {
  --primary-color: #0070f3;
  --secondary-color: #101f33;
  --text-color: #334155;
  --background-color: #ffffff;
}

[data-theme="dark"] {
  --primary-color: #38bdf8;
  --secondary-color: #111827;
  --text-color: #f3f4f6;
  --background-color: #0f172a;
}

body {
  color: var(--text-color);
  background-color: var(--background-color);
}
```

## 5. Performance Monitoring

### 5.1 Web Vitals
```typescript
// lib/web-vitals.ts
import { onCLS, onFID, onLCP } from 'web-vitals';

const reportWebVitals = (metric: Metric) => {
  if (metric.name === 'CLS' || metric.name === 'FID' || metric.name === 'LCP') {
    console.log(metric);
    // Send metrics to analytics service
  }
};

export default reportWebVitals;

// Usage in _app.tsx
import reportWebVitals from '../lib/web-vitals';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    reportWebVitals();
  }, []);

  return <Component {...pageProps} />;
}
```

## 6. Mobile Optimizations

### 6.1 Touch Events
```typescript
// components/TouchOptimizedButton.tsx
import { useEffect, useRef } from 'react';

interface TouchOptimizedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function TouchOptimizedButton({ onClick, children }: TouchOptimizedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleTouchStart = () => {
      button.classList.add('active');
    };

    const handleTouchEnd = () => {
      button.classList.remove('active');
    };

    button.addEventListener('touchstart', handleTouchStart);
    button.addEventListener('touchend', handleTouchEnd);

    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className="p-2 rounded focus:outline-none focus:ring-2 active:opacity-75"
    >
      {children}
    </button>
  );
}
```

### 6.2 Mobile Navigation
```typescript
// components/MobileNav.tsx
import { useState } from 'react';

interface MobileNavProps {
  items: Array<{ label: string; href: string }>;
}

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded focus:outline-none focus:ring-2"
      >
        Menu
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 w-full md:w-64 h-full bg-white p-4">
            <nav>
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 7. Best Practices

### 7.1 Responsive Images
- Use `next/image` component for automatic optimization
- Implement lazy loading for non-critical images
- Use appropriate image formats (WebP for modern browsers)
- Set proper width and height attributes

### 7.2 Performance
- Implement code splitting for large components
- Use dynamic imports for non-critical routes
- Optimize font loading with `font-display: swap`
- Implement proper caching strategies

### 7.3 Accessibility
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Provide text alternatives for non-text content
- Use sufficient color contrast

### 7.4 Mobile First
- Start with mobile design and scale up
- Optimize touch targets (minimum 44x44px)
- Use relative units (rem, em) instead of fixed units
- Implement proper touch event handlers
- Optimize for mobile performance

## 8. Testing and Validation

### 8.1 Responsive Testing
- Test across different devices and screen sizes
- Use device emulation tools
- Validate layout breakpoints
- Test touch interactions
- Verify performance metrics

### 8.2 Accessibility Testing
- Use automated accessibility tools
- Test with screen readers
- Validate keyboard navigation
- Check color contrast
- Test focus management

### 8.3 Performance Testing
- Measure page load times
- Test network conditions
- Validate image optimization
- Monitor web vitals
- Test caching strategies

## 9. Resources

- [Web Vitals](https://web.dev/vitals/)
- [Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/)
- [Next.js Optimization Guide](https://nextjs.org/docs/optimizing)
- [Responsive Design Checklist](https://www.smashingmagazine.com/2011/11/how-to-create-a-mobile-friendly-website/)
- [Touch Target Guidelines](https://developer.apple.com/design/human-interface-guidelines/components/controls/buttons/)

## 10. Maintenance

### 10.1 Regular Updates
- Keep dependencies up to date
- Monitor performance metrics
- Update accessibility guidelines
- Review and optimize images
- Test new device sizes

### 10.2 Documentation
- Maintain component documentation
- Update performance guidelines
- Keep accessibility notes updated
- Document optimization strategies
- Track known issues and fixes

This guide provides a comprehensive framework for implementing responsive design in our Next.js application. Each section includes practical examples and best practices to ensure our application is performant, accessible, and user-friendly across all devices.