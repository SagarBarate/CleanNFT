import { z } from 'zod';

/**
 * Waste event creation schema
 */
export const createWasteEventSchema = z.object({
  stationCode: z.string()
    .max(50, 'Station code too long')
    .optional(),
  deviceHwId: z.string()
    .max(100, 'Device hardware ID too long')
    .optional(),
  materialType: z.string()
    .min(1, 'Material type is required')
    .max(100, 'Material type too long')
    .transform(val => val.trim()),
  weightGrams: z.number()
    .positive('Weight must be positive')
    .max(1000000, 'Weight too large') // Max 1 ton
    .transform(val => Math.round(val * 100) / 100), // Round to 2 decimal places
  source: z.enum(['IOT', 'QR', 'MANUAL'], {
    errorMap: () => ({ message: 'Source must be IOT, QR, or MANUAL' })
  }),
  rawPayload: z.record(z.unknown())
    .optional()
    .default({}),
});

/**
 * Waste event query schema
 */
export const wasteEventQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
  userId: z.string()
    .uuid('Invalid user ID')
    .optional(),
  stationCode: z.string()
    .max(50, 'Station code too long')
    .optional(),
  deviceId: z.string()
    .uuid('Invalid device ID')
    .optional(),
  materialType: z.string()
    .max(100, 'Material type too long')
    .optional(),
  source: z.enum(['IOT', 'QR', 'MANUAL'])
    .optional(),
  startDate: z.coerce.date()
    .optional(),
  endDate: z.coerce.date()
    .optional(),
  sortBy: z.enum(['occurredAt', 'createdAt', 'weightGrams'])
    .default('occurredAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

/**
 * Point rule creation schema (admin only)
 */
export const createPointRuleSchema = z.object({
  code: z.string()
    .min(1, 'Rule code is required')
    .max(50, 'Rule code too long')
    .regex(/^[A-Z_]+$/, 'Rule code must contain only uppercase letters and underscores')
    .transform(val => val.trim()),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description too long')
    .transform(val => val.trim()),
  pointsExpr: z.object({
    type: z.enum(['per_kg', 'flat', 'percentage'], {
      errorMap: () => ({ message: 'Type must be per_kg, flat, or percentage' })
    }),
    value: z.number()
      .positive('Value must be positive')
      .max(1000000, 'Value too large'),
  }),
  activeFrom: z.coerce.date(),
  activeTo: z.coerce.date()
    .optional(),
});

/**
 * Point rule update schema (admin only)
 */
export const updatePointRuleSchema = z.object({
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description too long')
    .transform(val => val.trim())
    .optional(),
  pointsExpr: z.object({
    type: z.enum(['per_kg', 'flat', 'percentage']),
    value: z.number()
      .positive('Value must be positive')
      .max(1000000, 'Value too large'),
  })
    .optional(),
  activeFrom: z.coerce.date()
    .optional(),
  activeTo: z.coerce.date()
    .optional(),
});

/**
 * Point ledger query schema
 */
export const pointLedgerQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
  reasonCode: z.string()
    .max(50, 'Reason code too long')
    .optional(),
  startDate: z.coerce.date()
    .optional(),
  endDate: z.coerce.date()
    .optional(),
  sortBy: z.enum(['occurredAt', 'createdAt', 'deltaPoints'])
    .default('occurredAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

/**
 * Manual point adjustment schema (admin only)
 */
export const manualPointAdjustmentSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),
  deltaPoints: z.number()
    .int('Points must be an integer')
    .refine(val => val !== 0, 'Points delta cannot be zero'),
  reasonCode: z.string()
    .min(1, 'Reason code is required')
    .max(50, 'Reason code too long')
    .transform(val => val.trim()),
  description: z.string()
    .max(500, 'Description too long')
    .transform(val => val.trim())
    .optional(),
});

/**
 * Device creation schema (admin only)
 */
export const createDeviceSchema = z.object({
  stationCode: z.string()
    .min(1, 'Station code is required')
    .max(50, 'Station code too long')
    .transform(val => val.trim()),
  hwId: z.string()
    .min(1, 'Hardware ID is required')
    .max(100, 'Hardware ID too long')
    .transform(val => val.trim()),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'ERROR'])
    .default('ACTIVE'),
  metadata: z.record(z.unknown())
    .optional()
    .default({}),
});

/**
 * Station creation schema (admin only)
 */
export const createStationSchema = z.object({
  code: z.string()
    .min(1, 'Station code is required')
    .max(50, 'Station code too long')
    .regex(/^[A-Z0-9_]+$/, 'Station code must contain only uppercase letters, numbers, and underscores')
    .transform(val => val.trim()),
  name: z.string()
    .min(1, 'Station name is required')
    .max(255, 'Station name too long')
    .transform(val => val.trim()),
  location: z.string()
    .min(1, 'Location is required')
    .max(1000, 'Location too long')
    .transform(val => val.trim()),
  metadata: z.record(z.unknown())
    .optional()
    .default({}),
});

/**
 * Type exports for use in controllers
 */
export type CreateWasteEventInput = z.infer<typeof createWasteEventSchema>;
export type WasteEventQueryInput = z.infer<typeof wasteEventQuerySchema>;
export type CreatePointRuleInput = z.infer<typeof createPointRuleSchema>;
export type UpdatePointRuleInput = z.infer<typeof updatePointRuleSchema>;
export type PointLedgerQueryInput = z.infer<typeof pointLedgerQuerySchema>;
export type ManualPointAdjustmentInput = z.infer<typeof manualPointAdjustmentSchema>;
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;
export type CreateStationInput = z.infer<typeof createStationSchema>;
