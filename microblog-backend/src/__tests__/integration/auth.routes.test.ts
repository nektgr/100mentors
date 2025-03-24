import request from 'supertest';
import express from 'express';
import { authRouter } from '../../routes/auth.routes';
import { prisma } from '../setup';
import { testUser } from '../utils/test-utils';

describe('Auth Routes', () => {
  let app: express.Application;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if email is not provided', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email is required');
    });

    it('should return 401 if user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return token and user data for valid email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(testUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toEqual({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email
      });
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Authentication required');
    });

    it('should return user data if authenticated', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(testUser);

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: testUser.id,
        name: testUser.name,
        email: testUser.email
      });
    });
  });
});
