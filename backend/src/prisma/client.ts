import { PrismaClient } from '../../generated/prisma';

/**
 * Global Prisma Client instance
 * Ensures single instance across hot reloads in development
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Gracefully disconnect Prisma on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
