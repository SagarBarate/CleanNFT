import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';
import { logger } from '../libs/logger.js';

/**
 * Custom rate limit key generator
 * Uses IP address and optional user ID for authenticated requests
 */
function customKeyGenerator(req: Request): string {
  const ip = req.ip || 'unknown';
  const userId = (req as any).user?.id;
  return userId ? `user_${userId}` : `ip_${ip}`;
}

/**
 * Rate limit handler
 */
function rateLimitHandler(req: Request, res: Response): void {
  const key = customKeyGenerator(req);
  logger.warn({
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.id,
    key,
  }, 'Rate limit exceeded');

  res.status(429).json({
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: Math.round(req.rateLimit?.resetTime ? (req.rateLimit.resetTime - Date.now()) / 1000 : 60),
  });
}

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP/user
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP/user to 100 requests per windowMs
  keyGenerator: customKeyGenerator,
  handler: rateLimitHandler,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Authentication rate limiter
 * 5 login attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  keyGenerator: (req) => req.ip || 'unknown',
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Registration rate limiter
 * 3 registration attempts per hour per IP
 */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration requests per hour
  keyGenerator: (req) => req.ip || 'unknown',
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many registration attempts',
    code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Waste event rate limiter
 * 50 waste events per hour per user
 */
export const wasteEventLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each user to 50 waste events per hour
  keyGenerator: customKeyGenerator,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many waste events',
    code: 'WASTE_EVENT_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * NFT claim rate limiter
 * 10 NFT claims per hour per user
 */
export const nftClaimLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each user to 10 NFT claims per hour
  keyGenerator: customKeyGenerator,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many NFT claim attempts',
    code: 'NFT_CLAIM_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Admin operations rate limiter
 * 100 admin operations per hour per admin user
 */
export const adminLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each admin to 100 operations per hour
  keyGenerator: customKeyGenerator,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many admin operations',
    code: 'ADMIN_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Strict rate limiter for sensitive operations
 * 3 attempts per hour per IP
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 attempts per hour
  keyGenerator: (req) => req.ip || 'unknown',
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many attempts',
    code: 'STRICT_RATE_LIMIT_EXCEEDED',
  },
});
