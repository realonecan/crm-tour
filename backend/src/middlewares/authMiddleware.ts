import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

/**
 * Extended Request interface with user data
 */
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'ADMIN' | 'MANAGER';
  };
}

/**
 * Authentication middleware
 * Validates JWT token and attaches user data to request
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('UNAUTHORIZED', 'No token provided', 401);
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'supersecret';

    // Verify and decode token
    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      role: 'ADMIN' | 'MANAGER';
    };

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('UNAUTHORIZED', 'Invalid token', 401));
    } else {
      next(error);
    }
  }
};
