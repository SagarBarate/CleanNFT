import { z } from 'zod';

/**
 * NFT definition creation schema (admin only)
 */
export const createNftDefinitionSchema = z.object({
  code: z.string()
    .min(1, 'NFT definition code is required')
    .max(50, 'Code too long')
    .regex(/^[A-Z_]+$/, 'Code must contain only uppercase letters and underscores')
    .transform(val => val.trim()),
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name too long')
    .transform(val => val.trim()),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description too long')
    .transform(val => val.trim()),
  imageIpfsCid: z.string()
    .max(255, 'IPFS CID too long')
    .optional(),
  attributes: z.record(z.unknown())
    .optional()
    .default({}),
  supplyCap: z.number()
    .int()
    .positive('Supply cap must be positive')
    .max(1000000, 'Supply cap too large')
    .optional(),
});

/**
 * NFT definition update schema (admin only)
 */
export const updateNftDefinitionSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(255, 'Name too long')
    .transform(val => val.trim())
    .optional(),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description too long')
    .transform(val => val.trim())
    .optional(),
  imageIpfsCid: z.string()
    .max(255, 'IPFS CID too long')
    .optional(),
  attributes: z.record(z.unknown())
    .optional(),
  supplyCap: z.number()
    .int()
    .positive('Supply cap must be positive')
    .max(1000000, 'Supply cap too large')
    .optional(),
});

/**
 * NFT mint batch creation schema (admin only)
 */
export const createNftMintBatchSchema = z.object({
  definitionCode: z.string()
    .min(1, 'NFT definition code is required')
    .max(50, 'Code too long')
    .transform(val => val.trim()),
  count: z.number()
    .int()
    .min(1, 'Count must be at least 1')
    .max(1000, 'Count too large'),
  contract: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address')
    .transform(val => val.toLowerCase()),
  network: z.string()
    .min(1, 'Network is required')
    .max(50, 'Network name too long')
    .transform(val => val.trim()),
  ownerWalletId: z.string()
    .uuid('Invalid wallet ID'),
  startTokenId: z.number()
    .int()
    .nonnegative('Start token ID must be non-negative')
    .optional(),
});

/**
 * NFT claim schema
 */
export const createNftClaimSchema = z.object({
  definitionCode: z.string()
    .min(1, 'NFT definition code is required')
    .max(50, 'Code too long')
    .transform(val => val.trim()),
  claimType: z.enum(['DRIP', 'ACHIEVEMENT', 'MANUAL'], {
    errorMap: () => ({ message: 'Claim type must be DRIP, ACHIEVEMENT, or MANUAL' })
  }),
  criteria: z.record(z.unknown())
    .optional()
    .default({}),
});

/**
 * NFT claim query schema
 */
export const nftClaimQuerySchema = z.object({
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
  definitionCode: z.string()
    .max(50, 'Definition code too long')
    .optional(),
  claimType: z.enum(['DRIP', 'ACHIEVEMENT', 'MANUAL'])
    .optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED'])
    .optional(),
  startDate: z.coerce.date()
    .optional(),
  endDate: z.coerce.date()
    .optional(),
  sortBy: z.enum(['claimedAt', 'createdAt'])
    .default('claimedAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

/**
 * NFT mint query schema (admin only)
 */
export const nftMintQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
  definitionCode: z.string()
    .max(50, 'Definition code too long')
    .optional(),
  contract: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address')
    .optional(),
  network: z.string()
    .max(50, 'Network name too long')
    .optional(),
  status: z.enum(['MINTED', 'TRANSFERRED', 'BURNED'])
    .optional(),
  ownerWalletId: z.string()
    .uuid('Invalid wallet ID')
    .optional(),
  sortBy: z.enum(['mintedAt', 'createdAt', 'tokenId'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

/**
 * Finalize NFT claim schema (admin only)
 */
export const finalizeNftClaimSchema = z.object({
  nftClaimId: z.string()
    .uuid('Invalid NFT claim ID'),
  txHash: z.string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
    .transform(val => val.toLowerCase()),
  status: z.enum(['COMPLETED', 'FAILED'])
    .default('COMPLETED'),
  error: z.string()
    .max(1000, 'Error message too long')
    .optional(),
});

/**
 * Manual NFT claim allocation schema (admin only)
 */
export const manualNftClaimSchema = z.object({
  userId: z.string()
    .uuid('Invalid user ID'),
  nftMintId: z.string()
    .uuid('Invalid NFT mint ID'),
  claimType: z.enum(['DRIP', 'ACHIEVEMENT', 'MANUAL'])
    .default('MANUAL'),
  reason: z.string()
    .max(500, 'Reason too long')
    .transform(val => val.trim())
    .optional(),
});

/**
 * Blockchain transaction query schema
 */
export const blockchainTxQuerySchema = z.object({
  page: z.coerce.number()
    .int()
    .min(1)
    .default(1),
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
  relatedTable: z.string()
    .max(50, 'Related table name too long')
    .optional(),
  network: z.string()
    .max(50, 'Network name too long')
    .optional(),
  status: z.enum(['SUBMITTED', 'CONFIRMED', 'FAILED'])
    .optional(),
  startDate: z.coerce.date()
    .optional(),
  endDate: z.coerce.date()
    .optional(),
  sortBy: z.enum(['submittedAt', 'confirmedAt', 'createdAt'])
    .default('submittedAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc'),
});

/**
 * Type exports for use in controllers
 */
export type CreateNftDefinitionInput = z.infer<typeof createNftDefinitionSchema>;
export type UpdateNftDefinitionInput = z.infer<typeof updateNftDefinitionSchema>;
export type CreateNftMintBatchInput = z.infer<typeof createNftMintBatchSchema>;
export type CreateNftClaimInput = z.infer<typeof createNftClaimSchema>;
export type NftClaimQueryInput = z.infer<typeof nftClaimQuerySchema>;
export type NftMintQueryInput = z.infer<typeof nftMintQuerySchema>;
export type FinalizeNftClaimInput = z.infer<typeof finalizeNftClaimSchema>;
export type ManualNftClaimInput = z.infer<typeof manualNftClaimSchema>;
export type BlockchainTxQueryInput = z.infer<typeof blockchainTxQuerySchema>;
