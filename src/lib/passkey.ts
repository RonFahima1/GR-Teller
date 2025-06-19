import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type VerifiedAuthenticationResponse,
  type VerifiedRegistrationResponse,
} from '@simplewebauthn/server';
import { prisma } from './prisma';
import redisClient from './redis';

const rpName = 'Global Remit Teller Portal';
const rpID = process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : 'localhost';
const origin = process.env.NEXTAUTH_URL || `https://${rpID}`;

const CHALLENGE_TTL = 300; // 5 minutes

export async function generatePasskeyRegistrationOptions(userId: string, userName: string, userDisplayName: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { passkeys: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: userId,
    userName,
    userDisplayName,
    excludeCredentials: user.passkeys.map((passkey) => ({
      id: Buffer.from(passkey.credentialId, 'base64'),
      type: 'public-key',
      transports: passkey.transports,
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    supportedAlgorithmIDs: [-7, -257], // ES256, RS256
  });

  // Store challenge in Redis
  await redisClient.setEx(`passkey:reg:${userId}`, CHALLENGE_TTL, options.challenge);

  return options;
}

export async function verifyPasskeyRegistration(
  userId: string,
  response: any
): Promise<VerifiedRegistrationResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Retrieve the challenge from Redis
  const expectedChallenge = await redisClient.get(`passkey:reg:${userId}`);
  await redisClient.del(`passkey:reg:${userId}`);
  if (!expectedChallenge) {
    throw new Error('Registration challenge not found or expired');
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

    // Save the passkey to the database
    await prisma.passkey.create({
      data: {
        userId,
        name: 'Default Passkey',
        credentialId: credentialID.toString('base64'),
        publicKey: credentialPublicKey.toString('base64'),
        signCount: counter,
        transports: response.response.transports || [],
      },
    });
  }

  return verification;
}

export async function generatePasskeyAuthenticationOptions(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { passkeys: true },
  });

  if (!user || user.passkeys.length === 0) {
    throw new Error('No passkeys found for user');
  }

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.passkeys.map((passkey) => ({
      id: Buffer.from(passkey.credentialId, 'base64'),
      type: 'public-key',
      transports: passkey.transports,
    })),
    userVerification: 'preferred',
  });

  // Store challenge in Redis
  await redisClient.setEx(`passkey:auth:${user.id}`, CHALLENGE_TTL, options.challenge);

  return options;
}

export async function verifyPasskeyAuthentication(
  email: string,
  response: any
): Promise<VerifiedAuthenticationResponse> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { passkeys: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const passkey = user.passkeys.find(
    (pk) => pk.credentialId === response.id
  );

  if (!passkey) {
    throw new Error('Passkey not found');
  }

  // Retrieve the challenge from Redis
  const expectedChallenge = await redisClient.get(`passkey:auth:${user.id}`);
  await redisClient.del(`passkey:auth:${user.id}`);
  if (!expectedChallenge) {
    throw new Error('Authentication challenge not found or expired');
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialPublicKey: Buffer.from(passkey.publicKey, 'base64'),
      credentialID: Buffer.from(passkey.credentialId, 'base64'),
      counter: passkey.signCount,
    },
  });

  if (verification.verified && verification.authenticationInfo) {
    // Update the sign count
    await prisma.passkey.update({
      where: { id: passkey.id },
      data: {
        signCount: verification.authenticationInfo.newCounter,
        lastUsed: new Date(),
      },
    });

    // Update user's last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
  }

  return verification;
}

export async function getUserPasskeys(userId: string) {
  return await prisma.passkey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deletePasskey(passkeyId: string, userId: string) {
  return await prisma.passkey.deleteMany({
    where: {
      id: passkeyId,
      userId,
    },
  });
} 