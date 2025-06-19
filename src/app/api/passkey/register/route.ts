import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { generatePasskeyRegistrationOptions, verifyPasskeyRegistration } from '@/lib/passkey';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, response } = await req.json();

    if (action === 'generate') {
      // Generate registration options
      const options = await generatePasskeyRegistrationOptions(
        session.user.id,
        session.user.email!,
        session.user.name || session.user.email!
      );

      return NextResponse.json({ options });
    }

    if (action === 'verify') {
      // Verify registration response
      const verification = await verifyPasskeyRegistration(session.user.id, response);

      if (verification.verified) {
        return NextResponse.json({ 
          success: true, 
          message: 'Passkey registered successfully' 
        });
      } else {
        return NextResponse.json({ 
          error: 'Passkey registration failed' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Passkey registration error:', error);
    return NextResponse.json({ 
      error: 'Passkey registration failed' 
    }, { status: 500 });
  }
} 