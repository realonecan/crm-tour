import { Router } from 'express';
import * as tourController from '../controllers/tourController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleGuard } from '../middlewares/roleGuard';

const router = Router();

// All tour routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/tours - Get all tours
 */
router.get('/', tourController.getTours);

/**
 * GET /api/v1/tours/:id - Get tour by ID
 */
router.get('/:id', tourController.getTourById);

/**
 * POST /api/v1/tours - Create tour
 */
router.post('/', roleGuard(['ADMIN', 'MANAGER']), tourController.createTour);

/**
 * PATCH /api/v1/tours/:id - Update tour
 */
router.patch('/:id', roleGuard(['ADMIN', 'MANAGER']), tourController.updateTour);

/**
 * PATCH /api/v1/tours/:id/publish - Publish/unpublish tour
 */
router.patch('/:id/publish', roleGuard(['ADMIN', 'MANAGER']), tourController.updateTourStatus);

/**
 * POST /api/v1/tours/:id/gallery - Update tour gallery
 */
router.post('/:id/gallery', roleGuard(['ADMIN', 'MANAGER']), tourController.updateTourGallery);

/**
 * DELETE /api/v1/tours/:id - Delete tour
 */
router.delete('/:id', roleGuard(['ADMIN', 'MANAGER']), tourController.deleteTour);

/**
 * POST /api/v1/tours/:id/dates - Add tour date
 */
router.post('/:id/dates', roleGuard(['ADMIN', 'MANAGER']), tourController.addTourDate);

export default router;
