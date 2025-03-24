import { getPosts, createPost, deletePost } from '../../controllers/post.controller';
import { mockRequestWithUser, mockResponse, testPost } from '../utils/test-utils';
import { prisma } from '../setup';

describe('Post Controller', () => {
  describe('getPosts', () => {
    it('should return all posts', async () => {
      const req = {};
      const res = mockResponse();
      const mockPosts = [testPost];

      (prisma.post.findMany as jest.Mock).mockResolvedValueOnce(mockPosts);

      await getPosts(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should handle errors when fetching posts', async () => {
      const req = {};
      const res = mockResponse();
      const error = new Error('Database error');

      (prisma.post.findMany as jest.Mock).mockRejectedValueOnce(error);

      await getPosts(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unable to fetch posts' });
    });
  });

  describe('createPost', () => {
    it('should return 400 if content is not provided', async () => {
      const req = mockRequestWithUser();
      req.body = {};
      const res = mockResponse();

      await createPost(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Content is required' });
    });

    it('should create a new post', async () => {
      const req = mockRequestWithUser();
      req.body = { content: 'Test content' };
      const res = mockResponse();

      (prisma.post.create as jest.Mock).mockResolvedValueOnce(testPost);

      await createPost(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(testPost);
      expect(req.app.get('io').emit).toHaveBeenCalledWith('post:created', testPost);
    });

    it('should handle errors when creating posts', async () => {
      const req = mockRequestWithUser();
      req.body = { content: 'Test content' };
      const res = mockResponse();
      const error = new Error('Database error');

      (prisma.post.create as jest.Mock).mockRejectedValueOnce(error);

      await createPost(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unable to create post' });
    });
  });

  describe('deletePost', () => {
    it('should return 404 if post is not found', async () => {
      const req = mockRequestWithUser();
      req.params = { id: '1' };
      const res = mockResponse();

      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await deletePost(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should return 403 if user is not the author', async () => {
      const req = mockRequestWithUser();
      req.params = { id: '1' };
      const res = mockResponse();
      const postWithDifferentAuthor = { ...testPost, userId: 999 };

      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(postWithDifferentAuthor);

      await deletePost(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not authorized to delete this post' });
    });

    it('should delete a post', async () => {
      const req = mockRequestWithUser();
      req.params = { id: '1' };
      const res = mockResponse();

      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(testPost);
      (prisma.post.delete as jest.Mock).mockResolvedValueOnce(testPost);

      await deletePost(req as any, res as any);

      expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(req.app.get('io').emit).toHaveBeenCalledWith('post:deleted', 1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });

    it('should handle errors when deleting posts', async () => {
      const req = mockRequestWithUser();
      req.params = { id: '1' };
      const res = mockResponse();
      const error = new Error('Database error');

      (prisma.post.findUnique as jest.Mock).mockResolvedValueOnce(testPost);
      (prisma.post.delete as jest.Mock).mockRejectedValueOnce(error);

      await deletePost(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unable to delete post' });
    });
  });
});
