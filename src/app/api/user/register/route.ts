import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, firstName, lastName, password } = await req.json();
  if (!token || !firstName || !lastName || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  // Find invitation
  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation) {
    return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
  }
  if (invitation.usedAt || invitation.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invitation expired or already used' }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email: invitation.email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  // Create user
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email: invitation.email,
      name: `${firstName} ${lastName}`,
      password: hashed,
      role: invitation.role,
      status: 'ACTIVE',
      createdBy: invitation.invitedBy ? String(invitation.invitedBy) : null,
      organizationId: invitation.organization || null,
      agentId: invitation.agentId || null,
    },
  });

  // Mark invitation as used
  await prisma.invitation.update({ where: { token }, data: { usedAt: new Date() } });

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
} 