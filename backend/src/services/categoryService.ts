import { prisma } from '../prisma/client';
import { Category } from '../../generated/prisma';

/**
 * Get all categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  return await prisma.category.findMany({
    orderBy: { title: 'asc' },
  });
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: number): Promise<Category | null> => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

/**
 * Create a new category
 */
export const createCategory = async (data: {
  title: string;
  slug: string;
  icon?: string;
  color?: string;
}): Promise<Category> => {
  return await prisma.category.create({
    data,
  });
};

/**
 * Update a category
 */
export const updateCategory = async (
  id: number,
  data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Category> => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: number): Promise<Category> => {
  return await prisma.category.delete({
    where: { id },
  });
};
