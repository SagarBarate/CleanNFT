import { Router } from 'express';
import { WasteController } from '../controllers/waste.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { wasteEventLimiter } from '../middleware/rateLimit.js';
import { createWasteEventSchema } from '../validators/waste.schemas.js';
import { validateRequest } from '../middleware/validation.js';

export const wasteRoutes = Router();
const wasteController = new WasteController();

/**
 * Waste event routes
 */

// Create a new waste event
wasteRoutes.post('/waste-events',
  authenticateToken,
  wasteEventLimiter,
  validateRequest(createWasteEventSchema),
  wasteController.createWasteEvent
);

// Get waste events with pagination and filtering
wasteRoutes.get('/waste-events',
  authenticateToken,
  wasteController.getWasteEvents
);

// Get waste event by ID
wasteRoutes.get('/waste-events/:id',
  authenticateToken,
  wasteController.getWasteEventById
);

// Get waste statistics
wasteRoutes.get('/waste-events/stats',
  authenticateToken,
  wasteController.getWasteStats
);

// Get user's waste events (personal dashboard)
wasteRoutes.get('/waste-events/my',
  authenticateToken,
  wasteController.getMyWasteEvents
);

// Get waste events by station (admin only)
wasteRoutes.get('/waste-events/station/:stationCode',
  authenticateToken,
  requireAdmin,
  wasteController.getWasteEventsByStation
);
