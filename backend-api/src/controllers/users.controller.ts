import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler, createError } from '../middleware/error.js';
import type { 
  UpdateProfileInput, 
  ChangePasswordInput, 
  AssignRoleInput, 
  RemoveRoleInput 
} from '../validators/auth.schemas.js';

export class UsersController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Update user profile
   * PUT /users/profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const input: UpdateProfileInput = req.body;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const user = await this.userService.updateProfile(userId, input);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
        roles: user.userRoles.map((ur: any) => ur.roleCode),
      },
    });
  });

  /**
   * Change user password
   * PUT /users/password
   */
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const input: ChangePasswordInput = req.body;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    await this.userService.changePassword(userId, input);

    res.json({
      message: 'Password changed successfully',
    });
  });

  /**
   * Connect wallet to user account
   * POST /users/wallets
   */
  connectWallet = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const { address, network, isPrimary = false } = req.body;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const wallet = await this.userService.connectWallet(userId, address, network, isPrimary);

    res.status(201).json({
      message: 'Wallet connected successfully',
      wallet,
    });
  });

  /**
   * Get user's wallets
   * GET /users/wallets
   */
  getUserWallets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const wallets = await this.userService.getUserWallets(userId);

    res.json({
      wallets,
    });
  });

  /**
   * Get all users (admin only)
   * GET /users
   */
  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { users, total } = await this.userService.getAllUsers(page, limit);

    res.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        roles: user.userRoles.map((ur: any) => ur.roleCode),
        stats: {
          wasteEvents: user._count.wasteEvents,
          nftClaims: user._count.nftClaims,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  });

  /**
   * Get user by ID (admin only)
   * GET /users/:id
   */
  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await this.userService.getUserById(id);

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
          loginEvents: user._count.loginEvents,
        },
      },
    });
  });

  /**
   * Assign role to user (admin only)
   * POST /users/:id/roles
   */
  assignRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const adminUserId = (req as any).user?.id;
    const input: AssignRoleInput = {
      userId: id,
      roleCode: req.body.roleCode,
    };

    if (!adminUserId) {
      throw createError('Admin authentication required', 401);
    }

    await this.userService.assignRole(input, adminUserId);

    res.json({
      message: 'Role assigned successfully',
      userId: id,
      roleCode: input.roleCode,
    });
  });

  /**
   * Remove role from user (admin only)
   * DELETE /users/:id/roles/:roleCode
   */
  removeRole = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id, roleCode } = req.params;
    const adminUserId = (req as any).user?.id;
    const input: RemoveRoleInput = {
      userId: id,
      roleCode,
    };

    if (!adminUserId) {
      throw createError('Admin authentication required', 401);
    }

    await this.userService.removeRole(input, adminUserId);

    res.json({
      message: 'Role removed successfully',
      userId: id,
      roleCode,
    });
  });

  /**
   * Get user statistics (admin only)
   * GET /users/stats
   */
  getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // This would typically be handled by the admin service
    // For now, we'll return a basic response
    res.json({
      message: 'User statistics endpoint - implement via admin service',
    });
  });
}
