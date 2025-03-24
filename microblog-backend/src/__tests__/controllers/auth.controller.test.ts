import { login, getProfile } from '../../controllers/auth.controller';
import { mockRequestWithUser, mockResponse, testUser } from '../utils/test-utils';
import { prisma } from '../setup';

describe('Auth Controller', () => {
  describe('login', () => {
    it('should return 400 if email is not provided', async () => {
      const req = { body: {} };
      const res = mockResponse();

      await login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email is required' });
    });

    it('should return 401 if user is not found', async () => {
      const req = { body: { email: 'nonexistent@example.com' } };
      const res = mockResponse();

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return token and user data for valid email', async () => {
      const req = { body: { email: 'test@example.com' } };
      const res = mockResponse();

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(testUser);

      await login(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith({
        token: 'mock-jwt-token',
        user: {
          id: testUser.id,
          name: testUser.name,
          email: testUser.email
        }
      });
    });

    it('should handle database errors', async () => {
      const req = { body: { email: 'test@example.com' } };
      const res = mockResponse();
      const error = new Error('Database error');

      (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(error);

      await login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to login' });
    });
  });

  describe('getProfile', () => {
    it('should return 401 if user is not authenticated', async () => {
      const req = { user: undefined };
      const res = mockResponse();

      await getProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not authenticated' });
    });

    it('should return 404 if user is not found', async () => {
      const req = { user: { id: 999 } };
      const res = mockResponse();

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await getProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return user data if authenticated and found', async () => {
      const req = mockRequestWithUser();
      const res = mockResponse();

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(testUser);

      await getProfile(req as any, res as any);

      expect(res.json).toHaveBeenCalledWith({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email
      });
    });

    it('should handle database errors', async () => {
      const req = mockRequestWithUser();
      const res = mockResponse();
      const error = new Error('Database error');

      (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(error);

      await getProfile(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch user profile' });
    });
  });
});
