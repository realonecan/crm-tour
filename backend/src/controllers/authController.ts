import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as userService from '../services/userService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * POST /api/v1/auth/demo
 * Demo login - generates JWT token
 */
export const demoLogin = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;

  if (!role || !['ADMIN', 'MANAGER'].includes(role)) {
    return sendError(res, 'VALIDATION_ERROR', 'Role must be ADMIN or MANAGER', 400);
  }

  const { token, ...user } = await userService.demoLogin(role);
  sendSuccess(res, { token, user });
});
