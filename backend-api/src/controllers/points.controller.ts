import type { Request, Response } from 'express';
import { PointsService } from '../services/points.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler } from '../middleware/error.js';
import type { PointLedgerQueryInput, ManualPointAdjustmentInput } from '../validators/waste.schemas.js';

export class PointsController {
  private pointsService: PointsService;

  constructor() {
    this.pointsService = new PointsService();
  }

  /**
   * Get user's current point balance
   * GET /points/balance
   */
  getPointBalance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const balance = await this.pointsService.getPointBalance(userId);

    res.json({
      balance: {
        points: balance.points,
        updatedAt: balance.updatedAt,
      },
    });
  });

  /**
   * Get user's point ledger with pagination
   * GET /points/ledger
   */
  getPointLedger = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const query: PointLedgerQueryInput = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      reasonCode: req.query.reasonCode as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      sortBy: (req.query.sortBy as 'occurredAt' | 'createdAt' | 'deltaPoints') || 'occurredAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const { ledger, total } = await this.pointsService.getPointLedger(query, userId);

    res.json({
      ledger: ledger.map(entry => ({
        id: entry.id,
        refTable: entry.refTable,
        refId: entry.refId,
        deltaPoints: entry.deltaPoints,
        reasonCode: entry.reasonCode,
        occurredAt: entry.occurredAt,
        createdAt: entry.createdAt,
        pointRule: entry.pointRule,
        wasteEvent: entry.wasteEvent,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  });

  /**
   * Get user's point summary
   * GET /points/summary
   */
  getPointSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const summary = await this.pointsService.getPointSummary(userId);

    res.json({
      summary: {
        currentBalance: summary.currentBalance,
        totalEarned: summary.totalEarned,
        totalSpent: summary.totalSpent,
        lastUpdated: summary.lastUpdated,
        reasonStats: summary.reasonStats,
        recentTransactions: summary.recentTransactions.map(entry => ({
          id: entry.id,
          deltaPoints: entry.deltaPoints,
          reasonCode: entry.reasonCode,
          occurredAt: entry.occurredAt,
          pointRule: entry.pointRule,
        })),
      },
    });
  });

  /**
   * Get user's point history for date range
   * GET /points/history
   */
  getPointHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.status(400).json({
        error: 'Valid startDate and endDate are required',
        code: 'INVALID_DATE',
      });
      return;
    }

    const history = await this.pointsService.getPointHistory(userId, startDate, endDate);

    res.json({
      history: history.map(entry => ({
        id: entry.id,
        refTable: entry.refTable,
        refId: entry.refId,
        deltaPoints: entry.deltaPoints,
        reasonCode: entry.reasonCode,
        occurredAt: entry.occurredAt,
        pointRule: entry.pointRule,
        wasteEvent: entry.wasteEvent,
      })),
      period: {
        startDate,
        endDate,
      },
    });
  });

  /**
   * Manual point adjustment (admin only)
   * POST /points/adjust
   */
  manualPointAdjustment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input: ManualPointAdjustmentInput = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const result = await this.pointsService.manualPointAdjustment(input, adminUserId);

    res.status(201).json({
      message: 'Point adjustment completed successfully',
      adjustment: {
        userId: input.userId,
        deltaPoints: input.deltaPoints,
        reasonCode: input.reasonCode,
        description: input.description,
      },
      result: {
        pointLedger: result.pointLedger,
        newBalance: result.newBalance,
        adjustment: result.adjustment,
      },
    });
  });

  /**
   * Get all point rules (admin only)
   * GET /points/rules
   */
  getPointRules = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const rules = await this.pointsService.getPointRules();

    res.json({
      rules: rules.map(rule => ({
        code: rule.code,
        description: rule.description,
        pointsExpr: rule.pointsExpr,
        activeFrom: rule.activeFrom,
        activeTo: rule.activeTo,
        createdAt: rule.createdAt,
      })),
    });
  });

  /**
   * Create point rule (admin only)
   * POST /points/rules
   */
  createPointRule = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const rule = await this.pointsService.createPointRule(input, adminUserId);

    res.status(201).json({
      message: 'Point rule created successfully',
      rule: {
        code: rule.code,
        description: rule.description,
        pointsExpr: rule.pointsExpr,
        activeFrom: rule.activeFrom,
        activeTo: rule.activeTo,
        createdAt: rule.createdAt,
      },
    });
  });

  /**
   * Update point rule (admin only)
   * PUT /points/rules/:code
   */
  updatePointRule = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;
    const adminUserId = (req as any).user?.id;
    const input = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const rule = await this.pointsService.updatePointRule(code, input, adminUserId);

    res.json({
      message: 'Point rule updated successfully',
      rule: {
        code: rule.code,
        description: rule.description,
        pointsExpr: rule.pointsExpr,
        activeFrom: rule.activeFrom,
        activeTo: rule.activeTo,
        createdAt: rule.createdAt,
      },
    });
  });

  /**
   * Get point statistics (admin only)
   * GET /points/stats
   */
  getPointStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const stats = await this.pointsService.getPointStats();

    res.json({
      stats: {
        totalUsersWithPoints: stats.totalUsersWithPoints,
        totalPointsInCirculation: stats.totalPointsInCirculation,
        pointsByReason: stats.pointsByReason,
        recentActivity: stats.recentActivity.map(entry => ({
          id: entry.id,
          deltaPoints: entry.deltaPoints,
          reasonCode: entry.reasonCode,
          occurredAt: entry.occurredAt,
          user: entry.user,
          pointRule: entry.pointRule,
        })),
      },
    });
  });
}
