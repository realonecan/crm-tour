import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as bookingService from '../services/bookingService';
import * as customerService from '../services/customerService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/bookings
 * Get all bookings with optional filters
 */
export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const { status, tourId, from, to, q } = req.query;

  const filters: any = {};
  if (status) filters.status = status;
  if (tourId) filters.tourId = parseInt(tourId as string);
  if (from) filters.from = new Date(from as string);
  if (to) filters.to = new Date(to as string);
  if (q) filters.q = q as string;

  const bookings = await bookingService.getAllBookings(filters);
  sendSuccess(res, bookings);
});

/**
 * GET /api/v1/bookings/:id
 * Get booking by ID
 */
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const booking = await bookingService.getBookingById(id);

  if (!booking) {
    return sendError(res, 'NOT_FOUND', 'Booking not found', 404);
  }

  sendSuccess(res, booking);
});

/**
 * POST /api/v1/bookings
 * Create a new booking
 */
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const { tourDateId, customer, people, note } = req.body;

  // Validation
  if (!tourDateId || !customer || !people) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Required fields: tourDateId, customer, people',
      400
    );
  }

  if (!customer.fullName || !customer.phone) {
    return sendError(res, 'VALIDATION_ERROR', 'Customer fullName and phone are required', 400);
  }

  // Find or create customer
  const existingCustomer = await customerService.findOrCreateCustomer({
    fullName: customer.fullName,
    phone: customer.phone,
    email: customer.email,
    telegram: customer.telegram,
  });

  // Calculate price
  const totalPrice = await bookingService.calculateBookingPrice(
    parseInt(tourDateId),
    parseInt(people)
  );

  // Create booking
  const booking = await bookingService.createBooking({
    tourDateId: parseInt(tourDateId),
    customerId: existingCustomer.id,
    people: parseInt(people),
    totalPrice,
    note,
  });

  sendSuccess(res, booking, 201);
});

/**
 * PATCH /api/v1/bookings/:id/status
 * Update booking status
 */
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status || !['NEW', 'PAID', 'CANCELLED'].includes(status)) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Invalid status. Must be NEW, PAID, or CANCELLED',
      400
    );
  }

  const booking = await bookingService.updateBookingStatus(id, status);
  sendSuccess(res, booking);
});

/**
 * PATCH /api/v1/bookings/:id
 * Update booking details
 */
export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { people, note } = req.body;

  const updateData: any = {};
  if (people) {
    updateData.people = parseInt(people);
    // Recalculate price if people count changed
    const booking = await bookingService.getBookingById(id);
    if (booking) {
      updateData.totalPrice = await bookingService.calculateBookingPrice(
        booking.tourDateId,
        parseInt(people)
      );
    }
  }
  if (note !== undefined) updateData.note = note;

  const booking = await bookingService.updateBooking(id, updateData);
  sendSuccess(res, booking);
});
