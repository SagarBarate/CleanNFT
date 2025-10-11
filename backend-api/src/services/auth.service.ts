import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword, signJwt, generateSessionId } from '../utils/crypto.js';
import { getPrismaClient } from '../libs/db.js';
import { logger, logAuthEvent } from '../libs/logger.js';
import { createError, conflictError, unauthorizedError } from '../middleware/error.js';
import type { RegisterInput, LoginInput } from '../validators/auth.schemas.js';

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Register a new user with email and password
   */
  async register(input: RegisterInput, ip?: string, userAgent?: string): Promise<{ user: any; token: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw conflictError('User with this email already exists');
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user with password auth account
      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          displayName: input.displayName,
          authAccounts: {
            create: {
              provider: 'PASSWORD',
              providerUid: input.email,
              passwordHash,
            },
          },
          userRoles: {
            create: {
              roleCode: 'USER',
            },
          },
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          createdAt: true,
          userRoles: {
            select: {
              roleCode: true,
            },
          },
        },
      });

      // Generate JWT token
      const token = signJwt({
        sub: user.id,
        email: user.email,
        roles: user.userRoles.map(ur => ur.roleCode),
      });

      // Log registration event
      await this.logLoginEvent(user.id, input.email, true, 'Registration successful', ip, userAgent);
      logAuthEvent('register', true, input.email, user.id);

      logger.info({
        userId: user.id,
        email: input.email,
      }, 'User registered successfully');

      return { user, token };
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        throw error;
      }
      
      logger.error({ error, email: input.email }, 'User registration failed');
      throw createError('Registration failed', 500);
    }
  }

  /**
   * Login user with email and password
   */
  async login(input: LoginInput, ip?: string, userAgent?: string): Promise<{ user: any; token: string }> {
    try {
      // Find user with password auth account
      const user = await this.prisma.user.findUnique({
        where: { email: input.email },
        include: {
          authAccounts: {
            where: { provider: 'PASSWORD' },
          },
          userRoles: {
            select: {
              roleCode: true,
            },
          },
        },
      });

      if (!user || !user.authAccounts.length) {
        await this.logLoginEvent(null, input.email, false, 'User not found', ip, userAgent);
        throw unauthorizedError('Invalid email or password');
      }

      if (!user.isActive) {
        await this.logLoginEvent(user.id, input.email, false, 'Account inactive', ip, userAgent);
        throw unauthorizedError('Account is inactive');
      }

      // Verify password
      const authAccount = user.authAccounts[0];
      if (!authAccount.passwordHash) {
        await this.logLoginEvent(user.id, input.email, false, 'No password set', ip, userAgent);
        throw unauthorizedError('Invalid email or password');
      }

      const isValidPassword = await verifyPassword(authAccount.passwordHash, input.password);
      if (!isValidPassword) {
        await this.logLoginEvent(user.id, input.email, false, 'Invalid password', ip, userAgent);
        throw unauthorizedError('Invalid email or password');
      }

      // Generate JWT token
      const token = signJwt({
        sub: user.id,
        email: user.email,
        roles: user.userRoles.map(ur => ur.roleCode),
      });

      // Create session record
      const sessionId = generateSessionId();
      await this.prisma.session.create({
        data: {
          id: sessionId,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          ip,
          userAgent,
        },
      });

      // Log successful login
      await this.logLoginEvent(user.id, input.email, true, 'Login successful', ip, userAgent);
      logAuthEvent('login', true, input.email, user.id);

      // Return user data without sensitive information
      const { authAccounts, ...userData } = user;

      logger.info({
        userId: user.id,
        email: input.email,
        ip,
      }, 'User logged in successfully');

      return { user: userData, token };
    } catch (error) {
      if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('inactive'))) {
        throw error;
      }
      
      logger.error({ error, email: input.email }, 'User login failed');
      throw createError('Login failed', 500);
    }
  }

  /**
   * Logout user by invalidating session
   */
  async logout(sessionId: string, userId: string): Promise<void> {
    try {
      await this.prisma.session.delete({
        where: { id: sessionId },
      });

      logAuthEvent('logout', true, undefined, userId);
      logger.info({ userId, sessionId }, 'User logged out successfully');
    } catch (error) {
      logger.error({ error, userId, sessionId }, 'User logout failed');
      throw createError('Logout failed', 500);
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          displayName: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          userRoles: {
            select: {
              roleCode: true,
              assignedAt: true,
            },
          },
          wallets: {
            select: {
              id: true,
              address: true,
              network: true,
              isPrimary: true,
              createdAt: true,
            },
          },
          pointBalance: {
            select: {
              points: true,
              updatedAt: true,
            },
          },
          _count: {
            select: {
              wasteEvents: true,
              nftClaims: true,
            },
          },
        },
      });

      if (!user) {
        throw createError('User not found', 404);
      }

      return user;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get user profile');
      throw createError('Failed to get user profile', 500);
    }
  }

  /**
   * Log login event to database
   */
  private async logLoginEvent(
    userId: string | null,
    email: string | null,
    success: boolean,
    reason: string,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await this.prisma.loginEvent.create({
        data: {
          userId,
          email,
          success,
          reason,
          ip,
          userAgent,
        },
      });
    } catch (error) {
      // Don't throw error for logging failures
      logger.error({ error }, 'Failed to log login event');
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const result = await this.prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      if (result.count > 0) {
        logger.info({ count: result.count }, 'Cleaned up expired sessions');
      }

      return result.count;
    } catch (error) {
      logger.error({ error }, 'Failed to cleanup expired sessions');
      return 0;
    }
  }

  /**
   * Get login events for a user
   */
  async getLoginEvents(userId: string, limit: number = 10): Promise<any[]> {
    try {
      return await this.prisma.loginEvent.findMany({
        where: { userId },
        orderBy: { occurredAt: 'desc' },
        take: limit,
        select: {
          id: true,
          occurredAt: true,
          success: true,
          reason: true,
          ip: true,
          userAgent: true,
        },
      });
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get login events');
      throw createError('Failed to get login events', 500);
    }
  }
}
