const { PrismaClient } = require('./backend/generated/prisma');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function test() {
  try {
    console.log('Testing database connection...');
    const users = await prisma.user.findMany();
    console.log('Success! Found users:', users);
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
