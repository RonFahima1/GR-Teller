# Passkey Implementation Guide

## Overview

This document describes the passkey (WebAuthn) implementation for the Global Remit Teller Portal. Passkeys provide a more secure and user-friendly authentication method compared to traditional passwords.

## Features

- ✅ **Passkey Registration**: Users can register passkeys for their accounts
- ✅ **Passkey Authentication**: Login using passkeys instead of passwords
- ✅ **Passkey Management**: View, rename, and delete passkeys
- ✅ **Biometric Support**: Works with fingerprint, face ID, and other biometric methods
- ✅ **Cross-Platform**: Works on desktop and mobile devices
- ✅ **Security**: Protected against phishing attacks

## Architecture

### Database Schema

The passkey implementation uses the following Prisma schema:

```prisma
model Passkey {
  id           String    @id @default(cuid())
  userId       String
  name         String
  credentialId String    @unique
  publicKey    String
  signCount    Int       @default(0)
  transports   String[]
  createdAt    DateTime  @default(now())
  lastUsed     DateTime?
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([credentialId])
}
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/passkey/register` | POST | Generate registration options or verify registration |
| `/api/passkey/authenticate` | POST | Generate authentication options or verify authentication |
| `/api/passkey/list` | GET | List user's passkeys |
| `/api/passkey/delete/[id]` | DELETE | Delete a specific passkey |

### Components

- **PasskeyManager**: React component for managing passkeys
- **Login Page**: Updated to support passkey authentication
- **Settings Page**: Includes passkey management section

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @simplewebauthn/browser @simplewebauthn/server @simplewebauthn/typescript-types
```

### 2. Environment Variables

Ensure your `.env` file includes:

```env
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your_database_url
```

### 3. Database Migration

The passkey schema is already included in the Prisma schema. Run:

```bash
npx prisma generate
npx prisma db push
```

### 4. Test the Implementation

Run the passkey test script:

```bash
node scripts/test-passkey.js
```

## Usage Guide

### For Users

#### Registering a Passkey

1. **Login** to your account using password authentication
2. **Navigate** to Settings → Passkey Management
3. **Click** "Add Passkey"
4. **Follow** the browser prompts to create your passkey
5. **Verify** the passkey was added successfully

#### Using Passkey Authentication

1. **Go** to the login page
2. **Switch** to the "Passkey" tab
3. **Enter** your email address
4. **Click** "Sign in with Passkey"
5. **Use** your biometric authentication (fingerprint, face ID, etc.)

#### Managing Passkeys

1. **Go** to Settings → Passkey Management
2. **View** all your registered passkeys
3. **Delete** passkeys you no longer need
4. **Monitor** last used dates and sign counts

### For Developers

#### Adding Passkey Support to New Pages

```typescript
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

// Registration flow
const registerPasskey = async () => {
  // 1. Generate options
  const response = await fetch('/api/passkey/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generate' }),
  });
  const { options } = await response.json();

  // 2. Start registration
  const registrationResponse = await startRegistration(options);

  // 3. Verify registration
  const verifyResponse = await fetch('/api/passkey/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'verify', 
      response: registrationResponse 
    }),
  });
};

// Authentication flow
const authenticateWithPasskey = async (email: string) => {
  // 1. Generate options
  const response = await fetch('/api/passkey/authenticate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generate', email }),
  });
  const { options } = await response.json();

  // 2. Start authentication
  const authenticationResponse = await startAuthentication(options);

  // 3. Verify authentication
  const verifyResponse = await fetch('/api/passkey/authenticate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'verify', 
      email,
      response: authenticationResponse 
    }),
  });
};
```

#### Customizing Passkey Behavior

You can customize the passkey behavior by modifying the options in `src/lib/passkey.ts`:

```typescript
// Registration options
const options = await generateRegistrationOptions({
  rpName: 'Your App Name',
  rpID: 'your-domain.com',
  userID: userId,
  userName: userEmail,
  userDisplayName: userDisplayName,
  authenticatorSelection: {
    residentKey: 'preferred', // or 'required', 'discouraged'
    userVerification: 'preferred', // or 'required', 'discouraged'
  },
  supportedAlgorithmIDs: [-7, -257], // ES256, RS256
});

// Authentication options
const options = await generateAuthenticationOptions({
  rpID: 'your-domain.com',
  allowCredentials: userPasskeys.map(passkey => ({
    id: Buffer.from(passkey.credentialId, 'base64'),
    type: 'public-key',
    transports: passkey.transports,
  })),
  userVerification: 'preferred',
});
```

## Security Considerations

### Best Practices

1. **HTTPS Required**: Passkeys only work over HTTPS (except localhost for development)
2. **Domain Verification**: Ensure your domain matches the rpID configuration
3. **Challenge Storage**: Store challenges securely (Redis recommended for production)
4. **Error Handling**: Don't expose sensitive information in error messages
5. **Rate Limiting**: Implement rate limiting on passkey endpoints

### Production Deployment

1. **Update rpID**: Change from localhost to your production domain
2. **Challenge Storage**: Implement Redis or similar for challenge storage
3. **Error Logging**: Add proper error logging and monitoring
4. **Backup Strategy**: Ensure passkey data is backed up with user data
5. **Fallback Authentication**: Always provide password authentication as fallback

## Troubleshooting

### Common Issues

#### "No passkeys found for this email"
- User hasn't registered any passkeys yet
- Email address doesn't match registered passkeys
- Passkeys were deleted

#### "Passkey authentication failed"
- Browser doesn't support WebAuthn
- Device doesn't have biometric authentication
- Passkey was deleted or corrupted

#### "Registration failed"
- Browser doesn't support WebAuthn
- User cancelled the registration
- Device doesn't support the required algorithms

### Debug Mode

Enable debug logging by setting the environment variable:

```env
DEBUG=webauthn:*
```

### Browser Support

Passkeys are supported in:
- Chrome 67+
- Firefox 60+
- Safari 13+
- Edge 18+

### Device Support

- **Desktop**: Windows Hello, macOS Touch ID, Linux with appropriate hardware
- **Mobile**: iOS Touch ID/Face ID, Android biometric authentication
- **Hardware**: USB security keys, NFC keys

## Testing

### Automated Tests

Run the passkey test suite:

```bash
node scripts/test-passkey.js
```

### Manual Testing

1. **Register a passkey**:
   - Login with password
   - Go to Settings → Passkey Management
   - Click "Add Passkey"
   - Complete registration

2. **Test passkey login**:
   - Logout
   - Go to login page
   - Switch to Passkey tab
   - Enter email and authenticate

3. **Test passkey management**:
   - View passkey list
   - Delete a passkey
   - Verify deletion

### Browser Developer Tools

Use browser developer tools to debug WebAuthn:

1. **Chrome**: `chrome://webauthn/`
2. **Firefox**: `about:config` → `security.webauth.webauthn`
3. **Safari**: Developer → WebAuthn

## Future Enhancements

### Planned Features

- [ ] **Multi-device sync**: Sync passkeys across devices
- [ ] **Backup codes**: Generate backup codes for account recovery
- [ ] **Admin management**: Allow admins to manage user passkeys
- [ ] **Analytics**: Track passkey usage and adoption
- [ ] **Conditional UI**: Show passkey options based on device capabilities

### Integration Opportunities

- **NextAuth.js**: Full integration with NextAuth session management
- **OAuth providers**: Support for OAuth + passkey combinations
- **Enterprise SSO**: Integration with enterprise SSO systems
- **Compliance**: Enhanced compliance reporting for passkey usage

## Support

For issues or questions about the passkey implementation:

1. Check the troubleshooting section above
2. Review browser developer tools for WebAuthn errors
3. Verify environment configuration
4. Test with the provided test scripts

## References

- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [SimpleWebAuthn Documentation](https://simplewebauthn.dev/)
- [Passkey Developer Guide](https://developers.google.com/identity/passkeys)
- [Browser Support Matrix](https://caniuse.com/webauthn) 