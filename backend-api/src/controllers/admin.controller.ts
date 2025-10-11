import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler } from '../middleware/error.js';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * Get admin analytics dashboard
   * GET /admin/analytics
   */
  getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const analytics = await this.adminService.getAnalytics();

    res.json({
      analytics: {
        users: analytics.users,
        waste: analytics.waste,
        points: analytics.points,
        nfts: analytics.nfts,
        system: analytics.system,
        recentActivity: analytics.recentActivity,
      },
    });
  });

  /**
   * Get system health status
   * GET /admin/health
   */
  getSystemHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const health = await this.adminService.getSystemHealth();

    res.json({
      health: {
        database: health.database,
        pendingOutboxEvents: health.pendingOutboxEvents,
        failedTransactions: health.failedTransactions,
        expiredSessions: health.expiredSessions,
        errorDevices: health.errorDevices,
        overall: health.overall,
      },
    });
  });

  /**
   * Get admin actions log
   * GET /admin/actions
   */
  getAdminActions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { actions, total } = await this.adminService.getAdminActions(page, limit);

    res.json({
      actions: actions.map(action => ({
        id: action.id,
        action: action.action,
        payload: action.payload,
        occurredAt: action.occurredAt,
        adminUser: action.adminUser,
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
   * Get recycling stations
   * GET /admin/stations
   */
  getRecyclingStations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const stations = await this.adminService.getRecyclingStations();

    res.json({
      stations: stations.map(station => ({
        code: station.code,
        name: station.name,
        location: station.location,
        metadata: station.metadata,
        isActive: station.isActive,
        createdAt: station.createdAt,
        updatedAt: station.updatedAt,
        stats: {
          devices: station._count.devices,
          wasteEvents: station._count.wasteEvents,
        },
      })),
    });
  });

  /**
   * Create recycling station (admin only)
   * POST /admin/stations
   */
  createRecyclingStation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const station = await this.adminService.createRecyclingStation(input, adminUserId);

    res.status(201).json({
      message: 'Recycling station created successfully',
      station: {
        code: station.code,
        name: station.name,
        location: station.location,
        metadata: station.metadata,
        isActive: station.isActive,
        createdAt: station.createdAt,
        updatedAt: station.updatedAt,
      },
    });
  });

  /**
   * Get devices
   * GET /admin/devices
   */
  getDevices = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const devices = await this.adminService.getDevices();

    res.json({
      devices: devices.map(device => ({
        id: device.id,
        stationCode: device.stationCode,
        hwId: device.hwId,
        status: device.status,
        metadata: device.metadata,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
        station: device.station,
        stats: {
          wasteEvents: device._count.wasteEvents,
        },
      })),
    });
  });

  /**
   * Create device (admin only)
   * POST /admin/devices
   */
  createDevice = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const device = await this.adminService.createDevice(input, adminUserId);

    res.status(201).json({
      message: 'Device created successfully',
      device: {
        id: device.id,
        stationCode: device.stationCode,
        hwId: device.hwId,
        status: device.status,
        metadata: device.metadata,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
      },
    });
  });

  /**
   * Update device status (admin only)
   * PUT /admin/devices/:id/status
   */
  updateDeviceStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const adminUserId = (req as any).user?.id;
    const { status } = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const device = await this.adminService.updateDeviceStatus(id, status, adminUserId);

    res.json({
      message: 'Device status updated successfully',
      device: {
        id: device.id,
        stationCode: device.stationCode,
        hwId: device.hwId,
        status: device.status,
        metadata: device.metadata,
        updatedAt: device.updatedAt,
      },
    });
  });

  /**
   * Get system logs
   * GET /admin/logs
   */
  getSystemLogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 50;

    const logs = await this.adminService.getSystemLogs(limit);

    res.json({
      logs: {
        loginEvents: logs.loginEvents,
        adminActions: logs.adminActions,
      },
    });
  });

  /**
   * Clean up expired data (admin only)
   * POST /admin/cleanup
   */
  cleanupExpiredData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const result = await this.adminService.cleanupExpiredData(adminUserId);

    res.json({
      message: 'Expired data cleanup completed',
      result: {
        expiredSessions: result.expiredSessions,
        expiredLoginEvents: result.expiredLoginEvents,
      },
    });
  });

  /**
   * Get blockchain transaction statistics
   * GET /admin/blockchain/stats
   */
  getBlockchainStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    // This would typically be handled by the tx service
    // For now, we'll return a placeholder response
    res.json({
      message: 'Blockchain statistics endpoint - implement via tx service',
    });
  });
}
