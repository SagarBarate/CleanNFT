import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createError } from './error.js';

/**
 * Request validation middleware using Zod schemas
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      if (schema && req.body) {
        req.body = schema.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map(err => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });
        
        res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          message: messages.join(', '),
        });
        return;
      }
      
      next(createError('Validation failed', 400));
    }
  };
}

/**
 * Validate query parameters
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map(err => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });
        
        res.status(400).json({
          error: 'Query validation failed',
          code: 'QUERY_VALIDATION_ERROR',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          message: messages.join(', '),
        });
        return;
      }
      
      next(createError('Query validation failed', 400));
    }
  };
}

/**
 * Validate path parameters
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map(err => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        });
        
        res.status(400).json({
          error: 'Parameter validation failed',
          code: 'PARAM_VALIDATION_ERROR',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          message: messages.join(', '),
        });
        return;
      }
      
      next(createError('Parameter validation failed', 400));
    }
  };
}

/**
 * Sanitize request body to remove potentially harmful content
 */
export function sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    next();
  } catch (error) {
    next(createError('Request sanitization failed', 400));
  }
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip potentially dangerous keys
      if (key.startsWith('__') || key.startsWith('$')) {
        continue;
      }
      
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  // Sanitize strings
  if (typeof obj === 'string') {
    return obj
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim();
  }
  
  return obj;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  if (page < 1) {
    res.status(400).json({
      error: 'Page must be greater than 0',
      code: 'INVALID_PAGE',
    });
    return;
  }
  
  if (limit < 1 || limit > 100) {
    res.status(400).json({
      error: 'Limit must be between 1 and 100',
      code: 'INVALID_LIMIT',
    });
    return;
  }
  
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  
  next();
}
