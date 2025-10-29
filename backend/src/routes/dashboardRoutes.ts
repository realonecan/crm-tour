import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/dashboard/stats - Get dashboard statistics
 */
router.get('/stats', dashboardController.getDashboardStats);

export default router;
