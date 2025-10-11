import { z } from 'zod';

/**
 * User registration schema
 */
export const registerSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email too long')
    .toLowerCase()
    .transform(val => val.trim()),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name too long')
    .transform(val => val.trim()),
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(val => val.trim()),
  password: z.string()
    .min(1, 'Password is required'),
});

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .transform(val => val.trim()),
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  token: z.string()
    .min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

/**
 * Wallet connection schema
 */
export const walletConnectionSchema = z.object({
  address: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
    .transform(val => val.toLowerCase()),
  network: z.string()
    .min(1, 'Network is required')
    .max(50, 'Network name too long'),
  signature: z.string()
    .min(1, 'Signature is required'),
  message: z.string()
    .min(1, 'Message is required'),
});

/**
 * Update profile schema
 */
export const updateProfileSchema = z.object({
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(100, 'Display name too long')
    .transform(val => val.trim())
    .optional(),
  isActive: z.boolean()
    .optional(),
});

/**
 * Assign role schema (admin only)
 */
export const assignRoleSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),
  roleCode: z.string()
    .min(1, 'Role code is required')
    .max(50, 'Role code too long'),
});

/**
 * Remove role schema (admin only)
 */
export const removeRoleSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),
  roleCode: z.string()
    .min(1, 'Role code is required')
    .max(50, 'Role code too long'),
});

/**
 * Type exports for use in controllers
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type WalletConnectionInput = z.infer<typeof walletConnectionSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type RemoveRoleInput = z.infer<typeof removeRoleSchema>;
