import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../libs/db.js';
import { logger } from '../libs/logger.js';
import { createError, notFoundError } from '../middleware/error.js';

export class AdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Get admin analytics dashboard data
   */
  async getAnalytics(): Promise<any> {
    try {
      const [
        // User statistics
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        usersByRole,
        
        // Waste statistics
        totalWasteEvents,
        totalWeightRecycled,
        wasteEventsThisMonth,
        materialStats,
        
        // Point statistics
        totalPointsAwarded,
        totalPointsInCirculation,
        pointsByReason,
        
        // NFT statistics
        totalNftDefinitions,
        totalNftMints,
        totalNftClaims,
        nftClaimsByStatus,
        
        // System statistics
        totalStations,
        totalDevices,
        activeDevices,
        
        // Recent activity
        recentUsers,
        recentWasteEvents,
        recentNftClaims,
        recentAdminActions,
      ] = await Promise.all([
        // User stats
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isActive: true } }),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        this.prisma.userRole.groupBy({
          by: ['roleCode'],
          _count: { roleCode: true },
        }),
        
        // Waste stats
        this.prisma.wasteEvent.count(),
        this.prisma.wasteEvent.aggregate({
          _sum: { weightGrams: true },
        }),
        this.prisma.wasteEvent.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        this.prisma.wasteEvent.groupBy({
          by: ['materialType'],
          _count: { materialType: true },
          _sum: { weightGrams: true },
          orderBy: { _count: { materialType: 'desc' } },
        }),
        
        // Point stats
        this.prisma.pointLedger.aggregate({
          where: { deltaPoints: { gt: 0 } },
          _sum: { deltaPoints: true },
        }),
        this.prisma.pointBalance.aggregate({
          _sum: { points: true },
        }),
        this.prisma.pointLedger.groupBy({
          by: ['reasonCode'],
          _sum: { deltaPoints: true },
          _count: { reasonCode: true },
          orderBy: { _sum: { deltaPoints: 'desc' } },
        }),
        
        // NFT stats
        this.prisma.nftDefinition.count(),
        this.prisma.nftMint.count(),
        this.prisma.nftClaim.count(),
        this.prisma.nftClaim.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        
        // System stats
        this.prisma.recyclingStation.count(),
        this.prisma.device.count(),
        this.prisma.device.count({ where: { status: 'ACTIVE' } }),
        
        // Recent activity
        this.prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            email: true,
            displayName: true,
            createdAt: true,
          },
        }),
        this.prisma.wasteEvent.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
            station: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        }),
        this.prisma.nftClaim.findMany({
          take: 5,
          orderBy: { claimedAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
            nftMint: {
              include: {
                nftDefinition: {
                  select: {
                    code: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.adminAction.findMany({
          take: 5,
          orderBy: { occurredAt: 'desc' },
          include: {
            adminUser: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
          },
        }),
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
          byRole: usersByRole,
        },
        waste: {
          totalEvents: totalWasteEvents,
          totalWeightGrams: totalWeightRecycled._sum.weightGrams || 0,
          eventsThisMonth: wasteEventsThisMonth,
          byMaterial: materialStats,
        },
        points: {
          totalAwarded: totalPointsAwarded._sum.deltaPoints || 0,
          inCirculation: totalPointsInCirculation._sum.points || 0,
          byReason: pointsByReason,
        },
        nfts: {
          totalDefinitions: totalNftDefinitions,
          totalMints: totalNftMints,
          totalClaims: totalNftClaims,
          claimsByStatus: nftClaimsByStatus,
        },
        system: {
          totalStations,
          totalDevices,
          activeDevices,
        },
        recentActivity: {
          users: recentUsers,
          wasteEvents: recentWasteEvents,
          nftClaims: recentNftClaims,
          adminActions: recentAdminActions,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get admin analytics');
      throw createError('Failed to get analytics', 500);
    }
  }

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<any> {
    try {
      const [
        dbHealth,
        pendingOutboxEvents,
        failedTransactions,
        expiredSessions,
        errorDevices,
      ] = await Promise.all([
        this.checkDatabaseHealth(),
        this.prisma.outboxEvent.count({
          where: { processedAt: null },
        }),
        this.prisma.blockchainTx.count({
          where: { status: 'FAILED' },
        }),
        this.prisma.session.count({
          where: {
            expiresAt: { lt: new Date() },
          },
        }),
        this.prisma.device.count({
          where: { status: 'ERROR' },
        }),
      ]);

      const health = {
        database: dbHealth,
        pendingOutboxEvents,
        failedTransactions,
        expiredSessions,
        errorDevices,
        overall: dbHealth && pendingOutboxEvents < 100 && failedTransactions < 50,
      };

      return health;
    } catch (error) {
      logger.error({ error }, 'Failed to get system health');
      throw createError('Failed to get system health', 500);
    }
  }

  /**
   * Check database health
   */
  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error({ error }, 'Database health check failed');
      return false;
    }
  }

  /**
   * Get admin actions log
   */
  async getAdminActions(page: number = 1, limit: number = 20): Promise<{ actions: any[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [actions, total] = await Promise.all([
        this.prisma.adminAction.findMany({
          skip,
          take: limit,
          orderBy: { occurredAt: 'desc' },
          include: {
            adminUser: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
          },
        }),
        this.prisma.adminAction.count(),
      ]);

      return { actions, total };
    } catch (error) {
      logger.error({ error }, 'Failed to get admin actions');
      throw createError('Failed to get admin actions', 500);
    }
  }

  /**
   * Get recycling stations
   */
  async getRecyclingStations(): Promise<any[]> {
    try {
      return await this.prisma.recyclingStation.findMany({
        include: {
          _count: {
            select: {
              devices: true,
              wasteEvents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error({ error }, 'Failed to get recycling stations');
      throw createError('Failed to get recycling stations', 500);
    }
  }

  /**
   * Get devices
   */
  async getDevices(): Promise<any[]> {
    try {
      return await this.prisma.device.findMany({
        include: {
          station: {
            select: {
              code: true,
              name: true,
            },
          },
          _count: {
            select: {
              wasteEvents: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      logger.error({ error }, 'Failed to get devices');
      throw createError('Failed to get devices', 500);
    }
  }

  /**
   * Create recycling station (admin only)
   */
  async createRecyclingStation(input: any, adminUserId: string): Promise<any> {
    try {
      const station = await this.prisma.recyclingStation.create({
        data: input,
      });

      logger.info({ adminUserId, stationCode: station.code }, 'Recycling station created');
      return station;
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to create recycling station');
      throw createError('Failed to create recycling station', 500);
    }
  }

  /**
   * Create device (admin only)
   */
  async createDevice(input: any, adminUserId: string): Promise<any> {
    try {
      const device = await this.prisma.device.create({
        data: input,
      });

      logger.info({ adminUserId, deviceId: device.id, hwId: device.hwId }, 'Device created');
      return device;
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to create device');
      throw createError('Failed to create device', 500);
    }
  }

  /**
   * Update device status (admin only)
   */
  async updateDeviceStatus(deviceId: string, status: string, adminUserId: string): Promise<any> {
    try {
      const device = await this.prisma.device.update({
        where: { id: deviceId },
        data: { status },
      });

      logger.info({ adminUserId, deviceId, status }, 'Device status updated');
      return device;
    } catch (error) {
      logger.error({ error, deviceId, status, adminUserId }, 'Failed to update device status');
      throw createError('Failed to update device status', 500);
    }
  }

  /**
   * Get system logs (recent login events, errors, etc.)
   */
  async getSystemLogs(limit: number = 50): Promise<any> {
    try {
      const [loginEvents, adminActions] = await Promise.all([
        this.prisma.loginEvent.findMany({
          take: limit,
          orderBy: { occurredAt: 'desc' },
          where: {
            OR: [
              { success: false },
              { reason: { not: 'Login successful' } },
            ],
          },
          select: {
            id: true,
            email: true,
            success: true,
            reason: true,
            occurredAt: true,
            ip: true,
          },
        }),
        this.prisma.adminAction.findMany({
          take: limit,
          orderBy: { occurredAt: 'desc' },
          include: {
            adminUser: {
              select: {
                email: true,
                displayName: true,
              },
            },
          },
        }),
      ]);

      return {
        loginEvents,
        adminActions,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get system logs');
      throw createError('Failed to get system logs', 500);
    }
  }

  /**
   * Clean up expired data (admin only)
   */
  async cleanupExpiredData(adminUserId: string): Promise<any> {
    try {
      const [expiredSessions, expiredLoginEvents] = await Promise.all([
        this.prisma.session.deleteMany({
          where: {
            expiresAt: { lt: new Date() },
          },
        }),
        this.prisma.loginEvent.deleteMany({
          where: {
            occurredAt: {
              lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
            },
          },
        }),
      ]);

      logger.info({
        adminUserId,
        expiredSessions: expiredSessions.count,
        expiredLoginEvents: expiredLoginEvents.count,
      }, 'Expired data cleanup completed');

      return {
        expiredSessions: expiredSessions.count,
        expiredLoginEvents: expiredLoginEvents.count,
      };
    } catch (error) {
      logger.error({ error, adminUserId }, 'Failed to cleanup expired data');
      throw createError('Failed to cleanup expired data', 500);
    }
  }
}
