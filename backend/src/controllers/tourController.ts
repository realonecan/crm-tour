import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as tourService from '../services/tourService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/tours
 * Get all tours with optional filters
 */
export const getTours = asyncHandler(async (req: Request, res: Response) => {
  const { q, status, categoryId } = req.query;

  const filters: any = {};
  if (q) filters.q = q as string;
  if (status) filters.status = status;
  if (categoryId) filters.categoryId = parseInt(categoryId as string);

  const tours = await tourService.getAllTours(filters);
  sendSuccess(res, tours);
});

/**
 * GET /api/v1/tours/:id
 * Get tour by ID
 */
export const getTourById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const tour = await tourService.getTourById(id);

  if (!tour) {
    return sendError(res, 'NOT_FOUND', 'Tour not found', 404);
  }

  sendSuccess(res, tour);
});

/**
 * POST /api/v1/tours
 * Create a new tour
 */
export const createTour = asyncHandler(async (req: Request, res: Response) => {
  const {
    title,
    slug,
    type,
    duration,
    difficulty,
    basePrice,
    categoryId,
    cover,
    description,
    inclusions,
    exclusions,
    meetingPoint,
  } = req.body;

  // Validation
  if (!title || !slug || !type || !duration || !difficulty || !basePrice || !categoryId) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Required fields: title, slug, type, duration, difficulty, basePrice, categoryId',
      400
    );
  }

  const tour = await tourService.createTour({
    title,
    slug,
    type,
    duration: parseInt(duration),
    difficulty,
    basePrice: parseInt(basePrice),
    categoryId: parseInt(categoryId),
    cover,
    description,
    inclusions,
    exclusions,
    meetingPoint,
  });

  sendSuccess(res, tour, 201);
});

/**
 * PATCH /api/v1/tours/:id
 * Update tour details
 */
export const updateTour = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updateData = req.body;

  const tour = await tourService.updateTour(id, updateData);
  sendSuccess(res, tour);
});

/**
 * PATCH /api/v1/tours/:id/publish
 * Publish or unpublish a tour
 */
export const updateTourStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status || !['DRAFT', 'PUBLISHED'].includes(status)) {
    return sendError(res, 'VALIDATION_ERROR', 'Invalid status. Must be DRAFT or PUBLISHED', 400);
  }

  const tour = await tourService.updateTourStatus(id, status);
  sendSuccess(res, tour);
});

/**
 * POST /api/v1/tours/:id/gallery
 * Update tour gallery
 */
export const updateTourGallery = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { gallery } = req.body;

  if (!Array.isArray(gallery)) {
    return sendError(res, 'VALIDATION_ERROR', 'Gallery must be an array of image URLs', 400);
  }

  const tour = await tourService.updateTourGallery(id, gallery);
  sendSuccess(res, tour);
});

/**
 * DELETE /api/v1/tours/:id
 * Delete a tour
 */
export const deleteTour = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await tourService.deleteTour(id);
  sendSuccess(res, { message: 'Tour deleted successfully' });
});

/**
 * POST /api/v1/tours/:id/dates
 * Add a tour date
 */
export const addTourDate = asyncHandler(async (req: Request, res: Response) => {
  const tourId = parseInt(req.params.id);
  const { date, maxGroupSize, priceOverride } = req.body;

  if (!date || !maxGroupSize) {
    return sendError(res, 'VALIDATION_ERROR', 'Date and maxGroupSize are required', 400);
  }

  const tourDate = await tourService.addTourDate({
    tourId,
    date: new Date(date),
    maxGroupSize: parseInt(maxGroupSize),
    priceOverride: priceOverride ? parseInt(priceOverride) : undefined,
  });

  sendSuccess(res, tourDate, 201);
});

/**
 * DELETE /api/v1/dates/:id
 * Delete a tour date
 */
export const deleteTourDate = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await tourService.deleteTourDate(id);
  sendSuccess(res, { message: 'Tour date deleted successfully' });
});
