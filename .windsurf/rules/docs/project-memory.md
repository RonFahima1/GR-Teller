---
trigger: always_on
---

# Project Memory

This document serves as a comprehensive memory of the Global Remit Teller project, capturing important decisions, patterns, and architectural choices.

## Core Architecture

### Application Structure
- Built with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible components
- Redux Toolkit for state management
- React Query for data fetching

### Key Components

#### Layout Components
- `AppLayout`: Main application wrapper with navigation
- `Sidebar`: Responsive navigation sidebar
- `Header`: Application header with user controls
- `Footer`: Application footer

#### Core Features
1. **Money Transfer System**
   - 5-step transfer process:
     1. Sender Selection
     2. Receiver Selection
     3. Amount Entry
     4. Transfer Details
     5. Confirmation
   - Real-time currency conversion
   - KYC verification integration

2. **Client Management**
   - Comprehensive client profiles
   - KYC verification workflow
   - Transaction history tracking
   - Multi-currency support

3. **Financial Operations**
   - Deposit processing
   - Withdrawal management
   - Exchange rate management
   - Cash register system
   - Payout processing

### Technical Decisions

#### State Management
- Redux Toolkit for global state
- React Context for theme and auth
- Local state for component-specific data
- Redux middleware for API calls

#### API Integration
- RESTful API endpoints
- GraphQL for complex queries
- Proper error handling
- Rate limiting implementation

#### Security
- JWT authentication
- Role-based access control
- Input sanitization
- XSS protection
- CSRF protection

### Design Decisions

#### Color System
- Primary: Blue (#2563eb)
- Secondary: Purple (#8b5cf6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

#### Typography
- System fonts for better performance
- Consistent hierarchy
- Responsive text sizes
- Clear visual hierarchy

### Performance Optimizations

#### Code Splitting
- Route-based code splitting
- Dynamic imports
- Lazy loading components
- Proper chunk naming

#### Caching
- Redis for data caching
- Browser caching for assets
- API response caching
- Image optimization

### Common Patterns

#### Error Handling
- Centralized error boundary
- User-friendly error messages
- Proper logging
- Graceful degradation

#### Loading States
- Skeleton loading
- Optimistic updates
- Loading transitions
- Proper feedback

#### Form Handling
- Formik for form management
- Yup for validation
- Proper error display
- Async validation

### Cross-Browser Support
- Modern browsers (Chrome, Firefox, Safari)
- Basic support for IE11
- Progressive enhancement
- Graceful degradation

### Mobile Responsiveness
- Mobile-first approach
- Touch-friendly interfaces
- Responsive layouts
- Proper breakpoints

### Future Considerations

#### Scalability
- Modular architecture
- Clean separation of concerns
- Proper abstraction
- Easy extensibility

#### Maintenance
- Clear documentation
- Consistent code style
- Proper testing
- Regular updates

#### Security
- Regular audits
- Security updates
- Monitoring
- Logging

### Important Notes
- Always check the latest API documentation
- Keep dependencies up to date
- Follow the established patterns
- Document new patterns
- Maintain consistent code style

### Common Pitfalls to Avoid
1. **State Management**
   - Don't overuse global state
   - Keep components stateless when possible
   - Use proper memoization

2. **Performance**
   - Avoid unnecessary re-renders
   - Implement proper caching
   - Optimize images
   - Use code splitting

3. **Security**
   - Never expose sensitive data
   - Always validate inputs
   - Use proper authentication
   - Implement proper authorization

4. **Code Organization**
   - Keep components focused
   - Use proper naming conventions
   - Follow established patterns
   - Document complex logic

This memory document should be updated regularly as the project evolves and new patterns emerge.
