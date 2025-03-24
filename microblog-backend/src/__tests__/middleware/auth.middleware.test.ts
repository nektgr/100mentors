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
