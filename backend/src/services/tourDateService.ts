import { prisma } from '../prisma/client';

/**
 * Get all tour dates with optional filters
 */
export const getAllTourDates = async (filters?: {
  tourId?: number;
  from?: Date;
  to?: Date;
}) => {
  const where: any = {};

  if (filters?.tourId) {
    where.tourId = filters.tourId;
  }

  if (filters?.from || filters?.to) {
    where.date = {};
    if (filters.from) where.date.gte = filters.from;
    if (filters.to) where.date.lte = filters.to;
  }

  return await prisma.tourDate.findMany({
    where,
    include: {
      tour: {
        include: {
          category: true,
        },
      },
      bookings: true,
    },
    orderBy: { date: 'asc' },
  });
};

/**
 * Get tour date by ID
 */
export const getTourDateById = async (id: number) => {
  return await prisma.tourDate.findUnique({
    where: { id },
    include: {
      tour: {
        include: {
          category: true,
        },
      },
      bookings: {
        include: {
          customer: true,
        },
      },
    },
  });
};

/**
 * Create a new tour date
 */
export const createTourDate = async (data: {
  tourId: number;
  date: Date;
  maxGroupSize: number;
  priceOverride?: number;
}) => {
  return await prisma.tourDate.create({
    data,
    include: {
      tour: true,
    },
  });
};

/**
 * Update tour date
 */
export const updateTourDate = async (
  id: number,
  data: {
    date?: Date;
    maxGroupSize?: number;
    priceOverride?: number | null;
  }
) => {
  return await prisma.tourDate.update({
    where: { id },
    data,
    include: {
      tour: true,
    },
  });
};

/**
 * Delete tour date
 */
export const deleteTourDate = async (id: number) => {
  return await prisma.tourDate.delete({
    where: { id },
  });
};
