import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimit.js';

export const adminRoutes = Router();
const adminController = new AdminController();

/**
 * Admin routes - all require ADMIN role
 */

// Get admin analytics dashboard
adminRoutes.get('/admin/analytics',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getAnalytics
);

// Get system health status
adminRoutes.get('/admin/health',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getSystemHealth
);

// Get admin actions log
adminRoutes.get('/admin/actions',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getAdminActions
);

// Get recycling stations
adminRoutes.get('/admin/stations',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getRecyclingStations
);

// Create recycling station
adminRoutes.post('/admin/stations',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.createRecyclingStation
);

// Get devices
adminRoutes.get('/admin/devices',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getDevices
);

// Create device
adminRoutes.post('/admin/devices',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.createDevice
);

// Update device status
adminRoutes.put('/admin/devices/:id/status',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.updateDeviceStatus
);

// Get system logs
adminRoutes.get('/admin/logs',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getSystemLogs
);

// Clean up expired data
adminRoutes.post('/admin/cleanup',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.cleanupExpiredData
);

// Get blockchain transaction statistics
adminRoutes.get('/admin/blockchain/stats',
  authenticateToken,
  requireAdmin,
  adminLimiter,
  adminController.getBlockchainStats
);
