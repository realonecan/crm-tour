import { prisma } from '../prisma/client';
import { UserRole } from '../../generated/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Get all users
 */
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Create a new user
 */
export const createUser = async (data: {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}) => {
  // Hash password if provided
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
  
  return await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update user
 */
export const updateUser = async (
  id: number,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
  }
) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Delete user
 */
export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

/**
 * Login with email and password
 */
export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);

  if (!user || !user.password) {
    throw new Error('Invalid email or password');
  }

  // Verify password using bcrypt
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const secret = process.env.JWT_SECRET || 'supersecret';
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

/**
 * Demo login - generates JWT token
 */
export const demoLogin = async (role: UserRole) => {
  // Find or create demo user
  const email = role === 'ADMIN' ? 'admin@demo.com' : 'manager@demo.com';
  const name = role === 'ADMIN' ? 'Admin User' : 'Manager User';

  let user = await getUserByEmail(email);

  if (!user) {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });
  }

  // Generate JWT token
  const secret = process.env.JWT_SECRET || 'supersecret';
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: '7d' }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};
