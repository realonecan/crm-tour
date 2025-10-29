import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { ApiError } from './errorHandler';

/**
 * Role-based access control middleware
 * Restricts access to specific user roles
 * @param allowedRoles - Array of roles that can access the route
 */
export const roleGuard = (allowedRoles: ('ADMIN' | 'MANAGER')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ApiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        'FORBIDDEN',
        'You do not have permission to access this resource',
        403
      );
    }

    next();
  };
};
