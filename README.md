# Global Remit Teller

A modern, responsive teller system for global remittance operations built with Next.js, TypeScript, and Tailwind CSS. This application provides a comprehensive solution for managing financial transactions, client management, and teller operations.

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **UI Components**: Custom design system
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **Performance**: SWR for data fetching
- **Authentication**: JWT + Session Management

### Development Tools
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Linting**: ESLint with Next.js and TypeScript configurations
- **Formatting**: Prettier
- **Version Control**: Git
- **CI/CD**: GitHub Actions

### Build & Deployment
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Environment**: Node.js 18+
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT
- **Security**: Helmet + Rate Limiting

## 🚀 Features

- **Transaction Management**
  - Send Money (5-step process)
  - Withdrawal Processing
  - Deposit Management
  - Payout Processing
  - Exchange Rate Management
  - Cash Register Management

- **Client Management**
  - Client Profile Management
  - KYC Verification
  - Client Search and Filtering
  - Transaction History

- **System Management**
  - Settings Management
  - Currency Management
  - Branch Management
  - Security Settings
  - Profile Management

## 📚 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── (app)/              # Main application routes
│   │   ├── accounts/       # Account management pages
│   │   ├── clients/        # Client management pages
│   │   ├── deposit/        # Deposit processing pages
│   │   ├── exchange/       # Exchange rate management
│   │   ├── kyc/           # KYC verification pages
│   │   ├── profile/        # User profile pages
│   │   ├── settings/       # System settings pages
│   │   ├── send-money/     # Money transfer pages
│   │   └── withdrawal/     # Withdrawal processing pages
│   └── layout.tsx          # Root layout component
├── components/             # Reusable UI components
│   ├── layout/             # Layout components
│   ├── ui/                 # Base UI components
│   └── providers/          # Context providers
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and helpers
│   ├── api/                # API utilities
│   ├── auth/               # Authentication utilities
│   ├── cache/              # Caching utilities
│   └── validation/         # Validation utilities
├── services/               # Business logic and API services
│   ├── transaction/        # Transaction services
│   ├── client/             # Client management services
│   ├── auth/               # Authentication services
│   └── exchange/           # Exchange rate services
├── styles/                 # Global styles and theme
│   ├── globals.css         # Global styles
│   ├── theme.css           # Theme variables
│   └── components.css      # Component-specific styles
└── utils/                  # Utility functions
    ├── types/              # TypeScript types
    ├── constants/          # Application constants
    └── helpers/            # Helper functions
```

## 📦 Core Components

### Layout Components
- `AppLayout`: Main application layout with navigation
- `Sidebar`: Responsive sidebar navigation
- `Header`: Application header with user controls
- `Footer`: Application footer

### UI Components
- `Card`: Reusable card component
- `Button`: Styled button components
- `Input`: Form input components
- `Select`: Dropdown selection components
- `Tooltip`: Interactive tooltips
- `Popover`: Floating content containers
- `Toast`: Notification system

### Form Components
- `AmountEntry`: Money amount input with validation
- `TransferDetails`: Transfer information form
- `ReceiverSelection`: Client selection component
- `SenderSelection`: Sender selection component

## 🎯 Custom Hooks

### UI Hooks
- `useToast`: Toast notification system
- `useLoadingTransition`: Loading state management
- `useMobile`: Mobile device detection
- `useMediaQuery`: Responsive design hooks
- `useTranslation`: Internationalization support

### Business Logic Hooks
- `useAuth`: Authentication state management
- `useLanguage`: Language preference management
- `useDirection`: RTL/LTR direction management

## 🛠️ Services

### Transaction Services
- `transaction.ts`: Core transaction processing
- `cache.ts`: Redis-based caching
- `reports.ts`: Report generation and export

### Authentication Services
- `auth.ts`: User authentication
- `currentUser.ts`: Current user management

## 🎨 Design System

### Color System
- **Primary**: `#007AFF` (System Blue)
- **Secondary**: `#5856D6` (System Purple)
- **Success**: `#34C759` (System Green)
- **Error**: `#FF3B30` (System Red)
- **Warning**: `#FF9500` (System Orange)
- **Background**: `#F2F2F7` (Light) / `#000000` (Dark)

### Typography
- **Base Font**: -apple-system, BlinkMacSystemFont
- **Heading Scale**: 1.25x
- **Body Size**: 16px
- **Line Height**: 1.5

### Spacing
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Components
- **Card**: Consistent padding and shadow
- **Button**: Multiple variants (primary, secondary, outline)
- **Input**: Consistent sizing and validation
- **Form**: Unified layout and validation

### Animations
- **Timing**: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Duration**: 200ms - 300ms
- **Transitions**: Smooth opacity and transform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Redis 6+

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/global-remit-teller.git
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables
Create a `.env.local` file with the following variables:
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# API
API_URL=http://localhost:3000/api

# Other
NODE_ENV=development
```

## 📝 Documentation

### Project Documentation
- [Design Guidelines](./docs/design-guidelines.md)
- [Code Style Guide](./docs/code-style-guide.md)
- [API Documentation](./docs/api-docs.md)
- [Development Guidelines](./docs/development-guidelines.md)
- [Implementation Examples](./docs/implementation-examples.md)
- [Performance Guide](./docs/performance-guide.md)

### Technical Documentation
- [API Reference](./docs/api-reference.md)
- [Security Guide](./docs/security-guide.md)
- [Deployment Guide](./docs/deployment-guide.md)
- [Troubleshooting](./docs/troubleshooting.md)

### Development Resources
- [Component Library](./docs/component-library.md)
- [State Management](./docs/state-management.md)
- [Testing Guide](./docs/testing-guide.md)
- [Performance Optimization](./docs/performance-optimization.md)

## 🤝 Contributing

Please read our [Contributing Guidelines](./docs/contributing.md) before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

To get started, take a look at src/app/page.tsx.
