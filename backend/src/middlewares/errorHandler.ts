import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responses';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Global error handler middleware
 * Catches all errors and returns standardized error responses
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Handle custom API errors
  if (err instanceof ApiError) {
    sendError(res, err.code, err.message, err.statusCode, err.fields);
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      sendError(res, 'DUPLICATE_ERROR', 'A record with this value already exists', 409);
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'NOT_FOUND', 'Record not found', 404);
      return;
    }
  }

  // Handle validation errors (Zod)
  if (err.name === 'ZodError') {
    const zodError = err as any;
    const fields: Record<string, string> = {};
    zodError.errors?.forEach((e: any) => {
      const field = e.path.join('.');
      fields[field] = e.message;
    });
    sendError(res, 'VALIDATION_ERROR', 'Validation failed', 400, fields);
    return;
  }

  // Default server error
  sendError(res, 'INTERNAL_ERROR', 'An unexpected error occurred', 500);
};

/**
 * Async handler wrapper to catch promise rejections
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
