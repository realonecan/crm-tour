import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as userService from '../services/userService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'VALIDATION_ERROR', 'Email and password are required', 400);
  }

  try {
    const { token, ...user } = await userService.login(email, password);
    sendSuccess(res, { token, user });
  } catch (error: any) {
    return sendError(res, 'UNAUTHORIZED', error.message, 401);
  }
});

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
