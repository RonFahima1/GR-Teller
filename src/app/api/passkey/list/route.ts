import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getUserPasskeys } from '@/lib/passkey';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const passkeys = await getUserPasskeys(session.user.id);

    return NextResponse.json({ passkeys });
  } catch (error) {
    console.error('Get passkeys error:', error);
    return NextResponse.json({ 
      error: 'Failed to get passkeys' 
    }, { status: 500 });
  }
} 