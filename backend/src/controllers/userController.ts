import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as userService from '../services/userService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/users
 * Get all users (Admin only)
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  sendSuccess(res, users);
});

/**
 * GET /api/v1/users/:id
 * Get user by ID
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userService.getUserById(id);

  if (!user) {
    return sendError(res, 'NOT_FOUND', 'User not found', 404);
  }

  sendSuccess(res, user);
});

/**
 * POST /api/v1/users
 * Create a new user (Admin only)
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role) {
    return sendError(res, 'VALIDATION_ERROR', 'Name, email, and role are required', 400);
  }

  if (!['ADMIN', 'MANAGER'].includes(role)) {
    return sendError(res, 'VALIDATION_ERROR', 'Role must be ADMIN or MANAGER', 400);
  }

  const user = await userService.createUser({
    name,
    email,
    role,
    password,
  });

  sendSuccess(res, user, 201);
});

/**
 * PATCH /api/v1/users/:id
 * Update user details (Admin only)
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  if (role && !['ADMIN', 'MANAGER'].includes(role)) {
    return sendError(res, 'VALIDATION_ERROR', 'Role must be ADMIN or MANAGER', 400);
  }

  const user = await userService.updateUser(id, {
    name,
    email,
    role,
  });

  sendSuccess(res, user);
});

/**
 * DELETE /api/v1/users/:id
 * Delete a user (Admin only)
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await userService.deleteUser(id);
  sendSuccess(res, { message: 'User deleted successfully' });
});
