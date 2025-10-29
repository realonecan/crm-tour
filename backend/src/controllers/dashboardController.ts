import { Request, Response } from 'express';
import { sendSuccess } from '../utils/responses';
import * as bookingService from '../services/bookingService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/dashboard/stats
 * Get dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const { range } = req.query;
  const validRange = ['1d', '7d', '30d'].includes(range as string) ? (range as '1d' | '7d' | '30d') : '7d';

  const stats = await bookingService.getDashboardStats(validRange);
  sendSuccess(res, stats);
});
