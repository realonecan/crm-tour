import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import * as categoryService from '../services/categoryService';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * GET /api/v1/categories
 * Get all categories
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendSuccess(res, categories);
});

/**
 * POST /api/v1/categories
 * Create a new category
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { title, slug, icon, color } = req.body;

  if (!title || !slug) {
    return sendError(res, 'VALIDATION_ERROR', 'Title and slug are required', 400);
  }

  const category = await categoryService.createCategory({
    title,
    slug,
    icon,
    color,
  });

  sendSuccess(res, category, 201);
});

/**
 * PATCH /api/v1/categories/:id
 * Update a category
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { title, slug, icon, color } = req.body;

  const category = await categoryService.updateCategory(id, {
    title,
    slug,
    icon,
    color,
  });

  sendSuccess(res, category);
});

/**
 * DELETE /api/v1/categories/:id
 * Delete a category
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await categoryService.deleteCategory(id);
  sendSuccess(res, { message: 'Category deleted successfully' });
});
