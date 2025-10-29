import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

// All user routes require authentication and Admin role
router.use(authMiddleware);
router.use(roleGuard(['ADMIN']));

/**
 * GET /api/v1/users - Get all users
 */
router.get('/', userController.getUsers);

/**
 * GET /api/v1/users/:id - Get user by ID
 */
router.get('/:id', userController.getUserById);

/**
 * POST /api/v1/users - Create user
 */
router.post('/', userController.createUser);

/**
 * PATCH /api/v1/users/:id - Update user
 */
router.patch('/:id', userController.updateUser);

/**
 * DELETE /api/v1/users/:id - Delete user
 */
router.delete('/:id', userController.deleteUser);

export default router;
