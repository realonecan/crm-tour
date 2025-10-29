import { Router } from 'express';
import * as leadController from '../controllers/leadController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All lead routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/leads - Get all leads
 */
router.get('/', leadController.getLeads);

/**
 * GET /api/v1/leads/:id - Get lead by ID
 */
router.get('/:id', leadController.getLeadById);

/**
 * POST /api/v1/leads - Create lead
 */
router.post('/', leadController.createLead);

/**
 * PATCH /api/v1/leads/:id - Update lead
 */
router.patch('/:id', leadController.updateLead);

/**
 * PUT /api/v1/leads/:id - Update lead
 */
router.put('/:id', leadController.updateLead);

/**
 * DELETE /api/v1/leads/:id - Delete lead
 */
router.delete('/:id', leadController.deleteLead);

/**
 * POST /api/v1/leads/:id/convert-to-booking - Convert lead to booking
 */
router.post('/:id/convert-to-booking', leadController.convertLeadToBooking);

export default router;
