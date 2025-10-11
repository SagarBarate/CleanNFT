import { PrismaClient } from '@prisma/client';
import { getPrismaClient, withTransaction } from '../libs/db.js';
import { logger, logBusinessEvent } from '../libs/logger.js';
import { createError, notFoundError, conflictError } from '../middleware/error.js';
import type { 
  CreateNftDefinitionInput, 
  UpdateNftDefinitionInput, 
  CreateNftMintBatchInput,
  CreateNftClaimInput,
  NftClaimQueryInput,
  NftMintQueryInput,
  FinalizeNftClaimInput,
  ManualNftClaimInput
} from '../validators/nft.schemas.js';

export class NftService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  /**
   * Create NFT definition (admin only)
   */
  async createNftDefinition(input: CreateNftDefinitionInput, adminUserId: string): Promise<any> {
    try {
      const nftDefinition = await this.prisma.nftDefinition.create({
        data: {
          ...input,
          createdBy: adminUserId,
        },
      });

      logger.info({ adminUserId, nftDefinitionId: nftDefinition.code }, 'NFT definition created');
      return nftDefinition;
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to create NFT definition');
      throw createError('Failed to create NFT definition', 500);
    }
  }

  /**
   * Update NFT definition (admin only)
   */
  async updateNftDefinition(code: string, input: UpdateNftDefinitionInput, adminUserId: string): Promise<any> {
    try {
      const nftDefinition = await this.prisma.nftDefinition.update({
        where: { code },
        data: input,
      });

      logger.info({ adminUserId, nftDefinitionId: code }, 'NFT definition updated');
      return nftDefinition;
    } catch (error) {
      logger.error({ error, code, input, adminUserId }, 'Failed to update NFT definition');
      throw createError('Failed to update NFT definition', 500);
    }
  }

  /**
   * Get all NFT definitions
   */
  async getNftDefinitions(): Promise<any[]> {
    try {
      return await this.prisma.nftDefinition.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              nftMints: true,
            },
          },
        },
      });
    } catch (error) {
      logger.error({ error }, 'Failed to get NFT definitions');
      throw createError('Failed to get NFT definitions', 500);
    }
  }

  /**
   * Get NFT definition by code
   */
  async getNftDefinition(code: string): Promise<any> {
    try {
      const nftDefinition = await this.prisma.nftDefinition.findUnique({
        where: { code },
        include: {
          nftMints: {
            select: {
              id: true,
              tokenId: true,
              status: true,
              mintedAt: true,
            },
          },
          _count: {
            select: {
              nftMints: true,
            },
          },
        },
      });

      if (!nftDefinition) {
        throw notFoundError('NFT definition not found');
      }

      return nftDefinition;
    } catch (error) {
      logger.error({ error, code }, 'Failed to get NFT definition');
      throw createError('Failed to get NFT definition', 500);
    }
  }

  /**
   * Create NFT mint batch (admin only)
   */
  async createNftMintBatch(input: CreateNftMintBatchInput, adminUserId: string): Promise<any> {
    try {
      // Verify NFT definition exists
      const nftDefinition = await this.prisma.nftDefinition.findUnique({
        where: { code: input.definitionCode },
      });

      if (!nftDefinition) {
        throw notFoundError('NFT definition not found');
      }

      // Verify owner wallet exists
      const ownerWallet = await this.prisma.wallet.findUnique({
        where: { id: input.ownerWalletId },
      });

      if (!ownerWallet) {
        throw notFoundError('Owner wallet not found');
      }

      // Generate token IDs
      const startTokenId = input.startTokenId || 0;
      const mints = [];

      for (let i = 0; i < input.count; i++) {
        mints.push({
          nftDefCode: input.definitionCode,
          tokenId: startTokenId + i,
          contract: input.contract,
          network: input.network,
          ownerWalletId: input.ownerWalletId,
          status: 'MINTED' as const,
        });
      }

      // Create mints in batch
      const createdMints = await this.prisma.nftMint.createMany({
        data: mints,
      });

      logger.info({ 
        adminUserId, 
        definitionCode: input.definitionCode, 
        count: input.count,
        createdCount: createdMints.count 
      }, 'NFT mint batch created');

      return {
        definitionCode: input.definitionCode,
        count: createdMints.count,
        startTokenId,
        endTokenId: startTokenId + input.count - 1,
      };
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to create NFT mint batch');
      throw createError('Failed to create NFT mint batch', 500);
    }
  }

  /**
   * Claim NFT for user
   */
  async claimNft(input: CreateNftClaimInput, userId: string): Promise<{ nftClaim: any; nftMint: any }> {
    try {
      return await withTransaction(async (prisma) => {
        // Verify NFT definition exists
        const nftDefinition = await prisma.nftDefinition.findUnique({
          where: { code: input.definitionCode },
        });

        if (!nftDefinition) {
          throw notFoundError('NFT definition not found');
        }

        // Find available mint using SELECT FOR UPDATE SKIP LOCKED to prevent race conditions
        const availableMint = await prisma.$queryRaw<any[]>`
          SELECT id, token_id, contract, network, owner_wallet_id
          FROM nft_mints 
          WHERE nft_def_code = ${input.definitionCode} 
            AND status = 'MINTED'
            AND id NOT IN (
              SELECT nft_mint_id 
              FROM nft_claims 
              WHERE status = 'PENDING' OR status = 'COMPLETED'
            )
          ORDER BY token_id ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED
        `;

        if (!availableMint.length) {
          throw conflictError('No available NFTs for this definition');
        }

        const mint = availableMint[0];

        // Create NFT claim
        const nftClaim = await prisma.nftClaim.create({
          data: {
            userId,
            nftMintId: mint.id,
            claimType: input.claimType,
            claimedAt: new Date(),
            status: 'PENDING',
          },
          include: {
            nftMint: {
              include: {
                nftDefinition: {
                  select: {
                    code: true,
                    name: true,
                    description: true,
                    imageIpfsCid: true,
                    attributes: true,
                  },
                },
                ownerWallet: {
                  select: {
                    address: true,
                    network: true,
                  },
                },
              },
            },
          },
        });

        // Create outbox event for blockchain transfer
        await prisma.outboxEvent.create({
          data: {
            eventType: 'SEND_TO_CHAIN',
            aggregate: 'nft_claim',
            aggregateId: nftClaim.id,
            payload: {
              nftClaimId: nftClaim.id,
              nftMintId: mint.id,
              userId,
              fromWallet: mint.owner_wallet_id,
              toWallet: userId, // Will be resolved to user's primary wallet
              tokenId: mint.token_id,
              contract: mint.contract,
              network: mint.network,
            },
          },
        });

        logBusinessEvent('nft_claim_initiated', userId, {
          nftClaimId: nftClaim.id,
          nftMintId: mint.id,
          definitionCode: input.definitionCode,
          claimType: input.claimType,
        });

        logger.info({
          userId,
          nftClaimId: nftClaim.id,
          nftMintId: mint.id,
          definitionCode: input.definitionCode,
          tokenId: mint.token_id,
        }, 'NFT claim initiated successfully');

        return { nftClaim, nftMint: nftClaim.nftMint };
      });
    } catch (error) {
      logger.error({ error, input, userId }, 'Failed to claim NFT');
      throw createError('Failed to claim NFT', 500);
    }
  }

  /**
   * Get user's NFT claims
   */
  async getUserNftClaims(query: NftClaimQueryInput, userId: string): Promise<{ claims: any[]; total: number }> {
    try {
      const skip = (query.page - 1) * query.limit;
      
      // Build where clause
      const where: any = { userId };
      
      if (query.definitionCode) {
        where.nftMint = {
          nftDefinition: {
            code: query.definitionCode,
          },
        };
      }
      
      if (query.claimType) {
        where.claimType = query.claimType;
      }
      
      if (query.status) {
        where.status = query.status;
      }
      
      if (query.startDate || query.endDate) {
        where.claimedAt = {};
        if (query.startDate) where.claimedAt.gte = query.startDate;
        if (query.endDate) where.claimedAt.lte = query.endDate;
      }

      const [claims, total] = await Promise.all([
        this.prisma.nftClaim.findMany({
          where,
          skip,
          take: query.limit,
          orderBy: { [query.sortBy]: query.sortOrder },
          include: {
            nftMint: {
              include: {
                nftDefinition: {
                  select: {
                    code: true,
                    name: true,
                    description: true,
                    imageIpfsCid: true,
                    attributes: true,
                  },
                },
                ownerWallet: {
                  select: {
                    address: true,
                    network: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.nftClaim.count({ where }),
      ]);

      return { claims, total };
    } catch (error) {
      logger.error({ error, query, userId }, 'Failed to get user NFT claims');
      throw createError('Failed to get NFT claims', 500);
    }
  }

  /**
   * Finalize NFT claim (admin only or by blockchain service)
   */
  async finalizeNftClaim(input: FinalizeNftClaimInput, adminUserId?: string): Promise<any> {
    try {
      return await withTransaction(async (prisma) => {
        const nftClaim = await prisma.nftClaim.findUnique({
          where: { id: input.nftClaimId },
          include: {
            nftMint: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        });

        if (!nftClaim) {
          throw notFoundError('NFT claim not found');
        }

        if (nftClaim.status !== 'PENDING') {
          throw conflictError('NFT claim is not pending');
        }

        // Update NFT claim status
        const updatedClaim = await prisma.nftClaim.update({
          where: { id: input.nftClaimId },
          data: { status: input.status },
          include: {
            nftMint: {
              include: {
                nftDefinition: true,
              },
            },
          },
        });

        // If successful, update NFT mint status and create blockchain transaction record
        if (input.status === 'COMPLETED') {
          await prisma.nftMint.update({
            where: { id: nftClaim.nftMintId },
            data: { status: 'TRANSFERRED' },
          });

          await prisma.blockchainTx.create({
            data: {
              relatedTable: 'nft_claims',
              relatedId: input.nftClaimId,
              network: nftClaim.nftMint.network,
              txHash: input.txHash,
              status: 'CONFIRMED',
              submittedAt: new Date(),
              confirmedAt: new Date(),
            },
          });
        } else {
          // Failed claim
          await prisma.blockchainTx.create({
            data: {
              relatedTable: 'nft_claims',
              relatedId: input.nftClaimId,
              network: nftClaim.nftMint.network,
              txHash: input.txHash,
              status: 'FAILED',
              submittedAt: new Date(),
              confirmedAt: new Date(),
              error: input.error,
            },
          });
        }

        // Mark outbox event as processed
        await prisma.outboxEvent.updateMany({
          where: {
            aggregate: 'nft_claim',
            aggregateId: input.nftClaimId,
            processedAt: null,
          },
          data: {
            processedAt: new Date(),
          },
        });

        logBusinessEvent('nft_claim_finalized', nftClaim.userId, {
          nftClaimId: input.nftClaimId,
          status: input.status,
          txHash: input.txHash,
          adminUserId,
        });

        logger.info({
          nftClaimId: input.nftClaimId,
          status: input.status,
          txHash: input.txHash,
          adminUserId,
        }, 'NFT claim finalized');

        return updatedClaim;
      });
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to finalize NFT claim');
      throw createError('Failed to finalize NFT claim', 500);
    }
  }

  /**
   * Manual NFT claim allocation (admin only)
   */
  async manualNftClaim(input: ManualNftClaimInput, adminUserId: string): Promise<any> {
    try {
      return await withTransaction(async (prisma) => {
        // Verify NFT mint exists and is available
        const nftMint = await prisma.nftMint.findUnique({
          where: { id: input.nftMintId },
          include: {
            nftDefinition: true,
          },
        });

        if (!nftMint) {
          throw notFoundError('NFT mint not found');
        }

        if (nftMint.status !== 'MINTED') {
          throw conflictError('NFT mint is not available for claiming');
        }

        // Check if already claimed
        const existingClaim = await prisma.nftClaim.findUnique({
          where: {
            userId_nftMintId: {
              userId: input.userId,
              nftMintId: input.nftMintId,
            },
          },
        });

        if (existingClaim) {
          throw conflictError('NFT is already claimed by this user');
        }

        // Create NFT claim
        const nftClaim = await prisma.nftClaim.create({
          data: {
            userId: input.userId,
            nftMintId: input.nftMintId,
            claimType: input.claimType,
            claimedAt: new Date(),
            status: 'COMPLETED', // Manual claims are immediately completed
          },
          include: {
            nftMint: {
              include: {
                nftDefinition: true,
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
          },
        });

        // Update NFT mint status
        await prisma.nftMint.update({
          where: { id: input.nftMintId },
          data: { status: 'TRANSFERRED' },
        });

        logger.info({
          adminUserId,
          userId: input.userId,
          nftMintId: input.nftMintId,
          claimType: input.claimType,
          reason: input.reason,
        }, 'Manual NFT claim created');

        return nftClaim;
      });
    } catch (error) {
      logger.error({ error, input, adminUserId }, 'Failed to create manual NFT claim');
      throw createError('Failed to create manual NFT claim', 500);
    }
  }

  /**
   * Get NFT mints with filtering (admin only)
   */
  async getNftMints(query: NftMintQueryInput): Promise<{ mints: any[]; total: number }> {
    try {
      const skip = (query.page - 1) * query.limit;
      
      // Build where clause
      const where: any = {};
      
      if (query.definitionCode) {
        where.nftDefCode = query.definitionCode;
      }
      
      if (query.contract) {
        where.contract = query.contract.toLowerCase();
      }
      
      if (query.network) {
        where.network = query.network;
      }
      
      if (query.status) {
        where.status = query.status;
      }
      
      if (query.ownerWalletId) {
        where.ownerWalletId = query.ownerWalletId;
      }

      const [mints, total] = await Promise.all([
        this.prisma.nftMint.findMany({
          where,
          skip,
          take: query.limit,
          orderBy: { [query.sortBy]: query.sortOrder },
          include: {
            nftDefinition: {
              select: {
                code: true,
                name: true,
                description: true,
                imageIpfsCid: true,
              },
            },
            ownerWallet: {
              select: {
                address: true,
                network: true,
              },
            },
            nftClaims: {
              select: {
                id: true,
                userId: true,
                claimType: true,
                status: true,
                claimedAt: true,
              },
            },
          },
        }),
        this.prisma.nftMint.count({ where }),
      ]);

      return { mints, total };
    } catch (error) {
      logger.error({ error, query }, 'Failed to get NFT mints');
      throw createError('Failed to get NFT mints', 500);
    }
  }

  /**
   * Get NFT statistics (admin only)
   */
  async getNftStats(): Promise<any> {
    try {
      const [
        totalDefinitions,
        totalMints,
        totalClaims,
        mintsByStatus,
        claimsByStatus,
        recentActivity,
      ] = await Promise.all([
        this.prisma.nftDefinition.count(),
        this.prisma.nftMint.count(),
        this.prisma.nftClaim.count(),
        this.prisma.nftMint.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        this.prisma.nftClaim.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        this.prisma.nftClaim.findMany({
          take: 10,
          orderBy: { claimedAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                displayName: true,
              },
            },
            nftMint: {
              include: {
                nftDefinition: {
                  select: {
                    code: true,
                    name: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      return {
        totalDefinitions,
        totalMints,
        totalClaims,
        mintsByStatus,
        claimsByStatus,
        recentActivity,
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get NFT statistics');
      throw createError('Failed to get NFT statistics', 500);
    }
  }
}
