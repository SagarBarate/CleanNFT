import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/crypto.js';
import { getPrismaClient } from '../libs/db.js';
import { logger } from '../libs/logger.js';
import { createError, notFoundError, unauthorizedError } from '../middleware/error.js';
import type { UpdateProfileInput, ChangePasswordInput, AssignRoleInput, RemoveRoleInput } from '../validators/auth.schemas.js';

export class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(input.displayName && { displayName: input.displayName }),
          ...(input.isActive !== undefined && { isActive: input.isActive }),
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          isActive: true,
          lastLoginAt: true,
          updatedAt: true,
          userRoles: {
            select: {
              roleCode: true,
            },
          },
        },
      });

      logger.info({ userId, updates: input }, 'User profile updated');
      return user;
    } catch (error) {
      logger.error({ error, userId, input }, 'Failed to update user profile');
      throw createError('Failed to update profile', 500);
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    try {
      // Get user's password auth account
      const authAccount = await this.prisma.authAccount.findFirst({
        where: {
          userId,
          provider: 'PASSWORD',
        },
      });

      if (!authAccount || !authAccount.passwordHash) {
        throw notFoundError('Password account not found');
      }

      // Verify current password
      const isValidPassword = await verifyPassword(authAccount.passwordHash, input.currentPassword);
      if (!isValidPassword) {
        throw unauthorizedError('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await hashPassword(input.newPassword);

      // Update password
      await this.prisma.authAccount.update({
        where: { id: authAccount.id },
        data: { passwordHash: newPasswordHash },
      });

      logger.info({ userId }, 'User password changed successfully');
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('incorrect'))) {
        throw error;
      }
      
      logger.error({ error, userId }, 'Failed to change password');
      throw createError('Failed to change password', 500);
    }
  }

  /**
   * Connect wallet to user account
   */
  async connectWallet(userId: string, address: string, network: string, isPrimary: boolean = false): Promise<any> {
    try {
      // If this is set as primary, unset other primary wallets for this user
      if (isPrimary) {
        await this.prisma.wallet.updateMany({
          where: { userId },
          data: { isPrimary: false },
        });
      }

      const wallet = await this.prisma.wallet.create({
        data: {
          userId,
          address,
          network,
          isPrimary,
        },
        select: {
          id: true,
          address: true,
          network: true,
          isPrimary: true,
          createdAt: true,
        },
      });

      logger.info({ userId, address, network, isPrimary }, 'Wallet connected successfully');
      return wallet;
    } catch (error) {
      logger.error({ error, userId, address, network }, 'Failed to connect wallet');
      throw createError('Failed to connect wallet', 500);
    }
  }

  /**
   * Get user's wallets
   */
  async getUserWallets(userId: string): Promise<any[]> {
    try {
      return await this.prisma.wallet.findMany({
        where: { userId },
        select: {
          id: true,
          address: true,
          network: true,
          isPrimary: true,
          createdAt: true,
        },
        orderBy: [
          { isPrimary: 'desc' },
          { createdAt: 'asc' },
        ],
      });
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get user wallets');
      throw createError('Failed to get wallets', 500);
    }
  }

  /**
   * Assign role to user (admin only)
   */
  async assignRole(input: AssignRoleInput, adminUserId: string): Promise<void> {
    try {
      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw notFoundError('User not found');
      }

      // Check if role exists
      const role = await this.prisma.role.findUnique({
        where: { code: input.roleCode },
      });

      if (!role) {
        throw notFoundError('Role not found');
      }

      // Assign role (Prisma will handle duplicate key constraint)
      await this.prisma.userRole.create({
        data: {
          userId: input.userId,
          roleCode: input.roleCode,
          assignedBy: adminUserId,
        },
      });

      // Log admin action
      await this.logAdminAction(adminUserId, 'ASSIGN_ROLE', {
        targetUserId: input.userId,
        roleCode: input.roleCode,
      });

      logger.info({ adminUserId, targetUserId: input.userId, roleCode: input.roleCode }, 'Role assigned successfully');
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw error;
      }
      
      logger.error({ error, input, adminUserId }, 'Failed to assign role');
      throw createError('Failed to assign role', 500);
    }
  }

  /**
   * Remove role from user (admin only)
   */
  async removeRole(input: RemoveRoleInput, adminUserId: string): Promise<void> {
    try {
      await this.prisma.userRole.delete({
        where: {
          userId_roleCode: {
            userId: input.userId,
            roleCode: input.roleCode,
          },
        },
      });

      // Log admin action
      await this.logAdminAction(adminUserId, 'REMOVE_ROLE', {
        targetUserId: input.userId,
        roleCode: input.roleCode,
      });

      logger.info({ adminUserId, targetUserId: input.userId, roleCode: input.roleCode }, 'Role removed successfully');
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to remove role');
      throw createError('Failed to remove role', 500);
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(page: number = 1, limit: number = 20): Promise<{ users: any[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          select: {
            id: true,
            email: true,
            displayName: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
            userRoles: {
              select: {
                roleCode: true,
              },
            },
            _count: {
              select: {
                wasteEvents: true,
                nftClaims: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count(),
      ]);

      return { users, total };
    } catch (error) {
      logger.error({ error }, 'Failed to get all users');
      throw createError('Failed to get users', 500);
    }
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId: string): Promise<any> {
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
              loginEvents: true,
            },
          },
        },
      });

      if (!user) {
        throw notFoundError('User not found');
      }

      return user;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get user by ID');
      throw createError('Failed to get user', 500);
    }
  }

  /**
   * Log admin action
   */
  private async logAdminAction(adminUserId: string, action: string, payload: Record<string, unknown>): Promise<void> {
    try {
      await this.prisma.adminAction.create({
        data: {
          adminUserId,
          action,
          payload,
        },
      });
    } catch (error) {
      // Don't throw error for logging failures
      logger.error({ error }, 'Failed to log admin action');
    }
  }
}
