import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as leadService from '../services/leadService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/leads
 * Get all leads with optional filters
 */
export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, assignedTo, q } = req.query;

  const filters: any = {};
  if (status) filters.status = status;
  if (assignedTo) filters.assignedTo = parseInt(assignedTo as string);
  if (q) filters.q = q as string;

  const leads = await leadService.getAllLeads(filters);
  sendSuccess(res, leads);
});

/**
 * GET /api/v1/leads/:id
 * Get lead by ID
 */
export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const lead = await leadService.getLeadById(id);

  if (!lead) {
    return sendError(res, 'NOT_FOUND', 'Lead not found', 404);
  }

  sendSuccess(res, lead);
});

/**
 * POST /api/v1/leads
 * Create a new lead
 */
export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, message, tourId } = req.body;

  if (!name || !phone) {
    return sendError(res, 'VALIDATION_ERROR', 'Name and phone are required', 400);
  }

  const lead = await leadService.createLead({
    name,
    phone,
    email,
    message,
    tourId: tourId ? parseInt(tourId) : undefined,
  });

  sendSuccess(res, lead, 201);
});

/**
 * PATCH /api/v1/leads/:id
 * Update lead details
 */
export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status, assignedTo, message } = req.body;

  const updateData: any = {};
  if (status) {
    if (!['OPEN', 'IN_PROGRESS', 'CLOSED'].includes(status)) {
      return sendError(
        res,
        'VALIDATION_ERROR',
        'Invalid status. Must be OPEN, IN_PROGRESS, or CLOSED',
        400
      );
    }
    updateData.status = status;
  }
  if (assignedTo !== undefined) {
    updateData.assignedTo = assignedTo ? parseInt(assignedTo) : null;
  }
  if (message !== undefined) updateData.message = message;

  const lead = await leadService.updateLead(id, updateData);
  sendSuccess(res, lead);
});

/**
 * DELETE /api/v1/leads/:id
 * Delete lead
 */
export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await leadService.deleteLead(id);
  sendSuccess(res, { message: 'Lead deleted successfully' });
});

/**
 * POST /api/v1/leads/:id/convert-to-booking
 * Convert a lead to a booking
 */
export const convertLeadToBooking = asyncHandler(async (req: Request, res: Response) => {
  const leadId = parseInt(req.params.id);
  const { tourDateId, people, note } = req.body;

  if (!tourDateId || !people) {
    return sendError(res, 'VALIDATION_ERROR', 'tourDateId and people are required', 400);
  }

  const result = await leadService.convertLeadToBooking(leadId, {
    tourDateId: parseInt(tourDateId),
    people: parseInt(people),
    note,
  });

  sendSuccess(res, result, 201);
});
