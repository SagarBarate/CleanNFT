import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { usersRoutes } from './users.routes.js';
import { wasteRoutes } from './waste.routes.js';
import { pointsRoutes } from './points.routes.js';
import { nftRoutes } from './nft.routes.js';
import { adminRoutes } from './admin.routes.js';
import { contactRoutes } from './contact.routes.js';

/**
 * Main router that combines all route modules
 */
export function createRouter(): Router {
  const router = Router();

  // API version prefix
  router.use('/api/v1', authRoutes);
  router.use('/api/v1', usersRoutes);
  router.use('/api/v1', wasteRoutes);
  router.use('/api/v1', pointsRoutes);
  router.use('/api/v1', nftRoutes);
  router.use('/api/v1', adminRoutes);
  router.use('/api/v1', contactRoutes);

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // API info endpoint
  router.get('/api', (req, res) => {
    res.json({
      name: 'CleanNFT API',
      version: '1.0.0',
      description: 'CleanNFT Backend API - Waste recycling to NFT rewards system',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        waste: '/api/v1/waste-events',
        points: '/api/v1/points',
        nft: '/api/v1/nft',
        admin: '/api/v1/admin',
        contact: '/api/v1/contact',
      },
      documentation: '/api/docs',
    });
  });

  return router;
}
