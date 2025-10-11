import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../config/env.js';
import { logger } from './logger.js';

/**
 * Global Prisma client instance
 * In development, we use a global variable to prevent multiple instances
 * In production, we create a new instance for each request
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Create Prisma client with proper configuration
 */
function createPrismaClient(): PrismaClient {
  const databaseUrl = getDatabaseUrl();
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });
}

/**
 * Get Prisma client instance
 * Uses global instance in development to prevent connection issues with hot reloading
 */
export function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === 'production') {
    return createPrismaClient();
  }

  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }

  return global.__prisma;
}

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
  const prisma = getPrismaClient();
  
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    // Set up event listeners for query logging in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query', (e) => {
        logger.debug({
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        }, 'Database query');
      });
    }
    
    prisma.$on('error', (e) => {
      logger.error({
        error: e.message,
        target: e.target,
      }, 'Database error');
    });
    
  } catch (error) {
    logger.error({ error }, 'Failed to connect to database');
    throw error;
  }
}

/**
 * Gracefully disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  const prisma = getPrismaClient();
  
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error({ error }, 'Error disconnecting from database');
    throw error;
  }
}

/**
 * Execute database transaction with automatic retry logic
 */
export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>,
  retries: number = 3
): Promise<T> {
  const prisma = getPrismaClient();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await prisma.$transaction(callback, {
        maxWait: 10000, // 10 seconds
        timeout: 30000, // 30 seconds
      });
    } catch (error) {
      logger.warn({
        attempt,
        retries,
        error: error instanceof Error ? error.message : String(error),
      }, `Transaction attempt ${attempt} failed`);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
  
  throw new Error('Transaction failed after all retries');
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error({ error }, 'Database health check failed');
    return false;
  }
}
