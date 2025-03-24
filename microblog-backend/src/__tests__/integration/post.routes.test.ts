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
