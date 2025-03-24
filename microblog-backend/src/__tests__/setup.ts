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
