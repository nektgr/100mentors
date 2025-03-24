#!/bin/bash

echo "Fixing post integration tests to handle date serialization..."

# Update test-utils.ts to use a consistent date
cat > ./microblog-backend/src/__tests__/utils/test-utils.ts << 'EOL'
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
EOL

# Update post.routes.test.ts to handle date serialization
cat > ./microblog-backend/src/__tests__/integration/post.routes.test.ts << 'EOL'
import request from 'supertest';
import express from 'express';
import { postRouter } from '../../routes/post.routes';
import { prisma } from '../setup';
import { testPost, testUser } from '../utils/test-utils';

// Mock the authentication middleware
jest.mock('../../middleware/auth.middleware', () => ({
  authenticateToken: (req: any, res: any, next: any) => {
    req.user = { id: 1, email: 'test@example.com' };
    next();
  }
}));

describe('Post Routes', () => {
  let app: express.Application;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.set('io', { emit: jest.fn() });
    app.use('/api/posts', postRouter);
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const mockPosts = [testPost];
      
      // Create a serialized version of testPost with date as string
      const serializedPost = {
        ...testPost,
        createdAt: testPost.createdAt.toISOString()
      };

      (prisma.post.findMany as jest.Mock).mockResolvedValueOnce([serializedPost]);

      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([serializedPost]);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      // Create a serialized version of testPost with date as string
      const serializedPost = {
        ...testPost,
        createdAt: testPost.createdAt.toISOString()
      };
      
      (prisma.post.create as jest.Mock).mockResolvedValueOnce(serializedPost);

      const response = await request(app)
        .post('/api/posts')
        .send({ content: 'Test content' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(serializedPost);
      expect(app.get('io').emit).toHaveBeenCalledWith('post:created', serializedPost);
    });

    it('should return 400 if content is not provided', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Content is required');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const serializedPost = {
        ...testPost,
        createdAt: testPost.createdAt.toISOString()
      };
      
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(serializedPost);
      (prisma.post.delete as jest.Mock).mockResolvedValueOnce(serializedPost);

      const response = await request(app).delete('/api/posts/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Post deleted successfully' });
      expect(app.get('io').emit).toHaveBeenCalledWith('post:deleted', 1);
    });

    it('should return 404 if post is not found', async () => {
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app).delete('/api/posts/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Post not found');
    });

    it('should return 403 if user is not the author', async () => {
      const postWithDifferentAuthor = { 
        ...testPost, 
        userId: 999,
        createdAt: testPost.createdAt.toISOString()
      };
      
      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(postWithDifferentAuthor);

      const response = await request(app).delete('/api/posts/1');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Not authorized to delete this post');
    });
  });
});
EOL

echo "Post integration tests fixed!"
echo ""
echo "Run 'cd microblog-backend && npm test' to verify all tests pass."
