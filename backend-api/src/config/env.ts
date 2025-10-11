import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Environment configuration schema with validation
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('Invalid DATABASE_URL'),
  
  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  
  // Server Configuration
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Blockchain Configuration
  ADMIN_WALLET_ADDRESS: z.string().startsWith('0x').length(42, 'Invalid wallet address'),
  CHAIN_NETWORK: z.string().default('polygon-amoy'),
  
  // Optional External Services
  PINATA_API_KEY: z.string().optional(),
  PINATA_SECRET_KEY: z.string().optional(),
  PINATA_GATEWAY_URL: z.string().url().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

/**
 * Parse and validate environment variables
 */
function parseEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = parseEnv();

/**
 * Helper to check if running in development mode
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper to check if running in production mode
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper to check if running in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Get database URL for current environment
 * In test mode, appends '_test' to the database name
 */
export function getDatabaseUrl(): string {
  if (isTest) {
    return env.DATABASE_URL.replace(/\/[^\/]+$/, '/cleannft_test');
  }
  return env.DATABASE_URL;
}
