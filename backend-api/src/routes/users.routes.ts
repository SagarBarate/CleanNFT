import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
import { updateProfileSchema, changePasswordSchema, assignRoleSchema, removeRoleSchema } from '../validators/auth.schemas.js';
import { validateRequest } from '../middleware/validation.js';

export const usersRoutes = Router();
const usersController = new UsersController();

/**
 * User management routes
 */

// Update user profile
usersRoutes.put('/users/profile',
  authenticateToken,
  generalLimiter,
  validateRequest(updateProfileSchema),
  usersController.updateProfile
);

// Change user password
usersRoutes.put('/users/password',
  authenticateToken,
  generalLimiter,
  validateRequest(changePasswordSchema),
  usersController.changePassword
);

// Connect wallet to user account
usersRoutes.post('/users/wallets',
  authenticateToken,
  generalLimiter,
  usersController.connectWallet
);

// Get user's wallets
usersRoutes.get('/users/wallets',
  authenticateToken,
  generalLimiter,
  usersController.getUserWallets
);

// Get all users (admin only)
usersRoutes.get('/users',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  usersController.getAllUsers
);

// Get user by ID (admin only)
usersRoutes.get('/users/:id',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  usersController.getUserById
);

// Assign role to user (admin only)
usersRoutes.post('/users/:id/roles',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  validateRequest(assignRoleSchema),
  usersController.assignRole
);

// Remove role from user (admin only)
usersRoutes.delete('/users/:id/roles/:roleCode',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  usersController.removeRole
);

// Get user statistics (admin only)
usersRoutes.get('/users/stats',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  usersController.getUserStats
);
