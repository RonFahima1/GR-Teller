# Code Style Guide

## 1. TypeScript

### 1.1 Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "useDefineForClassFields": true,
    "lib": ["es2020", "dom", "dom.iterable"],
    "module": "esnext",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.2 Type Definitions
```typescript
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};
```

## 2. React

### 2.1 Component Structure
```typescript
// components/ExampleComponent.tsx
interface ExampleProps {
  title: string;
  isActive?: boolean;
  children?: React.ReactNode;
}

const ExampleComponent: React.FC<ExampleProps> = ({
  title,
  isActive = false,
  children
}) => {
  return (
    <div className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-100'}`}>
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default ExampleComponent;
```

### 2.2 State Management
```typescript
// hooks/useExample.ts
import { useState, useCallback } from 'react';

interface ExampleState {
  value: string;
  isLoading: boolean;
  error?: Error;
}

export function useExample(initialValue: string) {
  const [state, setState] = useState<ExampleState>({
    value: initialValue,
    isLoading: false,
    error: undefined
  });

  const updateValue = useCallback((newValue: string) => {
    setState(prev => ({ ...prev, value: newValue }));
  }, []);

  return { state, updateValue };
}
```

## 3. Styling

### 3.1 Tailwind CSS
```tsx
// components/StyledComponent.tsx
const StyledComponent = () => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Component Title
      </h2>
      <p className="text-gray-600">
        Component description goes here.
      </p>
    </div>
  );
};
```

### 3.2 CSS Modules
```tsx
// components/ModuleComponent.tsx
import styles from './ModuleComponent.module.css';

const ModuleComponent = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Module Component</h2>
      <p className={styles.description}>
        This component uses CSS Modules.
      </p>
    </div>
  );
};
```

## 4. API Integration

### 4.1 Service Layer
```typescript
// services/api.ts
interface ApiService {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data: any): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete(endpoint: string): Promise<void>;
}

export const apiService: ApiService = {
  async get(endpoint) {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json();
  },
  // ... other methods
};
```

### 4.2 Error Handling
```typescript
// services/error.ts
export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.code}): ${error.message}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## 5. Testing

### 5.1 Unit Tests
```typescript
// components/Button.test.tsx
describe('Button component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button label="Click me" />);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button onClick={onClick} />);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### 5.2 Integration Tests
```typescript
// pages/dashboard.test.tsx
describe('Dashboard page', () => {
  it('fetches and displays user data', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    jest.spyOn(apiService, 'getUser').mockResolvedValue(mockUser);

    const { getByText } = render(<Dashboard />);
    await waitFor(() => expect(getByText('Test User')).toBeInTheDocument());
  });
});
```

## 6. Performance

### 6.1 Code Splitting
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

### 6.2 Memoization
```typescript
// hooks/useMemoizedData.ts
import { useMemo } from 'react';

export function useMemoizedData(data: any[]) {
  return useMemo(() => {
    // Perform expensive computations here
    return data.map(item => ({
      ...item,
      processed: processItem(item)
    }));
  }, [data]);
}
```

## 7. Security

### 7.1 Authentication
```typescript
// services/auth.ts
export async function login(credentials: LoginCredentials) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}
```

### 7.2 Data Protection
```typescript
// utils/encryption.ts
export function encryptData(data: string, key: string) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  // Implement encryption logic here
  return encryptedData;
}

export function decryptData(encryptedData: string, key: string) {
  // Implement decryption logic here
  return decryptedData;
}
```

## 8. Best Practices

### 8.1 Code Organization
- Keep components small and focused
- Use proper abstraction
- Follow DRY principles
- Implement proper error handling
- Write maintainable code

### 8.2 Naming Conventions
- **Components**: PascalCase
- **Files**: kebab-case
- **Classes**: BEM methodology
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### 8.3 Documentation
- Document complex logic
- Document API endpoints
- Document configuration
- Keep README.md up to date
- Maintain development guidelines

### 8.4 Testing
- Write unit tests for components
- Implement integration tests for API calls
- Use proper test mocking
- Maintain test coverage
- Regular test updates

### 8.5 Performance
- Optimize images and assets
- Implement proper caching
- Use code splitting
- Minimize bundle size
- Monitor performance metrics

### 8.6 Security
- Sanitize all inputs
- Use proper authentication
- Implement proper authorization
- Use secure API endpoints
- Regular security audits

## 9. Development Tools

### 9.1 ESLint Configuration
```json
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
};
```

### 9.2 Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "auto"
}
```

### 9.3 Husky Configuration
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 10. Environment Setup

### 10.1 Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# Build for production
npm run build
```

### 10.2 Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_NAME=Your App
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

## 11. Deployment

### 11.1 Build Configuration
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-domain.com'],
    unoptimized: false
  },
  experimental: {
    optimizeCss: true
  }
};
```

### 11.2 Version Control
```bash
# .gitignore
node_modules/
.env
.env.local
.env.*.local
.next/
build/
dist/
```

## 12. Maintenance

### 12.1 Code Updates
- Keep dependencies up to date
- Monitor performance metrics
- Update documentation
- Fix security vulnerabilities
- Improve code quality

### 12.2 Documentation
- Maintain README.md
- Update API documentation
- Keep component documentation
- Update development guidelines
- Document new features

### 12.3 Testing
- Update test cases
- Add new test scenarios
- Fix failing tests
- Improve test coverage
- Regular test runs

### 12.4 Security
- Regular security audits
- Update security dependencies
- Fix security vulnerabilities
- Monitor security advisories
- Implement security patches
