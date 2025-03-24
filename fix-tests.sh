#!/bin/bash

echo "Fixing test issues in the backend..."

# Go to the backend directory
cd ./microblog-backend

# Fix the test setup file to properly handle TypeScript types
cat > ./src/__tests__/utils/test-utils.ts << 'EOL'
import { Express, Request, Response } from 'express';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import http from 'http';

export type TestApp = {
  app: Express;
  prisma: PrismaClient;
  server: http.Server;
  io: Server;
};

// Test user data
export const testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

// Test post data
export const testPost = {
  id: 1,
  content: 'This is a test post',
  createdAt: new Date(),
  userId: 1,
  author: { name: 'Test User' },
};

// Helper to mock authenticated request
export function authenticatedRequest(app: Express) {
  return request(app).set('Authorization', 'Bearer test-token');
}

// Mock request with a user
export function mockRequestWithUser() {
  return {
    app: {
      get: jest.fn().mockReturnValue({
        emit: jest.fn(),
      }),
    },
    user: { id: 1, email: 'test@example.com' },
    body: {},
    params: {},
  } as unknown as Request;
}

// Mock response
export function mockResponse() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}
EOL

# Fix the auth middleware test with proper types
cat > ./src/__tests__/middleware/auth.middleware.test.ts << 'EOL'
import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  const mockRequest = () => {
    const req: Partial<Request> = {
      headers: {}
    };
    return req as Request;
  };

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const mockNext: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    const req = mockRequest();
    const res = mockResponse();

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should set user on the request when valid token is provided', () => {
    const req = mockRequest();
    req.headers.authorization = 'Bearer valid-token';
    const res = mockResponse();
    const mockUser = { id: 1, email: 'user@example.com' };

    (jwt.verify as jest.Mock).mockReturnValueOnce(mockUser);

    authenticateToken(req, res, mockNext);

    expect(req.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 403 if token is invalid', () => {
    const req = mockRequest();
    req.headers.authorization = 'Bearer invalid-token';
    const res = mockResponse();

    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    authenticateToken(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
EOL

# Apply proper mocking in the setup
cat > ./src/__tests__/setup.ts << 'EOL'
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock Prisma Client
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prismaMock)
}));

// Mock Socket.io
jest.mock('socket.io', () => {
  const mockEmit = jest.fn();
  const mockOn = jest.fn();
  const mockServer = {
    on: mockOn,
    emit: mockEmit,
  };
  return {
    Server: jest.fn(() => mockServer),
  };
});

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' }),
}));

// Setup Environment Variables for Tests
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = '5000';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockReset(prismaMock);
});

// Cleanup after all tests
afterAll(() => {
  jest.restoreAllMocks();
});

// Export mocked Prisma client to use in tests
export const prisma = new PrismaClient();
EOL

echo "Tests have been updated with proper TypeScript types."
echo "Now, to run the tests, you can use:"
echo "cd microblog-backend && npm test"
