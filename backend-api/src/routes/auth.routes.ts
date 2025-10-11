import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { authLimiter, registrationLimiter } from '../middleware/rateLimit.js';
import { registerSchema, loginSchema } from '../validators/auth.schemas.js';
import { validateRequest } from '../middleware/validation.js';

export const authRoutes = Router();
const authController = new AuthController();

/**
 * Authentication routes
 */

// User registration
authRoutes.post('/auth/register', 
  registrationLimiter,
  validateRequest(registerSchema),
  authController.register
);

// User login
authRoutes.post('/auth/login',
  authLimiter,
  validateRequest(loginSchema),
  authController.login
);

// User logout
authRoutes.post('/auth/logout',
  authenticateToken,
  authController.logout
);

// Get current user profile
authRoutes.get('/auth/me',
  authenticateToken,
  authController.me
);

// Refresh JWT token
authRoutes.post('/auth/refresh',
  authenticateToken,
  authController.refresh
);

// Get login events for current user
authRoutes.get('/auth/login-events',
  authenticateToken,
  authController.getLoginEvents
);

// Check authentication status
authRoutes.get('/auth/status',
  optionalAuth,
  authController.status
);
