import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler, createError } from '../middleware/error.js';
import { getClientIp, getUserAgent } from '../middleware/auth.js';
import type { RegisterInput, LoginInput } from '../validators/auth.schemas.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   * POST /auth/register
   */
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: RegisterInput = req.body;
    const ip = getClientIp(req);
    const userAgent = getUserAgent(req);

    const { user, token } = await this.authService.register(input, ip, userAgent);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
        roles: user.userRoles.map((ur: any) => ur.roleCode),
      },
      token,
    });
  });

  /**
   * Login user
   * POST /auth/login
   */
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: LoginInput = req.body;
    const ip = getClientIp(req);
    const userAgent = getUserAgent(req);

    const { user, token } = await this.authService.login(input, ip, userAgent);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        lastLoginAt: user.lastLoginAt,
        roles: user.userRoles.map((ur: any) => ur.roleCode),
      },
      token,
    });
  });

  /**
   * Logout user
   * POST /auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const sessionId = req.headers['x-session-id'] as string;
    const userId = (req as any).user?.id;

    if (!sessionId || !userId) {
      throw createError('Session information required', 400);
    }

    await this.authService.logout(sessionId, userId);

    res.json({
      message: 'Logout successful',
    });
  });

  /**
   * Get current user profile
   * GET /auth/me
   */
  me = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const user = await this.authService.getUserProfile(userId);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.userRoles.map((ur: any) => ({
          code: ur.roleCode,
          assignedAt: ur.assignedAt,
        })),
        wallets: user.wallets,
        pointBalance: user.pointBalance,
        stats: {
          wasteEvents: user._count.wasteEvents,
          nftClaims: user._count.nftClaims,
        },
      },
    });
  });

  /**
   * Refresh JWT token
   * POST /auth/refresh
   */
  refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    // Get fresh user data
    const user = await this.authService.getUserProfile(userId);

    // Generate new token
    const { signJwt } = await import('../utils/crypto.js');
    const token = signJwt({
      sub: user.id,
      email: user.email,
      roles: user.userRoles.map((ur: any) => ur.roleCode),
    });

    res.json({
      message: 'Token refreshed successfully',
      token,
    });
  });

  /**
   * Get login events for current user
   * GET /auth/login-events
   */
  getLoginEvents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const loginEvents = await this.authService.getLoginEvents(userId, limit);

    res.json({
      loginEvents: loginEvents.map(event => ({
        id: event.id,
        occurredAt: event.occurredAt,
        success: event.success,
        reason: event.reason,
        ip: event.ip,
        userAgent: event.userAgent,
      })),
    });
  });

  /**
   * Check authentication status
   * GET /auth/status
   */
  status = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({
        authenticated: false,
        message: 'Not authenticated',
      });
      return;
    }

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    });
  });
}
