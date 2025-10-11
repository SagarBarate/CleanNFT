import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../libs/logger.js';
import { isDevelopment } from '../config/env.js';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR', isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create a new API error
 */
export function createError(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR'): ApiError {
  return new ApiError(message, statusCode, code);
}

/**
 * Handle Prisma database errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ApiError {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = error.meta?.target as string[] | undefined;
      return createError(
        `Duplicate entry for ${field?.join(', ') || 'field'}`,
        409,
        'DUPLICATE_ENTRY'
      );
    
    case 'P2025':
      // Record not found
      return createError('Record not found', 404, 'NOT_FOUND');
    
    case 'P2003':
      // Foreign key constraint violation
      return createError('Invalid reference', 400, 'INVALID_REFERENCE');
    
    case 'P2014':
      // Required relation violation
      return createError('Required relation missing', 400, 'MISSING_RELATION');
    
    default:
      logger.error({ error }, 'Unhandled Prisma error');
      return createError('Database operation failed', 500, 'DATABASE_ERROR');
  }
}

/**
 * Handle Zod validation errors
 */
function handleZodError(error: ZodError): ApiError {
  const messages = error.errors.map(err => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
  
  return createError(
    `Validation failed: ${messages.join(', ')}`,
    400,
    'VALIDATION_ERROR'
  );
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let apiError: ApiError;

  // Convert known error types to ApiError
  if (error instanceof ApiError) {
    apiError = error;
  } else if (error instanceof ZodError) {
    apiError = handleZodError(error);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = handlePrismaError(error);
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    logger.error({ error }, 'Unknown Prisma error');
    apiError = createError('Database operation failed', 500, 'DATABASE_ERROR');
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    logger.error({ error }, 'Prisma validation error');
    apiError = createError('Invalid data format', 400, 'VALIDATION_ERROR');
  } else {
    // Unknown error
    logger.error({ 
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    }, 'Unhandled error');
    
    apiError = createError(
      isDevelopment ? error.message : 'Internal server error',
      500,
      'INTERNAL_ERROR',
      false
    );
  }

  // Log error details
  if (apiError.statusCode >= 500) {
    logger.error({
      error: apiError.message,
      code: apiError.code,
      stack: apiError.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }, 'Server error');
  } else {
    logger.warn({
      error: apiError.message,
      code: apiError.code,
      url: req.url,
      method: req.method,
      ip: req.ip,
    }, 'Client error');
  }

  // Send error response
  const response: any = {
    error: apiError.message,
    code: apiError.code,
  };

  // Include stack trace in development
  if (isDevelopment && apiError.stack) {
    response.stack = apiError.stack;
  }

  // Include additional details for validation errors
  if (apiError.code === 'VALIDATION_ERROR' && error instanceof ZodError) {
    response.details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
  }

  res.status(apiError.statusCode).json(response);
}

/**
 * Handle 404 errors
 */
export function notFoundHandler(req: Request, res: Response): void {
  logger.warn({
    url: req.url,
    method: req.method,
    ip: req.ip,
  }, 'Route not found');

  res.status(404).json({
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.url,
  });
}

/**
 * Async error wrapper - catches async errors and passes them to error handler
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return (...args: T): Promise<R> => {
    const [req, res, next] = args;
    return Promise.resolve(fn(...args)).catch(next);
  };
}

/**
 * Validation error for specific fields
 */
export function validationError(message: string, field?: string): ApiError {
  return createError(message, 400, 'VALIDATION_ERROR');
}

/**
 * Not found error
 */
export function notFoundError(resource: string = 'Resource'): ApiError {
  return createError(`${resource} not found`, 404, 'NOT_FOUND');
}

/**
 * Unauthorized error
 */
export function unauthorizedError(message: string = 'Unauthorized'): ApiError {
  return createError(message, 401, 'UNAUTHORIZED');
}

/**
 * Forbidden error
 */
export function forbiddenError(message: string = 'Forbidden'): ApiError {
  return createError(message, 403, 'FORBIDDEN');
}

/**
 * Conflict error
 */
export function conflictError(message: string = 'Conflict'): ApiError {
  return createError(message, 409, 'CONFLICT');
}
