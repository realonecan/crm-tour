import { prisma } from '../prisma/client';
import { Tour, TourStatus, TourDate } from '../../generated/prisma';

/**
 * Get all tours with optional filters
 */
export const getAllTours = async (filters?: {
  q?: string;
  status?: TourStatus;
  categoryId?: number;
}) => {
  const where: any = {};

  if (filters?.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  return await prisma.tour.findMany({
    where,
    include: {
      category: true,
      tourDates: {
        where: {
          date: { gte: new Date() },
        },
        orderBy: { date: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get tour by ID
 */
export const getTourById = async (id: number) => {
  return await prisma.tour.findUnique({
    where: { id },
    include: {
      category: true,
      tourDates: {
        orderBy: { date: 'asc' },
      },
    },
  });
};

/**
 * Create a new tour
 */
export const createTour = async (data: {
  title: string;
  slug: string;
  type: string;
  duration: number;
  difficulty: string;
  basePrice: number;
  categoryId: number;
  cover?: string;
  description?: string;
  inclusions?: string[];
  exclusions?: string[];
  meetingPoint?: string;
}) => {
  return await prisma.tour.create({
    data: {
      ...data,
      inclusions: data.inclusions ? JSON.stringify(data.inclusions) : null,
      exclusions: data.exclusions ? JSON.stringify(data.exclusions) : null,
    },
    include: {
      category: true,
    },
  });
};

/**
 * Update tour
 */
export const updateTour = async (
  id: number,
  data: Partial<Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>>
) => {
  return await prisma.tour.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

/**
 * Update tour status (publish/unpublish)
 */
export const updateTourStatus = async (id: number, status: TourStatus) => {
  return await prisma.tour.update({
    where: { id },
    data: { status },
  });
};

/**
 * Update tour gallery
 */
export const updateTourGallery = async (id: number, gallery: string[]) => {
  return await prisma.tour.update({
    where: { id },
    data: { gallery: JSON.stringify(gallery) },
  });
};

/**
 * Delete tour
 */
export const deleteTour = async (id: number) => {
  return await prisma.tour.delete({
    where: { id },
  });
};

/**
 * Add a tour date
 */
export const addTourDate = async (data: {
  tourId: number;
  date: Date;
  maxGroupSize: number;
  priceOverride?: number;
}): Promise<TourDate> => {
  return await prisma.tourDate.create({
    data,
  });
};

/**
 * Delete a tour date
 */
export const deleteTourDate = async (id: number): Promise<TourDate> => {
  return await prisma.tourDate.delete({
    where: { id },
  });
};
