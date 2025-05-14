# **App Name**: Global Remit Teller

## Core Features:

- Modern UI with iOS-inspired design
- Responsive layout using Tailwind CSS
- Next.js App Router architecture
- Server-first approach with React Query
- Feature parity with existing system
- Performance optimization
- Accessibility compliance

## Technical Stack:

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Query
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM

## Style Guidelines:

- **Color System**:
  - Primary: iOS Blue (#0A84FF)
  - Secondary: iOS Light Blue (#5AC8FA)
  - Success: iOS Green (#34C759)
  - Warning: iOS Orange (#FF9500)
  - Danger: iOS Red (#FF3B30)
  - Background: Light Gray (#F2F2F7)
  - Text: iOS Dark Text (#000000)

- **Typography**:
  - Font: Inter (system font fallback)
  - Headings: 24px - 32px
  - Body: 16px
  - Line height: 1.5

- **Component Design**:
  - iOS-style rounded corners (14px radius)
  - Subtle shadows for depth
  - Consistent spacing scale
  - Clear visual hierarchy
  - Accessible color contrast

## Project Structure:

```
src/
├── app/                # Next.js App Router
│   ├── (auth)/        # Auth routes
│   ├── (dashboard)/   # Dashboard routes
│   ├── (admin)/       # Admin routes
│   └── layout.tsx     # Root layout
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── forms/         # Form components
│   └── layouts/       # Layout components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── services/          # API services
├── styles/            # Global styles
└── types/            # TypeScript types
```

## Original User Request:
# Global Remit Web Interface Specification
## iOS-Inspired UI Redesign with Tailwind CSS

### Executive Summary
This document provides comprehensive specifications for redesigning the Global Remit web interface used by tellers for banking operations. The redesign will adopt Apple iOS design principles while implementing Tailwind CSS for consistent styling and responsive behavior.

## Architecture Overview

### 1. Next.js App Router
- Server-first architecture
- Route groups for organization
- Server components by default
- Client components for interactivity
- Proper data fetching patterns

### 2. Component Architecture
- Base components with Radix UI
- Compound component patterns
- Reusable form components
- Responsive layout components
- Accessible UI patterns

### 3. Data Management
- React Query for server state
- Local state with React Context
- Server actions for mutations
- Proper error boundaries
- Optimistic updates

### 4. Performance
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Font optimization with next/font
- Proper caching strategies
- Server-side rendering

### 5. Core Features

#### Authentication
- Phone/email login
- Multi-country support
- Secure password management
- Session management
- Role-based access control

#### Financial Management
- Multi-currency support
- Real-time exchange rates
- Balance tracking
- Transaction history
- Negative balance handling

#### Transaction Processing
- Money transfer system
- Currency exchange
- Client deposits/withdrawals
- Cash register management
- Transaction validation

#### Customer Management
- Advanced search capabilities
- Client profiles
- Transaction history
- KYC verification
- Document management

#### Reporting
- Transaction analytics
- Date range filtering
- Status tracking
- Export capabilities
- Custom reports

## Design System

### 1. Color System

#### Base Colors
```css
:root {
  /* Primary */
  --color-primary: #0A84FF;
  --color-primary-light: #5AC8FA;
  
  /* Success */
  --color-success: #34C759;
  
  /* Warning */
  --color-warning: #FF9500;
  
  /* Danger */
  --color-danger: #FF3B30;
  
  /* Background */
  --color-bg-light: #F2F2F7;
  --color-bg-white: #FFFFFF;
  
  /* Text */
  --color-text-primary: #000000;
  --color-text-secondary: #8E8E93;
  --color-text-label: #3C3C43;
}
```

### 2. Typography

```css
:root {
  --font-family: Inter, system-ui, sans-serif;
  
  /* Font Sizes */
  --font-size-h1: 28px;
  --font-size-h2: 22px;
  --font-size-h3: 20px;
  --font-size-body: 16px;
  --font-size-caption: 15px;
  --font-size-small: 13px;
  
  /* Line Heights */
  --line-height-base: 1.5;
}
```

### 3. Spacing

```css
:root {
  --spacing-unit: 4px;
  --spacing-xs: calc(var(--spacing-unit) * 1);
  --spacing-sm: calc(var(--spacing-unit) * 2);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 8);
  --spacing-xl: calc(var(--spacing-unit) * 16);
}
```

### 4. Components

#### Layout Components
```tsx
// components/layouts/Container.tsx
import { Container as RadixContainer } from '@radix-ui/react-container'

export function Container({ children, size = 'md' }) {
  return (
    <RadixContainer
      className={`max-w-[${size === 'sm' ? '640px' : size === 'md' ? '768px' : '1024px'}] mx-auto px-4`}
    >
      {children}
    </RadixContainer>
  )
}
```

#### Button Component
```tsx
// components/ui/Button.tsx
import { Button as RadixButton } from '@radix-ui/react-button'

export function Button({ variant = 'primary', size = 'md', ...props }) {
  return (
    <RadixButton
      className={`
        rounded-lg px-4 py-2
        ${variant === 'primary' ? 'bg-primary text-white' : ''}
        ${variant === 'secondary' ? 'bg-secondary text-primary' : ''}
        ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : ''}
      `}
      {...props}
    />
  )
}
```

### 3. Component Specifications

#### 3.1 Navigation

**Left Sidebar Navigation**
- Fixed position sidebar with iOS-style icons
- Active state with blue highlight and rounded rectangle background
- Collapsible on smaller screens with slide-out behavior
- Hierarchical navigation structure preserved

**Top Bar**
- Clean white header with subtle shadow
- Currency balances displayed with appropriate positive/negative styling
- User profile with dropdown menu
- Language selector (showing current language flag)

#### 3.2 Cards and Containers

- Rounded corners (14px radius)
- Subtle shadows (box-shadow with low opacity)
- White backgrounds (#FFFFFF)
- Grouped content with iOS-style section headers
- Clear visual hierarchy with consistent spacing

#### 3.3 Form Elements

**Text Inputs**
- Rounded input fields (10px radius)
- Light gray backgrounds (#F2F2F7)
- Clear input labels above fields
- Focus state with blue outline

**Buttons**
- Primary Action: Blue background (#0A84FF), white text, rounded (10px)
- Secondary Action: Light gray background, blue text
- Danger Action: Red background (#FF3B30), white text
- Icon buttons with tooltips

**Dropdowns/Selects**
- iOS-style select elements with rounded appearance
- Custom chevron indicator
- Subtle animation on focus
- Clean dropdown menus with adequate spacing

**Search Fields**
- iOS-style search bars with rounded corners
- Search icon prefixed
- Clear button when text is entered
- Subtle transition animations

#### 3.4 Data Display

**Tables**
- Clean borders and alternating row backgrounds
- Column headers with sort indicators
- iOS-style swipe actions for common operations
- Pagination controls with iOS appearance

**Status Indicators**
- Color-coded status pills (success green, warning orange, danger red)
- iOS-style activity indicators
- Empty state illustrations

**Currency Display**
- Consistent formatting with currency symbols
- Color coding for negative values (red)
- Bold styling for primary amounts

### 4. Screen-by-Screen Specifications

#### 4.1 Login Screen

**Layout**
- Centered card with Global Remit logo
- Clean, minimal design with white background
- iOS-style segmented control for login options (phone/email)

**Components**
- Country code selector with flag icons
- Phone number input with formatting
- Password field with show/hide toggle
- "Log In" primary button
- "Reset password" subtle link
- Error message display with iOS-style alert

#### 4.2 Dashboard/Home

**Layout**
- Welcome section with teller name
- iOS-style card layout for key metrics
- Quick action buttons for common tasks

**Components**
- Currency balance cards with visual indicators
- Recent activity preview (last 5 transactions)
- Quick action buttons for Send Money, Currency Exchange, Deposit
- System notifications with iOS-style appearance

#### 4.3 Send Money

**Layout**
- Multi-step process with iOS-style segmented progress indicator
- Clean form layout with logical grouping

**Components**
1. **Sender Section**
   - Search interface with iOS tab navigation
   - Contact selection with swipe actions
   - "New Sender" button with iOS-style appearance

2. **Receiver Section**
   - Beneficiary selection interface
   - Quick option to use same as sender
   - "New Receiver" button

3. **Transaction Details**
   - Source of funds dropdown
   - Purpose of transfer dropdown
   - Operator selection
   - Transfer type selection

4. **Amount and Payment**
   - Amount input with large, clear display
   - Currency selection with icons
   - Fee display
   - Exchange rate information
   - Total calculation

5. **Confirmation**
   - Transaction summary
   - Terms acceptance checkbox
   - Submit button
   - Cancel option

#### 4.4 Currency Exchange

**Layout**
- Two-panel design showing "Customer To Pay" and "Customer To Receive"
- Clear display of exchange rate
- Quick calculator functionality

**Components**
- Currency selectors with flags and codes
- Amount inputs with auto-calculation
- Exchange rate display with visual indicator if favorable
- System rate information
- Customer search interface
- Confirmation button
- Fee structure display

#### 4.5 Client Balance Management

**Layout**
- Account summary at top
- Tabbed interface for Deposit/Withdrawal operations
- Transaction history below

**Components**
- Balance cards for multiple currencies
- Deposit form with currency selection
- Withdrawal form with availability check
- Account owner search interface
- Transaction history with iOS-style table

#### 4.6 Cash Register

**Layout**
- Clean tabular layout showing all currencies
- Current balance prominently displayed
- Clear register operations

**Components**
- Currency columns (USD, ILS, EUR)
- Opening balance display
- Net payments tracker
- Current balance with timestamp
- "Leave for next shift" input fields
- Clear register buttons with confirmation dialogs

#### 4.7 Transactions

**Layout**
- Powerful filtering interface at top
- Summary statistics and visualizations
- Detailed transaction table below

**Components**
- iOS-style segmented date selector
- Filter chips for active filters
- Search field for transaction lookup
- Breakdown visualization
- Transaction table with swipe actions
- Status indicators using iOS-style pills

#### 4.8 Payout

**Layout**
- Search interface at top
- Pending payouts list
- Payout details panel

**Components**
- Operator selection dropdown
- Search button with iOS styling
- Pickup section for in-person collection
- Payout status indicators
- Action buttons for processing payouts

### 5. Responsive Behavior

- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, optimized column layouts
- **Mobile**: Bottom navigation bar, single column stacked layout
- Breakpoints following iOS device dimensions

### 6. Animation and Transitions

- Subtle slide transitions between screens
- Smooth fade for loading states
- iOS-style spring animations for interactive elements
- Button press effects with haptic feedback on supported devices

### 7. Accessibility Considerations

- Color contrast meeting WCAG AA standards
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators for all interactive elements
- Adequate text sizing and spacing

## Implementation Guide

### Tailwind CSS Setup

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ios-blue': '#0A84FF',
        'ios-light-blue': '#5AC8FA',
        'ios-green': '#34C759',
        'ios-orange': '#FF9500',
        'ios-red': '#FF3B30',
        'ios-gray': '#8E8E93',
        'ios-light-gray': '#F2F2F7',
        'ios-divider': '#C6C6C8',
        'ios-label': 'rgba(60, 60, 67, 0.6)',
      },
      borderRadius: {
        'ios': '10px',
        'ios-card': '14px',
      },
      boxShadow: {
        'ios-card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'ios-button': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        'sf-pro': ['SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### Common Component Classes

#### Buttons
```html
<!-- Primary Button -->
<button class="bg-ios-blue text-white rounded-ios px-5 py-2.5 font-medium shadow-ios-button hover:bg-opacity-90 transition-all">
  Primary Action
</button>

<!-- Secondary Button -->
<button class="bg-ios-light-gray text-ios-blue rounded-ios px-5 py-2.5 font-medium shadow-ios-button hover:bg-opacity-90 transition-all">
  Secondary Action
</button>

<!-- Danger Button -->
<button class="bg-ios-red text-white rounded-ios px-5 py-2.5 font-medium shadow-ios-button hover:bg-opacity-90 transition-all">
  Danger Action
</button>
```

#### Input Fields
```html
<div class="mb-4">
  <label class="block text-ios-label text-sm mb-1">Phone Number</label>
  <input type="text" class="w-full bg-ios-light-gray rounded-ios px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-ios-blue">
</div>
```

#### Cards
```html
<div class="bg-white rounded-ios-card shadow-ios-card p-5">
  <h3 class="text-lg font-semibold mb-4">Card Title</h3>
  <div class="card-content">
    <!-- Content goes here -->
  </div>
</div>
```

#### Navigation Item
```html
<a href="#" class="flex items-center px-4 py-3 rounded-ios text-ios-blue hover:bg-ios-light-gray transition-all">
  <svg class="w-5 h-5 mr-3"><!-- Icon SVG --></svg>
  <span>Menu Item</span>
</a>
```

## Migration Strategy

1. **Component Library Development**
   - Develop core Tailwind components matching iOS design
   - Create a comprehensive component documentation
   - Test components for responsive behavior

2. **Phased Implementation**
   - Begin with authentication screens
   - Implement core transaction screens
   - Update supporting screens
   - Apply consistent styling to all reports and tools

3. **Testing Protocol**
   - Usability testing with current tellers
   - Performance testing across devices
   - Accessibility audit
   - Cross-browser compatibility testing

4. **Deployment**
   - Feature flag for new interface
   - Parallel availability of old interface during transition
   - Teller training on new interface
   - Phased rollout across regions

## Conclusion

This specification provides a comprehensive guide for transforming the Global Remit teller interface into a modern, iOS-inspired experience. The implementation of Tailwind CSS will ensure consistency, responsive behavior, and maintainable code while significantly improving the user experience for tellers conducting daily banking operations.

The redesign maintains all existing functionality while bringing a fresh, clean aesthetic that follows Apple's design principles, making the interface more intuitive and visually appealing for users.
  