import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Hash a password using Argon2
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    });
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against its hash
 * @param hash Hashed password
 * @param password Plain text password
 * @returns True if password matches
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    return false;
  }
}

/**
 * Generate a secure random token
 * @param length Token length in bytes (default: 32)
 * @returns Hex-encoded token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a random nonce for idempotency
 * @returns 8-character random nonce
 */
export function generateNonce(): string {
  return crypto.randomBytes(4).toString('hex');
}

/**
 * Sign a JWT token
 * @param payload Token payload
 * @param expiresIn Token expiration (default: '7d')
 * @returns Signed JWT token
 */
export function signJwt(payload: Record<string, unknown>, expiresIn: string = '7d'): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn,
    issuer: 'cleannft-api',
    audience: 'cleannft-client',
  });
}

/**
 * Verify and decode a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload
 */
export function verifyJwt(token: string): Record<string, unknown> {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      issuer: 'cleannft-api',
      audience: 'cleannft-client',
    }) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Generate a session ID
 * @returns 32-character session ID
 */
export function generateSessionId(): string {
  return generateToken(16);
}

/**
 * Hash sensitive data for logging (one-way)
 * @param data Data to hash
 * @returns SHA-256 hash of the data
 */
export function hashForLogging(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
}

/**
 * Generate a unique ID for blockchain transactions
 * @returns Unique transaction ID
 */
export function generateTxId(): string {
  const timestamp = Date.now().toString(36);
  const random = generateToken(8);
  return `tx_${timestamp}_${random}`;
}

/**
 * Validate Ethereum address format
 * @param address Address to validate
 * @returns True if valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate wallet address for the configured network
 * @param address Address to validate
 * @returns True if valid wallet address
 */
export function isValidWalletAddress(address: string): boolean {
  return isValidEthereumAddress(address);
}
