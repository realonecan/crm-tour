import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';

/**
 * Script to hash existing plain text passwords in the database
 */
async function hashExistingPasswords() {
  try {
    console.log('🔄 Starting password hashing...');

    // Get all users with passwords
    const users = await prisma.user.findMany({
      where: {
        password: {
          not: null,
        },
      },
    });

    console.log(`📊 Found ${users.length} users with passwords`);

    for (const user of users) {
      if (!user.password) continue;

      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
        console.log(`✅ User ${user.email} already has hashed password`);
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Update the user
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`✅ Hashed password for user: ${user.email}`);
    }

    console.log('✅ Password hashing completed successfully!');
  } catch (error) {
    console.error('❌ Error hashing passwords:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
hashExistingPasswords();
