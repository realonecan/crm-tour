import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All booking routes require authentication
router.use(authMiddleware);

/**
 * GET /api/v1/bookings - Get all bookings
 */
router.get('/', bookingController.getBookings);

/**
 * GET /api/v1/bookings/:id - Get booking by ID
 */
router.get('/:id', bookingController.getBookingById);

/**
 * POST /api/v1/bookings - Create booking
 */
router.post('/', bookingController.createBooking);

/**
 * PATCH /api/v1/bookings/:id/status - Update booking status
 */
router.patch('/:id/status', bookingController.updateBookingStatus);

/**
 * PATCH /api/v1/bookings/:id - Update booking details
 */
router.patch('/:id', bookingController.updateBooking);

export default router;
