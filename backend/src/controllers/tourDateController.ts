import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as tourDateService from '../services/tourDateService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/dates
 * Get all tour dates with optional filters
 */
export const getAllTourDates = asyncHandler(async (req: Request, res: Response) => {
  const { tourId, from, to } = req.query;

  const filters: any = {};
  if (tourId) filters.tourId = parseInt(tourId as string);
  if (from) filters.from = new Date(from as string);
  if (to) filters.to = new Date(to as string);

  const tourDates = await tourDateService.getAllTourDates(filters);
  sendSuccess(res, tourDates);
});

/**
 * GET /api/v1/dates/:id
 * Get tour date by ID
 */
export const getTourDateById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const tourDate = await tourDateService.getTourDateById(id);

  if (!tourDate) {
    return sendError(res, 'NOT_FOUND', 'Tour date not found', 404);
  }

  sendSuccess(res, tourDate);
});

/**
 * POST /api/v1/dates
 * Create a new tour date
 */
export const createTourDate = asyncHandler(async (req: Request, res: Response) => {
  const { tourId, date, maxGroupSize, priceOverride } = req.body;

  if (!tourId || !date || !maxGroupSize) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Required fields: tourId, date, maxGroupSize',
      400
    );
  }

  const tourDate = await tourDateService.createTourDate({
    tourId: parseInt(tourId),
    date: new Date(date),
    maxGroupSize: parseInt(maxGroupSize),
    priceOverride: priceOverride ? parseInt(priceOverride) : undefined,
  });

  sendSuccess(res, tourDate, 201);
});

/**
 * PUT /api/v1/dates/:id
 * Update tour date
 */
export const updateTourDate = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { date, maxGroupSize, priceOverride } = req.body;

  const updateData: any = {};
  if (date) updateData.date = new Date(date);
  if (maxGroupSize) updateData.maxGroupSize = parseInt(maxGroupSize);
  if (priceOverride !== undefined) updateData.priceOverride = priceOverride ? parseInt(priceOverride) : null;

  const tourDate = await tourDateService.updateTourDate(id, updateData);
  sendSuccess(res, tourDate);
});

/**
 * DELETE /api/v1/dates/:id
 * Delete tour date
 */
export const deleteTourDate = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await tourDateService.deleteTourDate(id);
  sendSuccess(res, { message: 'Tour date deleted successfully' });
});
