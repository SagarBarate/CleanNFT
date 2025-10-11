import { createServer } from 'http';
import { createApp, setupGracefulShutdown } from './app.js';
import { initializeDatabase } from './libs/db.js';
import { logger } from './libs/logger.js';
import { env } from './config/env.js';
import { TxService } from './services/tx.service.js';

/**
 * Start the CleanNFT API server
 */
async function startServer(): Promise<void> {
  try {
    // Initialize database connection
    await initializeDatabase();
    logger.info('Database initialized successfully');

    // Create Express application
    const app = createApp();
    
    // Create HTTP server
    const server = createServer(app);
    
    // Store server reference for graceful shutdown
    app.set('server', server);
    
    // Setup graceful shutdown
    setupGracefulShutdown(app);

    // Start blockchain transaction processor
    await startOutboxProcessor();
    
    // Start session cleanup
    await startSessionCleanup();

    // Start server
    server.listen(env.PORT, () => {
      logger.info({
        port: env.PORT,
        nodeEnv: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      }, `🚀 CleanNFT API server started on port ${env.PORT}`);
      
      // Log available endpoints
      logger.info({
        endpoints: {
          health: '/health',
          api: '/api',
          auth: '/api/v1/auth',
          users: '/api/v1/users',
          waste: '/api/v1/waste-events',
          points: '/api/v1/points',
          nft: '/api/v1/nft',
          admin: '/api/v1/admin',
        },
      }, 'Available API endpoints');
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof env.PORT === 'string' ? `Pipe ${env.PORT}` : `Port ${env.PORT}`;

      switch (error.code) {
        case 'EACCES':
          logger.error({ port: env.PORT }, `${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error({ port: env.PORT }, `${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

/**
 * Start outbox event processor for blockchain transactions
 */
async function startOutboxProcessor(): Promise<void> {
  const txService = new TxService();
  const { getPrismaClient } = await import('./libs/db.js');
  
  const processOutboxEvents = async (): Promise<void> => {
    try {
      const prisma = getPrismaClient();
      
      // Get unprocessed outbox events
      const events = await prisma.outboxEvent.findMany({
        where: {
          processedAt: null,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 10, // Process in batches
      });

      if (events.length === 0) {
        return; // No events to process
      }

      logger.debug({ count: events.length }, 'Processing outbox events');

      for (const event of events) {
        try {
          // Simulate blockchain transaction
          const result = await txService.simulateBlockchainTransaction(event);

          if (result.success) {
            // Update related records based on event type
            if (event.eventType === 'SEND_TO_CHAIN' && event.aggregate === 'nft_claim') {
              await prisma.nftClaim.update({
                where: { id: event.aggregateId },
                data: { status: 'COMPLETED' },
              });

              await prisma.nftMint.update({
                where: { id: event.payload.nftMintId },
                data: { status: 'TRANSFERRED' },
              });
            }

            // Create blockchain transaction record
            await prisma.blockchainTx.create({
              data: {
                relatedTable: event.aggregate,
                relatedId: event.aggregateId,
                network: event.payload.network || env.CHAIN_NETWORK,
                txHash: result.txHash,
                status: 'CONFIRMED',
                submittedAt: new Date(),
                confirmedAt: new Date(),
              },
            });

            // Mark outbox event as processed
            await prisma.outboxEvent.update({
              where: { id: event.id },
              data: { processedAt: new Date() },
            });

            logger.info({
              eventId: event.id,
              aggregate: event.aggregate,
              aggregateId: event.aggregateId,
              txHash: result.txHash,
            }, 'Outbox event processed successfully');

          } else {
            // Handle failure
            logger.error({
              eventId: event.id,
              error: result.error,
            }, 'Outbox event processing failed');

            // Mark as failed and create blockchain transaction record
            await prisma.blockchainTx.create({
              data: {
                relatedTable: event.aggregate,
                relatedId: event.aggregateId,
                network: event.payload.network || env.CHAIN_NETWORK,
                status: 'FAILED',
                submittedAt: new Date(),
                confirmedAt: new Date(),
                error: result.error,
              },
            });

            await prisma.outboxEvent.update({
              where: { id: event.id },
              data: { processedAt: new Date() },
            });
          }

        } catch (error) {
          logger.error({
            eventId: event.id,
            error,
          }, 'Error processing outbox event');
        }
      }

    } catch (error) {
      logger.error({ error }, 'Error in outbox processor');
    }
  };

  // Process events every 2 seconds
  const interval = setInterval(processOutboxEvents, 2000);
  
  // Clean up interval on shutdown
  process.on('SIGTERM', () => clearInterval(interval));
  process.on('SIGINT', () => clearInterval(interval));

  logger.info('Outbox event processor started');
}

/**
 * Cleanup expired sessions periodically
 */
async function startSessionCleanup(): Promise<void> {
  const { AuthService } = await import('./services/auth.service.js');
  
  const cleanupSessions = async (): Promise<void> => {
    try {
      const authService = new AuthService();
      const cleanedCount = await authService.cleanupExpiredSessions();
      
      if (cleanedCount > 0) {
        logger.info({ count: cleanedCount }, 'Cleaned up expired sessions');
      }
    } catch (error) {
      logger.error({ error }, 'Error cleaning up sessions');
    }
  };

  // Clean up sessions every hour
  const interval = setInterval(cleanupSessions, 60 * 60 * 1000);
  
  // Clean up interval on shutdown
  process.on('SIGTERM', () => clearInterval(interval));
  process.on('SIGINT', () => clearInterval(interval));

  logger.info('Session cleanup started');
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  });
}
