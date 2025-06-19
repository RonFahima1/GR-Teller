import { NextRequest, NextResponse } from 'next/server';
import { generatePasskeyAuthenticationOptions, verifyPasskeyAuthentication } from '@/lib/passkey';
import { prisma } from '@/lib/prisma';
import { signIn } from 'next-auth/react';

export async function POST(req: NextRequest) {
  try {
    const { action, email, response } = await req.json();

    if (action === 'generate') {
      if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      // Generate authentication options
      const options = await generatePasskeyAuthenticationOptions(email);

      return NextResponse.json({ options });
    }

    if (action === 'verify') {
      if (!email || !response) {
        return NextResponse.json({ error: 'Email and response are required' }, { status: 400 });
      }

      // Verify authentication response
      const verification = await verifyPasskeyAuthentication(email, response);

      if (verification.verified) {
        // Get user for session creation
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return user data for client-side session creation
        return NextResponse.json({ 
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
          }
        });
      } else {
        return NextResponse.json({ 
          error: 'Passkey authentication failed' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Passkey authentication error:', error);
    return NextResponse.json({ 
      error: 'Passkey authentication failed' 
    }, { status: 500 });
  }
} 