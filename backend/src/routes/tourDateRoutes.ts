import { Router } from 'express';
import * as tourDateController from '../controllers/tourDateController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

// All tour date routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/dates - Get all tour dates
 */
router.get('/', tourDateController.getAllTourDates);

/**
 * GET /api/v1/dates/:id - Get tour date by ID
 */
router.get('/:id', tourDateController.getTourDateById);

/**
 * POST /api/v1/dates - Create tour date
 */
router.post('/', roleGuard(['ADMIN', 'MANAGER']), tourDateController.createTourDate);

/**
 * PUT /api/v1/dates/:id - Update tour date
 */
router.put('/:id', roleGuard(['ADMIN', 'MANAGER']), tourDateController.updateTourDate);

/**
 * DELETE /api/v1/dates/:id - Delete tour date
 */
router.delete('/:id', roleGuard(['ADMIN', 'MANAGER']), tourDateController.deleteTourDate);

export default router;
