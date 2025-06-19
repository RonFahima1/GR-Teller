import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { deletePasskey } from '@/lib/passkey';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await deletePasskey(id, session.user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Passkey deleted successfully' 
    });
  } catch (error) {
    console.error('Delete passkey error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete passkey' 
    }, { status: 500 });
  }
} 