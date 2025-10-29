import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as customerService from '../services/customerService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/customers
 * Get all customers with optional search
 */
export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;
  const customers = await customerService.getAllCustomers(q as string);
  sendSuccess(res, customers);
});

/**
 * GET /api/v1/customers/:id
 * Get customer by ID with activity timeline
 */
export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const customer = await customerService.getCustomerById(id);

  if (!customer) {
    return sendError(res, 'NOT_FOUND', 'Customer not found', 404);
  }

  sendSuccess(res, customer);
});

/**
 * POST /api/v1/customers
 * Create a new customer
 */
export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, phone, email, telegram } = req.body;

  if (!fullName || !phone) {
    return sendError(res, 'VALIDATION_ERROR', 'fullName and phone are required', 400);
  }

  const customer = await customerService.createCustomer({
    fullName,
    phone,
    email,
    telegram,
  });

  sendSuccess(res, customer, 201);
});

/**
 * PATCH /api/v1/customers/:id
 * Update customer details
 */
export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { fullName, email, telegram } = req.body;

  const customer = await customerService.updateCustomer(id, {
    fullName,
    email,
    telegram,
  });

  sendSuccess(res, customer);
});

/**
 * DELETE /api/v1/customers/:id
 * Delete customer
 */
export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await customerService.deleteCustomer(id);
  sendSuccess(res, { message: 'Customer deleted successfully' });
});

/**
 * GET /api/v1/customers/:id/timeline
 * Get customer timeline (bookings history)
 */
export const getCustomerTimeline = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const timeline = await customerService.getCustomerTimeline(id);
  sendSuccess(res, timeline);
});
