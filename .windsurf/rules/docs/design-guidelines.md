# Global Remit Design System

## 1. Core Principles

### Clarity & Legibility
- **Typography**: Use system fonts (San Francisco on macOS, system default on other platforms)
  - Headings: 24px (1.5rem) - 32px (2rem)
  - Body text: 16px (1rem) minimum
  - Line height: 1.5
- **Contrast**: Maintain WCAG 2.1 AA+ compliance
  - Text contrast ratio: ≥4.5:1
  - Interactive elements: ≥3:1
- **Visual Hierarchy**: Clear distinction between:
  - Primary actions (buttons)
  - Secondary actions (links)
  - Informational content
  - Supportive content

### Depth & Hierarchy
- **Layout Structure**:
  ```tsx
  <Container>
    <Header />
    <main>
      <Content />
    </main>
    <Footer />
  </Container>
  ```
- **Elevation System**:
  - Base: 0 (flat)
  - Card: 1 (2px shadow)
  - Modal: 2 (4px shadow)
  - Overlay: 3 (8px shadow)
- **Z-Index Scale**:
  ```css
  :root {
    --z-index-base: 0;
    --z-index-overlay: 10;
    --z-index-modal: 20;
    --z-index-toast: 30;
  }
  ```

### Accessibility
- **Keyboard Navigation**:
  - All interactive elements must be focusable
  - Logical tab order
  - Clear focus states
- **Screen Reader Support**:
  - Proper ARIA labels
  - Landmark regions
  - Descriptive alt text
- **Color Accessibility**:
  - Avoid color-only indicators
  - Test with color blindness filters
  - Provide alternative visual indicators

## 2. Component Guidelines

### Base Components
- **Buttons**:
  ```tsx
  <Button
    variant="primary|secondary|outline"
    size="sm|md|lg"
    disabled={boolean}
    loading={boolean}
  >
    Action
  </Button>
  ```
- **Inputs**:
  ```tsx
  <Input
    type="text|number|email|password"
    label="Label"
    placeholder="Placeholder"
    error={string}
    required={boolean}
  />
  ```

### Layout Components
- **Container**:
  ```tsx
  <Container size="sm|md|lg|xl">
    {/* Content */}
  </Container>
  ```
- **Grid System**:
  ```tsx
  <Grid
    columns="1|2|3|4"
    gap="sm|md|lg"
  >
    {/* Grid items */}
  </Grid>
  ```

## 3. Color System

### Base Palette
- **Primary**: #2D3748 (dark) / #EDF2F7 (light)
- **Secondary**: #4A5568 (dark) / #E2E8F0 (light)
- **Accent**: #4299E1 (blue)
- **Success**: #48BB78 (green)
- **Warning**: #F6AD55 (orange)
- **Error**: #E53E3E (red)

### Usage Guidelines
- **Text Colors**:
  - Primary: Use for main content
  - Secondary: Use for supporting text
  - Accent: Use for interactive elements
- **Background Colors**:
  - Light/dark mode support
  - Subtle gradients for depth
  - Consistent contrast ratios

## 4. Motion & Animation

### Core Principles
- Purposeful animations
- Subtle transitions
- Performance-first approach

### Implementation
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### Animation Guidelines
- Maximum duration: 300ms
- Use spring physics for natural feel
- Avoid unnecessary animations
- Consider performance impact

## 5. Responsive Design

### Breakpoints
- Mobile: 0-767px
- Tablet: 768-1023px
- Laptop: 1024-1279px
- Desktop: 1280px+

### Layout Patterns
- Mobile-first approach
- Flexible grid layouts
- Content stacking on mobile
- Side-by-side layouts on desktop

## 6. Form Design

### Core Principles
- Clear validation feedback
- Progressive disclosure
- Mobile-friendly inputs
- Error prevention

### Implementation
```tsx
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const form = useForm({ resolver: zodResolver(schema) })
```

## 7. State Management

### Server State
- Use React Query (TanStack Query) for server state
- Implement proper caching strategies
- Use stale-while-revalidate pattern
- Handle pagination and infinite scroll

```typescript
// hooks/useQuery.ts
import { useQuery } from '@tanstack/react-query'

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      return response.json()
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
```

### Client State
- Use React Context for global UI state
- Use local state for component-specific state
- Use React.memo for performance optimization

### Loading States
- Skeleton loading for content
- Spinners for actions
- Optimistic updates
- Error boundaries
- Implement proper loading states for Next.js App Router

## 8. Next.js App Router Patterns

### Core Principles
- Use Next.js App Router conventions
- Implement proper data fetching patterns
- Use server components where possible
- Follow Next.js best practices

### App Router Patterns
- Use server components by default
- Use client components only when needed
- Implement proper data fetching patterns
- Use proper metadata for SEO
- Implement proper loading states

```tsx
// app/page.tsx (Server Component)
export default async function Page() {
  const data = await getData()
  return (
    <Layout>
      <DataComponent data={data} />
    </Layout>
  )
}

// components/DataComponent.tsx (Client Component)
'use client'

export default function DataComponent({ data }) {
  // Client-side logic here
  return <div>{/* Render data */}</div>
}
```

### Data Fetching
- Use server components for initial data fetch
- Use React Query for client-side data
- Implement proper error boundaries
- Use revalidate for dynamic data

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.example.com/users')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
```

### Server Actions
- Use server actions for mutations
- Implement proper error handling
- Use proper loading states
- Use proper success/error feedback

```typescript
// app/actions.ts
'use server'

export async function createUser(data: FormData) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to create user')
    }
    return await response.json()
  } catch (error) {
    throw new Error('Failed to create user')
  }
}
```

## 9. Best Practices

### Performance
- Use Next.js dynamic imports for code splitting
- Implement proper image optimization with Next.js Image
- Use next/font for optimized font loading
- Implement proper caching with React Query
- Use proper server/client component patterns

### Image Optimization
- Use Next.js Image component for all images
- Implement proper image sizes and loading
- Use proper image formats (WebP, AVIF)
- Implement lazy loading
- Use proper image alt text

```tsx
// Image component usage
import Image from 'next/image'

// Optimized image example
<Image
  src="/images/hero.png"
  alt="Hero image description"
  width={1920}
  height={1080}
  priority
  quality={75}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  loading="lazy"
  placeholder="blur"
/>

// Dynamic image loading
const DynamicImage = dynamic(() => import('./ImageComponent'), {
  loading: () => <div className="animate-pulse">Loading...</div>,
  ssr: false
})
```

### Font Optimization
- Use next/font for optimized font loading
- Implement proper font display strategy
- Use system fonts as fallback
- Implement proper font weights
- Use proper font sizes and line heights

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'system-ui']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  )
}
```

### Metadata & SEO
- Use Next.js metadata API for proper SEO
- Implement proper Open Graph tags
- Use proper Twitter card tags
- Implement proper sitemap generation
- Use proper canonical URLs

```typescript
// app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Remit - Money Transfer Service',
  description: 'Fast and secure money transfer service',
  keywords: ['money transfer', 'remittance', 'global payments'],
  openGraph: {
    title: 'Global Remit',
    description: 'Fast and secure money transfer service',
    url: 'https://globalremit.com',
    siteName: 'Global Remit',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Global Remit Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Remit',
    description: 'Fast and secure money transfer service',
    images: ['/twitter-image.jpg'],
  },
}

// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://globalremit.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Add other routes
  ]
}
``

### Accessibility
- Test with screen readers
- Use semantic HTML
- Provide keyboard shortcuts
- Support high contrast mode

### Testing
- Unit test components
- Test animations
- Verify responsive behavior
- Check accessibility
- Test server/client component interactions

### Accessibility
- Test with screen readers
- Use semantic HTML
- Provide keyboard shortcuts
- Support high contrast mode

### Testing
- Unit test components
- Test animations
- Verify responsive behavior
- Check accessibility

## 9. Implementation Tools

### Core Technologies
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **State**: React Query (TanStack Query)
- **UI Components**: Radix UI
- **Testing**: Jest + Cypress
- **Fonts**: next/font
- **Image Optimization**: Next.js Image component

### Next.js Specific
- **Routing**: App Router
- **API Routes**: Next.js API Routes
- **Image Optimization**: Next.js Image component
- **Font Loading**: next/font
- **Server Components**: Use by default, client components when needed

### Development Workflow
1. Create component in `/src/components`
2. Add types in `/src/types`
3. Implement responsive design
4. Add accessibility features
5. Write unit tests
6. Test performance

## 10. Maintenance

### Version Control
- Document breaking changes
- Maintain changelog
- Keep dependencies up-to-date
- Regular code reviews

### Documentation
- Keep component API docs updated
- Maintain design system documentation
- Document design decisions
- Update usage examples