import type { Request, Response } from 'express';
import { WasteService } from '../services/waste.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler } from '../middleware/error.js';
import type { CreateWasteEventInput, WasteEventQueryInput } from '../validators/waste.schemas.js';

export class WasteController {
  private wasteService: WasteService;

  constructor() {
    this.wasteService = new WasteService();
  }

  /**
   * Create a new waste event
   * POST /waste-events
   */
  createWasteEvent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const input: CreateWasteEventInput = req.body;
    const userId = (req as any).user?.id;

    const { wasteEvent, pointsAwarded } = await this.wasteService.createWasteEvent(input, userId);

    res.status(201).json({
      message: 'Waste event created successfully',
      wasteEvent: {
        id: wasteEvent.id,
        userId: wasteEvent.userId,
        stationCode: wasteEvent.stationCode,
        deviceId: wasteEvent.deviceId,
        occurredAt: wasteEvent.occurredAt,
        materialType: wasteEvent.materialType,
        weightGrams: wasteEvent.weightGrams,
        source: wasteEvent.source,
        rawPayload: wasteEvent.rawPayload,
        createdAt: wasteEvent.createdAt,
        user: wasteEvent.user,
        station: wasteEvent.station,
        device: wasteEvent.device,
      },
      pointsAwarded,
    });
  });

  /**
   * Get waste events with pagination and filtering
   * GET /waste-events
   */
  getWasteEvents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: WasteEventQueryInput = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      userId: req.query.userId as string,
      stationCode: req.query.stationCode as string,
      deviceId: req.query.deviceId as string,
      materialType: req.query.materialType as string,
      source: req.query.source as 'IOT' | 'QR' | 'MANUAL',
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      sortBy: (req.query.sortBy as 'occurredAt' | 'createdAt' | 'weightGrams') || 'occurredAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const userId = (req as any).user?.id;

    const { wasteEvents, total } = await this.wasteService.getWasteEvents(query, userId);

    res.json({
      wasteEvents: wasteEvents.map(event => ({
        id: event.id,
        userId: event.userId,
        stationCode: event.stationCode,
        deviceId: event.deviceId,
        occurredAt: event.occurredAt,
        materialType: event.materialType,
        weightGrams: event.weightGrams,
        source: event.source,
        rawPayload: event.rawPayload,
        createdAt: event.createdAt,
        user: event.user,
        station: event.station,
        device: event.device,
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
   * Get waste event by ID
   * GET /waste-events/:id
   */
  getWasteEventById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    // For now, we'll get it through the general query endpoint
    // In a real implementation, you'd have a specific service method
    const { wasteEvents } = await this.wasteService.getWasteEvents({ page: 1, limit: 1 }, userId);

    const wasteEvent = wasteEvents.find(event => event.id === id);
    if (!wasteEvent) {
      res.status(404).json({
        error: 'Waste event not found',
        code: 'NOT_FOUND',
      });
      return;
    }

    res.json({
      wasteEvent: {
        id: wasteEvent.id,
        userId: wasteEvent.userId,
        stationCode: wasteEvent.stationCode,
        deviceId: wasteEvent.deviceId,
        occurredAt: wasteEvent.occurredAt,
        materialType: wasteEvent.materialType,
        weightGrams: wasteEvent.weightGrams,
        source: wasteEvent.source,
        rawPayload: wasteEvent.rawPayload,
        createdAt: wasteEvent.createdAt,
        user: wasteEvent.user,
        station: wasteEvent.station,
        device: wasteEvent.device,
      },
    });
  });

  /**
   * Get waste statistics
   * GET /waste-events/stats
   */
  getWasteStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const stationCode = req.query.stationCode as string;

    const stats = await this.wasteService.getWasteStats(userId, stationCode);

    res.json({
      stats: {
        totalEvents: stats.totalEvents,
        totalWeightGrams: stats.totalWeightGrams,
        eventsThisMonth: stats.eventsThisMonth,
        materialStats: stats.materialStats,
        sourceStats: stats.sourceStats,
        recentEvents: stats.recentEvents.map(event => ({
          id: event.id,
          materialType: event.materialType,
          weightGrams: event.weightGrams,
          occurredAt: event.occurredAt,
          source: event.source,
        })),
      },
    });
  });

  /**
   * Get user's waste events (personal dashboard)
   * GET /waste-events/my
   */
  getMyWasteEvents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const query: WasteEventQueryInput = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      userId,
      materialType: req.query.materialType as string,
      source: req.query.source as 'IOT' | 'QR' | 'MANUAL',
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      sortBy: (req.query.sortBy as 'occurredAt' | 'createdAt' | 'weightGrams') || 'occurredAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const { wasteEvents, total } = await this.wasteService.getWasteEvents(query, userId);

    res.json({
      wasteEvents: wasteEvents.map(event => ({
        id: event.id,
        stationCode: event.stationCode,
        deviceId: event.deviceId,
        occurredAt: event.occurredAt,
        materialType: event.materialType,
        weightGrams: event.weightGrams,
        source: event.source,
        createdAt: event.createdAt,
        station: event.station,
        device: event.device,
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
   * Get waste events by station (admin only)
   * GET /waste-events/station/:stationCode
   */
  getWasteEventsByStation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { stationCode } = req.params;

    const query: WasteEventQueryInput = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      stationCode,
      materialType: req.query.materialType as string,
      source: req.query.source as 'IOT' | 'QR' | 'MANUAL',
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      sortBy: (req.query.sortBy as 'occurredAt' | 'createdAt' | 'weightGrams') || 'occurredAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const { wasteEvents, total } = await this.wasteService.getWasteEvents(query);

    res.json({
      stationCode,
      wasteEvents: wasteEvents.map(event => ({
        id: event.id,
        userId: event.userId,
        deviceId: event.deviceId,
        occurredAt: event.occurredAt,
        materialType: event.materialType,
        weightGrams: event.weightGrams,
        source: event.source,
        createdAt: event.createdAt,
        user: event.user,
        device: event.device,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  });
}
