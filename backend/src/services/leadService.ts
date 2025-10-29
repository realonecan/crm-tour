import { prisma } from '../prisma/client';
import { LeadStatus } from '../../generated/prisma';

/**
 * Get all leads with optional filters
 */
export const getAllLeads = async (filters?: {
  status?: LeadStatus;
  assignedTo?: number;
  q?: string;
}) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.assignedTo) {
    where.assignedTo = filters.assignedTo;
  }

  if (filters?.q) {
    where.OR = [
      { name: { contains: filters.q, mode: 'insensitive' } },
      { phone: { contains: filters.q, mode: 'insensitive' } },
      { email: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return await prisma.lead.findMany({
    where,
    include: {
      tour: true,
      assigned: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get lead by ID
 */
export const getLeadById = async (id: number) => {
  return await prisma.lead.findUnique({
    where: { id },
    include: {
      tour: true,
      assigned: true,
    },
  });
};

/**
 * Create a new lead
 */
export const createLead = async (data: {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  tourId?: number;
}) => {
  return await prisma.lead.create({
    data,
    include: {
      tour: true,
    },
  });
};

/**
 * Update lead
 */
export const updateLead = async (
  id: number,
  data: {
    status?: LeadStatus;
    assignedTo?: number | null;
    message?: string;
  }
) => {
  return await prisma.lead.update({
    where: { id },
    data,
    include: {
      tour: true,
      assigned: true,
    },
  });
};

/**
 * Delete lead
 */
export const deleteLead = async (id: number) => {
  return await prisma.lead.delete({
    where: { id },
  });
};

/**
 * Convert lead to booking
 */
export const convertLeadToBooking = async (
  leadId: number,
  bookingData: {
    tourDateId: number;
    people: number;
    note?: string;
  }
) => {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    throw new Error('Lead not found');
  }

  // Find or create customer
  let customer = await prisma.customer.findUnique({
    where: { phone: lead.phone },
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        fullName: lead.name,
        phone: lead.phone,
        email: lead.email,
      },
    });
  }

  // Calculate price
  const tourDate = await prisma.tourDate.findUnique({
    where: { id: bookingData.tourDateId },
    include: { tour: true },
  });

  if (!tourDate) {
    throw new Error('Tour date not found');
  }

  const pricePerPerson = tourDate.priceOverride ?? tourDate.tour.basePrice;
  const totalPrice = pricePerPerson * bookingData.people;

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      tourDateId: bookingData.tourDateId,
      customerId: customer.id,
      people: bookingData.people,
      totalPrice,
      note: bookingData.note,
    },
    include: {
      customer: true,
      tourDate: {
        include: {
          tour: true,
        },
      },
    },
  });

  // Update lead status to CLOSED
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: 'CLOSED' },
  });

  return { booking, bookingId: booking.id };
};
