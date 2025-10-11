import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Create structured logger instance
 * Uses pino for high-performance JSON logging
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.passwordHash',
      '*.password',
      '*.passwordHash',
      '*.token',
      '*.secret',
    ],
    remove: true,
  },
});

/**
 * Create a child logger with additional context
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log request details for API calls
 */
export function logRequest(method: string, url: string, userId?: string) {
  return logger.info({
    type: 'request',
    method,
    url,
    userId,
  }, `${method} ${url}`);
}

/**
 * Log response details for API calls
 */
export function logResponse(method: string, url: string, statusCode: number, duration: number, userId?: string) {
  return logger.info({
    type: 'response',
    method,
    url,
    statusCode,
    duration,
    userId,
  }, `${method} ${url} ${statusCode} - ${duration}ms`);
}

/**
 * Log authentication events
 */
export function logAuthEvent(event: 'login' | 'logout' | 'register', success: boolean, email?: string, userId?: string, reason?: string) {
  return logger.info({
    type: 'auth',
    event,
    success,
    email,
    userId,
    reason,
  }, `Auth ${event}: ${success ? 'success' : 'failed'}${reason ? ` - ${reason}` : ''}`);
}

/**
 * Log business events
 */
export function logBusinessEvent(event: string, userId?: string, metadata?: Record<string, unknown>) {
  return logger.info({
    type: 'business',
    event,
    userId,
    ...metadata,
  }, `Business event: ${event}`);
}

/**
 * Log system events
 */
export function logSystemEvent(event: string, metadata?: Record<string, unknown>) {
  return logger.info({
    type: 'system',
    event,
    ...metadata,
  }, `System event: ${event}`);
}
