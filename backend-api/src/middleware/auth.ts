import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/crypto.js';
import { getPrismaClient } from '../libs/db.js';
import { logger } from '../libs/logger.js';

/**
 * Extended Request interface with user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user information to request
 */
export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    // Verify JWT token
    const decoded = verifyJwt(token);
    const userId = decoded.sub as string;

    if (!userId) {
      res.status(401).json({ 
        error: 'Invalid token payload',
        code: 'INVALID_TOKEN'
      });
      return;
    }

    // Get user with roles from database
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isActive: true,
        userRoles: {
          select: {
            roleCode: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ 
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    // Attach user information to request
    req.user = {
      id: user.id,
      email: user.email,
      roles: user.userRoles.map(ur => ur.roleCode),
    };

    next();
  } catch (error) {
    logger.warn({ 
      error: error instanceof Error ? error.message : String(error),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    }, 'Authentication failed');

    res.status(401).json({ 
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
}

/**
 * Authorization middleware - requires specific role
 * Must be used after authenticateToken middleware
 */
export function requireRole(requiredRole: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!req.user.roles.includes(requiredRole)) {
      logger.warn({
        userId: req.user.id,
        requiredRole,
        userRoles: req.user.roles,
      }, 'Access denied - insufficient permissions');

      res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
}

/**
 * Admin-only middleware
 * Requires ADMIN role
 */
export const requireAdmin = requireRole('ADMIN');

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export async function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token provided, continue without user info
      next();
      return;
    }

    // Try to verify and attach user info
    const decoded = verifyJwt(token);
    const userId = decoded.sub as string;

    if (userId) {
      const prisma = getPrismaClient();
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          isActive: true,
          userRoles: {
            select: {
              roleCode: true,
            },
          },
        },
      });

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          roles: user.userRoles.map(ur => ur.roleCode),
        };
      }
    }

    next();
  } catch (error) {
    // Token verification failed, but we don't fail the request
    // Just continue without user info
    logger.debug({ 
      error: error instanceof Error ? error.message : String(error) 
    }, 'Optional auth failed, continuing without user info');
    
    next();
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(req: Request): string {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         (req.connection as any)?.socket?.remoteAddress || 
         'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(req: Request): string {
  return req.get('User-Agent') || 'unknown';
}
