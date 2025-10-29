import { prisma } from '../prisma/client';
import { BookingStatus } from '../../generated/prisma';

/**
 * Get all bookings with optional filters
 */
export const getAllBookings = async (filters?: {
  status?: BookingStatus;
  tourId?: number;
  from?: Date;
  to?: Date;
  q?: string;
}) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.tourId) {
    where.tourDate = {
      tourId: filters.tourId,
    };
  }

  if (filters?.from || filters?.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = filters.from;
    if (filters.to) where.createdAt.lte = filters.to;
  }

  if (filters?.q) {
    where.customer = {
      OR: [
        { fullName: { contains: filters.q, mode: 'insensitive' } },
        { phone: { contains: filters.q, mode: 'insensitive' } },
      ],
    };
  }

  return await prisma.booking.findMany({
    where,
    include: {
      customer: true,
      tourDate: {
        include: {
          tour: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get booking by ID
 */
export const getBookingById = async (id: number) => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      tourDate: {
        include: {
          tour: true,
        },
      },
    },
  });
};

/**
 * Create a new booking
 */
export const createBooking = async (data: {
  tourDateId: number;
  customerId: number;
  people: number;
  totalPrice: number;
  note?: string;
}) => {
  return await prisma.booking.create({
    data,
    include: {
      customer: true,
      tourDate: {
        include: {
          tour: true,
        },
      },
    },
  });
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (id: number, status: BookingStatus) => {
  return await prisma.booking.update({
    where: { id },
    data: { status },
    include: {
      customer: true,
    },
  });
};

/**
 * Update booking details
 */
export const updateBooking = async (
  id: number,
  data: {
    people?: number;
    totalPrice?: number;
    note?: string;
  }
) => {
  return await prisma.booking.update({
    where: { id },
    data,
    include: {
      customer: true,
      tourDate: {
        include: {
          tour: true,
        },
      },
    },
  });
};

/**
 * Calculate total price for a booking
 */
export const calculateBookingPrice = async (
  tourDateId: number,
  people: number
): Promise<number> => {
  const tourDate = await prisma.tourDate.findUnique({
    where: { id: tourDateId },
    include: { tour: true },
  });

  if (!tourDate) {
    throw new Error('Tour date not found');
  }

  const pricePerPerson = tourDate.priceOverride ?? tourDate.tour.basePrice;
  return pricePerPerson * people;
};

/**
 * Get dashboard statistics - updated version
 */
export const getDashboardStats = async (range: '1d' | '7d' | '30d' = '7d') => {
  const now = new Date();
  const startDate = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  switch (range) {
    case '1d':
      startDate.setDate(now.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
  }

  // Get bookings in range
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    include: {
      tourDate: {
        include: {
          tour: true,
        },
      },
    },
  });

  // Calculate stats
  const ordersToday = bookings.filter(
    (b) => b.createdAt >= todayStart
  ).length;

  const weeklyRevenue = bookings
    .filter((b) => b.status === 'PAID')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const activeTours = await prisma.tour.count({
    where: { status: 'PUBLISHED' },
  });

  const newLeads = await prisma.lead.count({
    where: {
      status: 'OPEN',
      createdAt: { gte: startDate },
    },
  });

  // Bookings over time (last 7 days)
  const bookingsOverTime = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = bookings.filter(
      (b) => b.createdAt.toISOString().split('T')[0] === dateStr
    ).length;
    bookingsOverTime.push({ date: dateStr, count });
  }

  // Bookings by status
  const bookingsByStatus = bookings.reduce(
    (acc: any, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    },
    { NEW: 0, PAID: 0, CANCELLED: 0 }
  );

  // Upcoming tours
  const upcomingTours = await prisma.tourDate.findMany({
    where: {
      date: { gte: now },
    },
    include: {
      tour: true,
      bookings: true,
    },
    orderBy: { date: 'asc' },
    take: 5,
  });

  const upcomingToursFormatted = upcomingTours.map((td) => ({
    id: td.id,
    tourTitle: td.tour.title,
    date: td.date,
    maxGroupSize: td.maxGroupSize,
    bookedCount: td.bookings.filter((b) => b.status !== 'CANCELLED').length,
  }));

  return {
    ordersToday,
    weeklyRevenue,
    activeTours,
    newLeads,
    bookingsOverTime,
    bookingsByStatus,
    upcomingTours: upcomingToursFormatted,
  };
};
