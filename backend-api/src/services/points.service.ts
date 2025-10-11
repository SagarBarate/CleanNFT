import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../libs/db.js';
import { logger } from '../libs/logger.js';
import { createError, notFoundError } from '../middleware/error.js';
import type { PointLedgerQueryInput, ManualPointAdjustmentInput } from '../validators/waste.schemas.js';

export class PointsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Get user's current point balance
   */
  async getPointBalance(userId: string): Promise<any> {
    try {
      // Ensure point balance record exists
      await this.prisma.pointBalance.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          points: 0,
        },
      });

      const balance = await this.prisma.pointBalance.findUnique({
        where: { userId },
        select: {
          points: true,
          updatedAt: true,
        },
      });

      return balance || { points: 0, updatedAt: new Date() };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get point balance');
      throw createError('Failed to get point balance', 500);
    }
  }

  /**
   * Get user's point ledger with pagination
   */
  async getPointLedger(query: PointLedgerQueryInput, userId: string): Promise<{ ledger: any[]; total: number }> {
    try {
      const skip = (query.page - 1) * query.limit;
      
      // Build where clause
      const where: any = { userId };
      
      if (query.reasonCode) {
        where.reasonCode = query.reasonCode;
      }
      
      if (query.startDate || query.endDate) {
        where.occurredAt = {};
        if (query.startDate) where.occurredAt.gte = query.startDate;
        if (query.endDate) where.occurredAt.lte = query.endDate;
      }

      const [ledger, total] = await Promise.all([
        this.prisma.pointLedger.findMany({
          where,
          skip,
          take: query.limit,
          orderBy: { [query.sortBy]: query.sortOrder },
          include: {
            pointRule: {
              select: {
                code: true,
                description: true,
              },
            },
            wasteEvent: {
              select: {
                id: true,
                materialType: true,
                weightGrams: true,
                occurredAt: true,
              },
            },
          },
        }),
        this.prisma.pointLedger.count({ where }),
      ]);

      return { ledger, total };
    } catch (error) {
      logger.error({ error, query, userId }, 'Failed to get point ledger');
      throw createError('Failed to get point ledger', 500);
    }
  }

  /**
   * Get point balance summary for user
   */
  async getPointSummary(userId: string): Promise<any> {
    try {
      const [
        balance,
        totalEarned,
        totalSpent,
        recentTransactions,
        reasonStats,
      ] = await Promise.all([
        this.getPointBalance(userId),
        this.prisma.pointLedger.aggregate({
          where: {
            userId,
            deltaPoints: { gt: 0 },
          },
          _sum: { deltaPoints: true },
        }),
        this.prisma.pointLedger.aggregate({
          where: {
            userId,
            deltaPoints: { lt: 0 },
          },
          _sum: { deltaPoints: true },
        }),
        this.prisma.pointLedger.findMany({
          where: { userId },
          take: 10,
          orderBy: { occurredAt: 'desc' },
          include: {
            pointRule: {
              select: {
                code: true,
                description: true,
              },
            },
          },
        }),
        this.prisma.pointLedger.groupBy({
          by: ['reasonCode'],
          where: { userId },
          _sum: { deltaPoints: true },
          _count: { reasonCode: true },
          orderBy: { _sum: { deltaPoints: 'desc' } },
        }),
      ]);

      return {
        currentBalance: balance.points,
        totalEarned: totalEarned._sum.deltaPoints || 0,
        totalSpent: Math.abs(totalSpent._sum.deltaPoints || 0),
        recentTransactions,
        reasonStats,
        lastUpdated: balance.updatedAt,
      };
    } catch (error) {
      logger.error({ error, userId }, 'Failed to get point summary');
      throw createError('Failed to get point summary', 500);
    }
  }

  /**
   * Manual point adjustment (admin only)
   */
  async manualPointAdjustment(input: ManualPointAdjustmentInput, adminUserId: string): Promise<any> {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!user) {
        throw notFoundError('User not found');
      }

      // Create point ledger entry
      const pointLedger = await this.prisma.pointLedger.create({
        data: {
          userId: input.userId,
          refTable: 'manual_adjustment',
          refId: `admin_${adminUserId}_${Date.now()}`,
          deltaPoints: input.deltaPoints,
          reasonCode: input.reasonCode,
          occurredAt: new Date(),
        },
        include: {
          pointRule: {
            select: {
              code: true,
              description: true,
            },
          },
        },
      });

      // Get updated balance
      const balance = await this.getPointBalance(input.userId);

      logger.info({
        adminUserId,
        targetUserId: input.userId,
        deltaPoints: input.deltaPoints,
        reasonCode: input.reasonCode,
        description: input.description,
      }, 'Manual point adjustment completed');

      return {
        pointLedger,
        newBalance: balance.points,
        adjustment: input.deltaPoints,
      };
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to perform manual point adjustment');
      throw createError('Failed to adjust points', 500);
    }
  }

  /**
   * Get all point rules (admin only)
   */
  async getPointRules(): Promise<any[]> {
    try {
      return await this.prisma.pointRule.findMany({
        orderBy: [
          { activeFrom: 'desc' },
          { code: 'asc' },
        ],
      });
    } catch (error) {
      logger.error({ error }, 'Failed to get point rules');
      throw createError('Failed to get point rules', 500);
    }
  }

  /**
   * Create point rule (admin only)
   */
  async createPointRule(input: any, adminUserId: string): Promise<any> {
    try {
      const pointRule = await this.prisma.pointRule.create({
        data: input,
      });

      logger.info({ adminUserId, pointRuleId: pointRule.code }, 'Point rule created');

      return pointRule;
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to create point rule');
      throw createError('Failed to create point rule', 500);
    }
  }

  /**
   * Update point rule (admin only)
   */
  async updatePointRule(code: string, input: any, adminUserId: string): Promise<any> {
    try {
      const pointRule = await this.prisma.pointRule.update({
        where: { code },
        data: input,
      });

      logger.info({ adminUserId, pointRuleId: code }, 'Point rule updated');

      return pointRule;
    } catch (error) {
      logger.error({ error, code, input, adminUserId }, 'Failed to update point rule');
      throw createError('Failed to update point rule', 500);
    }
  }

  /**
   * Get point statistics (admin only)
   */
  async getPointStats(): Promise<any> {
    try {
      const [
        totalUsersWithPoints,
        totalPointsInCirculation,
        pointsByReason,
        recentActivity,
      ] = await Promise.all([
        this.prisma.pointBalance.count({
          where: { points: { gt: 0 } },
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
        this.prisma.pointLedger.findMany({
          take: 20,
          orderBy: { occurredAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
            pointRule: {
              select: {
                code: true,
                description: true,
              },
            },
          },
        }),
      ]);

      return {
        totalUsersWithPoints,
        totalPointsInCirculation: totalPointsInCirculation._sum.points || 0,
        pointsByReason,
        recentActivity,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get point statistics');
      throw createError('Failed to get point statistics', 500);
    }
  }

  /**
   * Get user's point history for a specific date range
   */
  async getPointHistory(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    try {
      return await this.prisma.pointLedger.findMany({
        where: {
          userId,
          occurredAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { occurredAt: 'desc' },
        include: {
          pointRule: {
            select: {
              code: true,
              description: true,
            },
          },
          wasteEvent: {
            select: {
              id: true,
              materialType: true,
              weightGrams: true,
              occurredAt: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error({ error, userId, startDate, endDate }, 'Failed to get point history');
      throw createError('Failed to get point history', 500);
    }
  }
}
