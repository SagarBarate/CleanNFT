import { Router } from 'express';
import { PointsController } from '../controllers/points.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { generalLimiter } from '../middleware/rateLimit.js';
import { manualPointAdjustmentSchema, createPointRuleSchema, updatePointRuleSchema } from '../validators/waste.schemas.js';
import { validateRequest } from '../middleware/validation.js';

export const pointsRoutes = Router();
const pointsController = new PointsController();

/**
 * Points system routes
 */

// Get user's current point balance
pointsRoutes.get('/points/balance',
  authenticateToken,
  generalLimiter,
  pointsController.getPointBalance
);

// Get user's point ledger with pagination
pointsRoutes.get('/points/ledger',
  authenticateToken,
  generalLimiter,
  pointsController.getPointLedger
);

// Get user's point summary
pointsRoutes.get('/points/summary',
  authenticateToken,
  generalLimiter,
  pointsController.getPointSummary
);

// Get user's point history for date range
pointsRoutes.get('/points/history',
  authenticateToken,
  generalLimiter,
  pointsController.getPointHistory
);

// Manual point adjustment (admin only)
pointsRoutes.post('/points/adjust',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  validateRequest(manualPointAdjustmentSchema),
  pointsController.manualPointAdjustment
);

// Get all point rules (admin only)
pointsRoutes.get('/points/rules',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  pointsController.getPointRules
);

// Create point rule (admin only)
pointsRoutes.post('/points/rules',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  validateRequest(createPointRuleSchema),
  pointsController.createPointRule
);

// Update point rule (admin only)
pointsRoutes.put('/points/rules/:code',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  validateRequest(updatePointRuleSchema),
  pointsController.updatePointRule
);

// Get point statistics (admin only)
pointsRoutes.get('/points/stats',
  authenticateToken,
  requireAdmin,
  generalLimiter,
  pointsController.getPointStats
);
