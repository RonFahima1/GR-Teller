// Mock @/lib/prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
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

// Mock jsonwebtoken
const mockSign = jest.fn(() => 'mock-jwt-token');
jest.mock('jsonwebtoken', () => ({
  sign: mockSign,
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { handleLogin } from '@/app/api/auth/login/route';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface LoginData {
  email: string;
  password: string;
}

// Mock Request
const createMockRequest = (body: LoginData): Request => {
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request;
};

// Ensure bcrypt.compare is a Jest mock
(bcrypt.compare as any) = jest.fn();
const mockCompare = bcrypt.compare as jest.Mock;

describe('Login API', () => {
  let prisma: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
  });

  it('should login successfully with valid credentials', async () => {
    const loginData: LoginData = {
      email: 'test@example.com',
      password: 'Test123456',
    };

    const mockUser: Partial<User> = {
      id: '1',
      email: loginData.email,
      name: 'Test User',
      password: 'hashedPassword',
      role: 'USER',
      failedAttempts: 0,
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockResolvedValue(mockUser as User);
    mockCompare.mockImplementationOnce(() => Promise.resolve(true));
    (prisma.user.update as jest.Mock<() => Promise<User>>).mockResolvedValue(mockUser as User);

    const req = createMockRequest(loginData);
    const response = await handleLogin(req, prisma, mockSign);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      },
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginData.email },
    });
    expect(mockCompare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: {
        failedAttempts: 0,
        lastLogin: expect.any(Date),
      },
    });
  });

  it('should return error for non-existent user', async () => {
    const loginData: LoginData = {
      email: 'nonexistent@example.com',
      password: 'Test123456',
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockResolvedValue(null);

    const req = createMockRequest(loginData);
    const response = await handleLogin(req, prisma, mockSign);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      message: 'Invalid email or password',
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginData.email },
    });
    expect(mockCompare).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should return error for invalid password', async () => {
    const loginData: LoginData = {
      email: 'test@example.com',
      password: 'WrongPassword',
    };

    const mockUser: Partial<User> = {
      id: '1',
      email: loginData.email,
      password: 'hashedPassword',
      failedAttempts: 0,
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockResolvedValue(mockUser as User);
    mockCompare.mockImplementationOnce(() => Promise.resolve(false));

    const req = createMockRequest(loginData);
    const response = await handleLogin(req, prisma, mockSign);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({
      message: 'Invalid email or password',
    });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginData.email },
    });
    expect(mockCompare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: {
        failedAttempts: 1,
      },
    });
  });

  it('should validate input data', async () => {
    const invalidData: LoginData = {
      email: 'invalid-email',
      password: 'short',
    };

    const req = createMockRequest(invalidData);
    const response = await handleLogin(req, prisma, mockSign);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('message', 'Invalid input data');
    expect(data).toHaveProperty('errors');
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockCompare).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('should handle server errors', async () => {
    const loginData: LoginData = {
      email: 'test@example.com',
      password: 'Test123456',
    };

    (prisma.user.findUnique as jest.Mock<() => Promise<User | null>>).mockRejectedValue(new Error('Database error'));

    const req = createMockRequest(loginData);
    const response = await handleLogin(req, prisma, mockSign);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: 'Internal server error',
    });
  });
}); 