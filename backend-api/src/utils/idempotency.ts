import crypto from 'crypto';
import { logger } from '../libs/logger.js';

/**
 * Generate an idempotency key for requests
 * Combines user context with request data to ensure uniqueness
 * @param userId User ID (optional for anonymous requests)
 * @param requestData Request data to hash
 * @returns Idempotency key
 */
export function generateIdempotencyKey(userId?: string, requestData?: unknown): string {
  const timestamp = Date.now().toString();
  const userPart = userId ? `user_${userId}` : 'anonymous';
  const dataHash = requestData ? crypto.createHash('sha256').update(JSON.stringify(requestData)).digest('hex').substring(0, 16) : 'no_data';
  const random = crypto.randomBytes(4).toString('hex');
  
  return `idem_${userPart}_${timestamp}_${dataHash}_${random}`;
}

/**
 * Create a nonce for waste event idempotency
 * Based on device, timestamp, and optional payload nonce
 * @param deviceId Device ID
 * @param occurredAt Event timestamp
 * @param payloadNonce Optional nonce from payload
 * @returns Idempotency nonce
 */
export function createWasteEventNonce(deviceId: string, occurredAt: Date, payloadNonce?: string): string {
  const timestamp = occurredAt.getTime().toString();
  const nonce = payloadNonce || crypto.randomBytes(4).toString('hex');
  
  return crypto.createHash('sha256')
    .update(`${deviceId}_${timestamp}_${nonce}`)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Check if a request is idempotent based on key
 * @param idempotencyKey Key to check
 * @param cache Simple in-memory cache for idempotency (in production, use Redis)
 * @returns True if request is idempotent
 */
export function isIdempotentRequest(idempotencyKey: string, cache: Map<string, unknown>): boolean {
  return cache.has(idempotencyKey);
}

/**
 * Store idempotency result in cache
 * @param idempotencyKey Key to store
 * @param result Result to cache
 * @param cache Simple in-memory cache (in production, use Redis)
 * @param ttlSeconds TTL in seconds (default: 300 = 5 minutes)
 */
export function cacheIdempotencyResult(
  idempotencyKey: string, 
  result: unknown, 
  cache: Map<string, { result: unknown; expires: number }>,
  ttlSeconds: number = 300
): void {
  const expires = Date.now() + (ttlSeconds * 1000);
  cache.set(idempotencyKey, { result, expires });
  
  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean up
    cleanupExpiredCache(cache);
  }
}

/**
 * Get cached idempotency result
 * @param idempotencyKey Key to retrieve
 * @param cache Cache to check
 * @returns Cached result or null if not found/expired
 */
export function getCachedIdempotencyResult(
  idempotencyKey: string, 
  cache: Map<string, { result: unknown; expires: number }>
): unknown | null {
  const cached = cache.get(idempotencyKey);
  
  if (!cached) {
    return null;
  }
  
  if (Date.now() > cached.expires) {
    cache.delete(idempotencyKey);
    return null;
  }
  
  return cached.result;
}

/**
 * Clean up expired cache entries
 * @param cache Cache to clean up
 */
function cleanupExpiredCache(cache: Map<string, { result: unknown; expires: number }>): void {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (now > value.expires) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    logger.debug({ cleaned, total: cache.size }, 'Cleaned up expired idempotency cache entries');
  }
}

/**
 * Create a unique constraint key for database operations
 * @param table Table name
 * @param fields Field values to combine
 * @returns Unique constraint key
 */
export function createUniqueConstraintKey(table: string, fields: Record<string, unknown>): string {
  const sortedFields = Object.keys(fields)
    .sort()
    .map(key => `${key}:${fields[key]}`)
    .join('|');
  
  return `${table}:${crypto.createHash('sha256').update(sortedFields).digest('hex').substring(0, 16)}`;
}

/**
 * Validate idempotency key format
 * @param key Key to validate
 * @returns True if valid format
 */
export function isValidIdempotencyKey(key: string): boolean {
  return /^idem_(user_\w+|anonymous)_\d+_[a-f0-9]{16}_[a-f0-9]{8}$/.test(key);
}

/**
 * Extract user ID from idempotency key
 * @param key Idempotency key
 * @returns User ID or null if anonymous
 */
export function extractUserIdFromIdempotencyKey(key: string): string | null {
  const match = key.match(/^idem_user_(\w+)_/);
  return match ? match[1] : null;
}
