import { PrismaClient } from '@prisma/client';
import { getPrismaClient, withTransaction } from '../libs/db.js';
import { logger, logBusinessEvent } from '../libs/logger.js';
import { createError, notFoundError, conflictError } from '../middleware/error.js';
import { createWasteEventNonce } from '../utils/idempotency.js';
import type { CreateWasteEventInput, WasteEventQueryInput } from '../validators/waste.schemas.js';

export class WasteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Create a new waste event
   * Handles idempotency and point calculation
   */
  async createWasteEvent(input: CreateWasteEventInput, userId?: string): Promise<{ wasteEvent: any; pointsAwarded: number }> {
    try {
      return await withTransaction(async (prisma) => {
        // Validate station and device if provided
        if (input.stationCode) {
          const station = await prisma.recyclingStation.findUnique({
            where: { code: input.stationCode },
          });
          if (!station) {
            throw notFoundError('Recycling station not found');
          }
        }

        let device = null;
        if (input.deviceHwId) {
          device = await prisma.device.findUnique({
            where: { hwId: input.deviceHwId },
          });
          if (!device) {
            throw notFoundError('Device not found');
          }
        }

        // Create idempotency nonce for device-based events
        const occurredAt = new Date();
        const nonce = input.deviceHwId 
          ? createWasteEventNonce(device!.id, occurredAt, input.rawPayload?.nonce as string)
          : undefined;

        // Try to create waste event with idempotency check
        let wasteEvent;
        try {
          wasteEvent = await prisma.wasteEvent.create({
            data: {
              userId,
              stationCode: input.stationCode,
              deviceId: device?.id,
              occurredAt,
              materialType: input.materialType,
              weightGrams: input.weightGrams,
              source: input.source,
              rawPayload: {
                ...input.rawPayload,
                nonce,
              },
            },
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
              device: {
                select: {
                  hwId: true,
                  status: true,
                },
              },
            },
          });
        } catch (error: any) {
          // Check if it's a unique constraint violation (idempotency)
          if (error.code === 'P2002' && error.meta?.target?.includes('ux_waste_events_idem')) {
            // Find the existing event
            const existingEvent = await prisma.wasteEvent.findFirst({
              where: {
                deviceId: device?.id,
                occurredAt,
                rawPayload: {
                  path: ['nonce'],
                  equals: nonce,
                },
              },
            });

            if (existingEvent) {
              logger.info({
                userId,
                deviceId: device?.id,
                nonce,
              }, 'Duplicate waste event detected, returning existing event');

              return {
                wasteEvent: existingEvent,
                pointsAwarded: 0, // No additional points for duplicate
              };
            }
          }
          throw error;
        }

        // Calculate and award points
        const pointsAwarded = await this.calculateAndAwardPoints(wasteEvent.id, userId, input);

        logBusinessEvent('waste_event_created', userId, {
          wasteEventId: wasteEvent.id,
          materialType: input.materialType,
          weightGrams: input.weightGrams,
          pointsAwarded,
        });

        logger.info({
          userId,
          wasteEventId: wasteEvent.id,
          materialType: input.materialType,
          weightGrams: input.weightGrams,
          pointsAwarded,
        }, 'Waste event created successfully');

        return { wasteEvent, pointsAwarded };
      });
    } catch (error) {
      logger.error({ error, input, userId }, 'Failed to create waste event');
      throw createError('Failed to create waste event', 500);
    }
  }

  /**
   * Calculate and award points for a waste event
   */
  private async calculateAndAwardPoints(wasteEventId: string, userId: string | undefined, input: CreateWasteEventInput): Promise<number> {
    if (!userId) {
      return 0; // No points for anonymous events
    }

    try {
      // Get active point rules
      const pointRules = await this.prisma.pointRule.findMany({
        where: {
          activeFrom: {
            lte: new Date(),
          },
          OR: [
            { activeTo: null },
            { activeTo: { gte: new Date() } },
          ],
        },
        orderBy: { activeFrom: 'asc' },
      });

      let totalPoints = 0;

      for (const rule of pointRules) {
        const pointsExpr = rule.pointsExpr as any;
        let rulePoints = 0;

        switch (pointsExpr.type) {
          case 'per_kg':
            rulePoints = Math.floor((input.weightGrams / 1000) * pointsExpr.value);
            break;
          case 'flat':
            rulePoints = pointsExpr.value;
            break;
          case 'percentage':
            // Percentage of base points (could be based on weight or other factors)
            const basePoints = Math.floor(input.weightGrams / 1000) * 10; // Base 10 points per kg
            rulePoints = Math.floor(basePoints * (pointsExpr.value / 100));
            break;
        }

        if (rulePoints > 0) {
          // Special handling for first dump bonus
          if (rule.code === 'FIRST_DUMP_BONUS') {
            const existingWasteEvents = await this.prisma.wasteEvent.count({
              where: { userId },
            });

            // Only award if this is the first waste event (excluding current one)
            if (existingWasteEvents <= 1) {
              await this.createPointLedgerEntry(userId, 'waste_events', wasteEventId, rulePoints, rule.code);
              totalPoints += rulePoints;
            }
          } else {
            await this.createPointLedgerEntry(userId, 'waste_events', wasteEventId, rulePoints, rule.code);
            totalPoints += rulePoints;
          }
        }
      }

      return totalPoints;
    } catch (error) {
      logger.error({ error, wasteEventId, userId }, 'Failed to calculate points');
      return 0;
    }
  }

  /**
   * Create point ledger entry
   */
  private async createPointLedgerEntry(
    userId: string,
    refTable: string,
    refId: string,
    deltaPoints: number,
    reasonCode: string
  ): Promise<void> {
    try {
      await this.prisma.pointLedger.create({
        data: {
          userId,
          refTable,
          refId,
          deltaPoints,
          reasonCode,
          occurredAt: new Date(),
        },
      });
    } catch (error: any) {
      // If it's a duplicate entry, that's fine - points were already awarded
      if (error.code === 'P2002' && error.meta?.target?.includes('refTable_refId_reasonCode')) {
        logger.debug({ userId, refTable, refId, reasonCode }, 'Point ledger entry already exists');
        return;
      }
      throw error;
    }
  }

  /**
   * Get waste events with pagination and filtering
   */
  async getWasteEvents(query: WasteEventQueryInput, userId?: string): Promise<{ wasteEvents: any[]; total: number }> {
    try {
      const skip = (query.page - 1) * query.limit;
      
      // Build where clause
      const where: any = {};
      
      if (userId || query.userId) {
        where.userId = userId || query.userId;
      }
      
      if (query.stationCode) {
        where.stationCode = query.stationCode;
      }
      
      if (query.deviceId) {
        where.deviceId = query.deviceId;
      }
      
      if (query.materialType) {
        where.materialType = query.materialType;
      }
      
      if (query.source) {
        where.source = query.source;
      }
      
      if (query.startDate || query.endDate) {
        where.occurredAt = {};
        if (query.startDate) where.occurredAt.gte = query.startDate;
        if (query.endDate) where.occurredAt.lte = query.endDate;
      }

      const [wasteEvents, total] = await Promise.all([
        this.prisma.wasteEvent.findMany({
          where,
          skip,
          take: query.limit,
          orderBy: { [query.sortBy]: query.sortOrder },
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
                location: true,
              },
            },
            device: {
              select: {
                hwId: true,
                status: true,
              },
            },
          },
        }),
        this.prisma.wasteEvent.count({ where }),
      ]);

      return { wasteEvents, total };
    } catch (error) {
      logger.error({ error, query, userId }, 'Failed to get waste events');
      throw createError('Failed to get waste events', 500);
    }
  }

  /**
   * Get waste event statistics
   */
  async getWasteStats(userId?: string, stationCode?: string): Promise<any> {
    try {
      const where: any = {};
      
      if (userId) {
        where.userId = userId;
      }
      
      if (stationCode) {
        where.stationCode = stationCode;
      }

      const [
        totalEvents,
        totalWeight,
        materialStats,
        sourceStats,
        recentEvents,
      ] = await Promise.all([
        this.prisma.wasteEvent.count({ where }),
        this.prisma.wasteEvent.aggregate({
          where,
          _sum: { weightGrams: true },
        }),
        this.prisma.wasteEvent.groupBy({
          by: ['materialType'],
          where,
          _count: { materialType: true },
          _sum: { weightGrams: true },
          orderBy: { _count: { materialType: 'desc' } },
        }),
        this.prisma.wasteEvent.groupBy({
          by: ['source'],
          where,
          _count: { source: true },
          orderBy: { _count: { source: 'desc' } },
        }),
        this.prisma.wasteEvent.findMany({
          where,
          take: 5,
          orderBy: { occurredAt: 'desc' },
          select: {
            id: true,
            materialType: true,
            weightGrams: true,
            occurredAt: true,
            source: true,
          },
        }),
      ]);

      return {
        totalEvents,
        totalWeightGrams: totalWeight._sum.weightGrams || 0,
        materialStats,
        sourceStats,
        recentEvents,
      };
    } catch (error) {
      logger.error({ error, userId, stationCode }, 'Failed to get waste stats');
      throw createError('Failed to get waste statistics', 500);
    }
  }
}
