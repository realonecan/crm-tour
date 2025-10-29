import { Response } from 'express';

/**
 * Standard success response format
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

/**
 * Send a standardized success response
 * @param res - Express response object
 * @param data - Response data
 * @param statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = <T>(res: Response, data: T, statusCode: number = 200): void => {
  res.status(statusCode).json({
    success: true,
    data,
  } as SuccessResponse<T>);
};

/**
 * Send a standardized error response
 * @param res - Express response object
 * @param code - Error code
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @param fields - Optional field-specific errors
 */
export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  fields?: Record<string, string>
): void => {
  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(fields && { fields }),
    },
  } as ErrorResponse);
};
