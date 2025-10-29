import { Router } from 'express';
import * as customerController from '../controllers/customerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All customer routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/customers - Get all customers
 */
router.get('/', customerController.getCustomers);

/**
 * GET /api/v1/customers/:id - Get customer by ID
 */
router.get('/:id', customerController.getCustomerById);

/**
 * POST /api/v1/customers - Create customer
 */
router.post('/', customerController.createCustomer);

/**
 * PATCH /api/v1/customers/:id - Update customer
 */
router.patch('/:id', customerController.updateCustomer);

/**
 * PUT /api/v1/customers/:id - Update customer
 */
router.put('/:id', customerController.updateCustomer);

/**
 * DELETE /api/v1/customers/:id - Delete customer
 */
router.delete('/:id', customerController.deleteCustomer);

/**
 * GET /api/v1/customers/:id/timeline - Get customer timeline
 */
router.get('/:id/timeline', customerController.getCustomerTimeline);

export default router;
