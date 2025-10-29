import { prisma } from '../prisma/client';

/**
 * Get all customers with optional search
 */
export const getAllCustomers = async (q?: string) => {
  const where: any = {};

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
    ];
  }

  return await prisma.customer.findMany({
    where,
    include: {
      bookings: {
        include: {
          tourDate: {
            include: {
              tour: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get customer by ID with full activity timeline
 */
export const getCustomerById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          tourDate: {
            include: {
              tour: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!customer) {
    return null;
  }

  // Get leads associated with this customer's phone
  const leads = await prisma.lead.findMany({
    where: { phone: customer.phone },
    include: {
      tour: true,
      assigned: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    ...customer,
    leads,
  };
};

/**
 * Create a new customer
 */
export const createCustomer = async (data: {
  fullName: string;
  phone: string;
  email?: string;
  telegram?: string;
}) => {
  return await prisma.customer.create({
    data,
  });
};

/**
 * Update customer
 */
export const updateCustomer = async (
  id: number,
  data: {
    fullName?: string;
    email?: string;
    telegram?: string;
  }
) => {
  return await prisma.customer.update({
    where: { id },
    data,
  });
};

/**
 * Delete customer
 */
export const deleteCustomer = async (id: number) => {
  return await prisma.customer.delete({
    where: { id },
  });
};

/**
 * Get customer timeline (all bookings)
 */
export const getCustomerTimeline = async (id: number) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId: id },
    include: {
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

  return bookings;
};

/**
 * Find or create customer by phone
 */
export const findOrCreateCustomer = async (data: {
  fullName: string;
  phone: string;
  email?: string;
  telegram?: string;
}) => {
  let customer = await prisma.customer.findUnique({
    where: { phone: data.phone },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data,
    });
  }

  return customer;
};
