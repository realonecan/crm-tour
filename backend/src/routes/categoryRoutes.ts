import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

// All category routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/categories - Get all categories
 */
router.get('/', categoryController.getCategories);

/**
 * POST /api/v1/categories - Create category (Admin only)
 */
router.post('/', roleGuard(['ADMIN']), categoryController.createCategory);

/**
 * PATCH /api/v1/categories/:id - Update category (Admin only)
 */
router.patch('/:id', roleGuard(['ADMIN']), categoryController.updateCategory);

/**
 * DELETE /api/v1/categories/:id - Delete category (Admin only)
 */
router.delete('/:id', roleGuard(['ADMIN']), categoryController.deleteCategory);

export default router;
