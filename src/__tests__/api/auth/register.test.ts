// Mock @/lib/prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: { status?: number }) => ({
      status: (init && init.status) || 200,
      json: () => Promise.resolve(data),
    }),
  },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { handleRegister } from '@/app/api/auth/register/route';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Mock Request
const createMockRequest = (body: RegisterData): Request => {
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request;
};

(bcrypt.hash as any) = jest.fn();
const mockHash = bcrypt.hash as jest.Mock;

describe('Register API', () => {
  let prisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
  });

  it('should create a new user', async () => {
    const userData: RegisterData = {
      email: 'test@example.com',
      password: 'Test123456',
      name: 'Test User',
    };

    const mockUser: Partial<User> = {
      id: '1',
      email: userData.email,
      name: userData.name,
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockResolvedValue(null);
    (prisma.user.create as jest.Mock<() => Promise<User>>).mockResolvedValue(mockUser as User);
    mockHash.mockImplementationOnce(() => Promise.resolve('hashedPassword'));

    const req = createMockRequest(userData);
    const response = await handleRegister(req, prisma);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ message: 'User registered successfully' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        password: 'hashedPassword',
        name: userData.name,
        status: 'PENDING',
      },
    });
  });

  it('should return error if user already exists', async () => {
    const userData: RegisterData = {
      email: 'existing@example.com',
      password: 'Test123456',
      name: 'Test User',
    };

    const existingUser: Partial<User> = {
      id: '1',
      email: userData.email,
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockResolvedValue(existingUser as User);

    const req = createMockRequest(userData);
    const response = await handleRegister(req, prisma);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      message: 'User with this email already exists',
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should validate input data', async () => {
    const invalidData: RegisterData = {
      email: 'invalid-email',
      password: 'short',
      name: 'Test User',
    };

    const req = createMockRequest(invalidData);
    const response = await handleRegister(req, prisma);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('message', 'Invalid input data');
    expect(data).toHaveProperty('errors');
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should handle server errors', async () => {
    const userData: RegisterData = {
      email: 'test@example.com',
      password: 'Test123456',
      name: 'Test User',
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockRejectedValue(new Error('Database error'));

    const req = createMockRequest(userData);
    const response = await handleRegister(req, prisma);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: 'Internal server error',
    });
  });
}); 