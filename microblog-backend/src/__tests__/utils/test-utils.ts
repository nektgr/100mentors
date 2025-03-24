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

// Test post data with a constant date for consistent test results
export const testPost = {
  id: 1,
  content: 'This is a test post',
  createdAt: new Date('2023-01-01T00:00:00Z'), // Fixed date for consistent serialization
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
