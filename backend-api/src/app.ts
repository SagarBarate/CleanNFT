import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger } from './libs/logger.js';
import { createRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import { sanitizeRequest } from './middleware/validation.js';
import { env } from './config/env.js';

/**
 * Create and configure Express application
 */
export function createApp(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: env.NODE_ENV === 'production' 
      ? ['https://cleannft.com', 'https://www.cleannft.com'] 
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  }));

  // Trust proxy for accurate IP addresses
  app.set('trust proxy', true);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request sanitization
  app.use(sanitizeRequest);

  // Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.id,
      }, `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    
    next();
  });

  // API routes
  app.use(createRouter());

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(app: express.Application): void {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');
    
    // Stop accepting new connections
    const server = app.get('server');
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed');
      });
    }
    
    // Close database connections
    try {
      const { disconnectDatabase } = await import('./libs/db.js');
      await disconnectDatabase();
      logger.info('Database connections closed');
    } catch (error) {
      logger.error({ error }, 'Error closing database connections');
    }
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error({ error }, 'Uncaught exception');
    shutdown('uncaughtException');
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled promise rejection');
    shutdown('unhandledRejection');
  });
}
