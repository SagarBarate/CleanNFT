import type { Request, Response } from 'express';
import { NftService } from '../services/nft.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler } from '../middleware/error.js';
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

export class NftController {
  private nftService: NftService;

  constructor() {
    this.nftService = new NftService();
  }

  /**
   * Get all NFT definitions
   * GET /nft/definitions
   */
  getNftDefinitions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const definitions = await this.nftService.getNftDefinitions();

    res.json({
      definitions: definitions.map(def => ({
        code: def.code,
        name: def.name,
        description: def.description,
        imageIpfsCid: def.imageIpfsCid,
        attributes: def.attributes,
        supplyCap: def.supplyCap,
        createdBy: def.createdBy,
        createdAt: def.createdAt,
        totalMints: def._count.nftMints,
      })),
    });
  });

  /**
   * Get NFT definition by code
   * GET /nft/definitions/:code
   */
  getNftDefinition = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;

    const definition = await this.nftService.getNftDefinition(code);

    res.json({
      definition: {
        code: definition.code,
        name: definition.name,
        description: definition.description,
        imageIpfsCid: definition.imageIpfsCid,
        attributes: definition.attributes,
        supplyCap: definition.supplyCap,
        createdBy: definition.createdBy,
        createdAt: definition.createdAt,
        totalMints: definition._count.nftMints,
        mints: definition.nftMints.map(mint => ({
          id: mint.id,
          tokenId: mint.tokenId,
          status: mint.status,
          mintedAt: mint.mintedAt,
        })),
      },
    });
  });

  /**
   * Create NFT definition (admin only)
   * POST /nft/definitions
   */
  createNftDefinition = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input: CreateNftDefinitionInput = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const definition = await this.nftService.createNftDefinition(input, adminUserId);

    res.status(201).json({
      message: 'NFT definition created successfully',
      definition: {
        code: definition.code,
        name: definition.name,
        description: definition.description,
        imageIpfsCid: definition.imageIpfsCid,
        attributes: definition.attributes,
        supplyCap: definition.supplyCap,
        createdBy: definition.createdBy,
        createdAt: definition.createdAt,
      },
    });
  });

  /**
   * Update NFT definition (admin only)
   * PUT /nft/definitions/:code
   */
  updateNftDefinition = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;
    const adminUserId = (req as any).user?.id;
    const input: UpdateNftDefinitionInput = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const definition = await this.nftService.updateNftDefinition(code, input, adminUserId);

    res.json({
      message: 'NFT definition updated successfully',
      definition: {
        code: definition.code,
        name: definition.name,
        description: definition.description,
        imageIpfsCid: definition.imageIpfsCid,
        attributes: definition.attributes,
        supplyCap: definition.supplyCap,
        createdBy: definition.createdBy,
        createdAt: definition.createdAt,
      },
    });
  });

  /**
   * Create NFT mint batch (admin only)
   * POST /nft/mint-batch
   */
  createNftMintBatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input: CreateNftMintBatchInput = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const result = await this.nftService.createNftMintBatch(input, adminUserId);

    res.status(201).json({
      message: 'NFT mint batch created successfully',
      result: {
        definitionCode: result.definitionCode,
        count: result.count,
        startTokenId: result.startTokenId,
        endTokenId: result.endTokenId,
      },
    });
  });

  /**
   * Claim NFT
   * POST /nft/claim
   */
  claimNft = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;
    const input: CreateNftClaimInput = req.body;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const { nftClaim, nftMint } = await this.nftService.claimNft(input, userId);

    res.status(201).json({
      message: 'NFT claim initiated successfully',
      claim: {
        id: nftClaim.id,
        userId: nftClaim.userId,
        nftMintId: nftClaim.nftMintId,
        claimType: nftClaim.claimType,
        claimedAt: nftClaim.claimedAt,
        status: nftClaim.status,
        createdAt: nftClaim.createdAt,
      },
      nftMint: {
        id: nftMint.id,
        tokenId: nftMint.tokenId,
        contract: nftMint.contract,
        network: nftMint.network,
        status: nftMint.status,
        nftDefinition: nftMint.nftDefinition,
        ownerWallet: nftMint.ownerWallet,
      },
    });
  });

  /**
   * Get user's NFT claims
   * GET /nft/my
   */
  getMyNftClaims = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const query: NftClaimQueryInput = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      userId,
      definitionCode: req.query.definitionCode as string,
      claimType: req.query.claimType as 'DRIP' | 'ACHIEVEMENT' | 'MANUAL',
      status: req.query.status as 'PENDING' | 'COMPLETED' | 'FAILED',
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      sortBy: (req.query.sortBy as 'claimedAt' | 'createdAt') || 'claimedAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const { claims, total } = await this.nftService.getUserNftClaims(query, userId);

    res.json({
      claims: claims.map(claim => ({
        id: claim.id,
        userId: claim.userId,
        nftMintId: claim.nftMintId,
        claimType: claim.claimType,
        claimedAt: claim.claimedAt,
        status: claim.status,
        createdAt: claim.createdAt,
        nftMint: {
          id: claim.nftMint.id,
          tokenId: claim.nftMint.tokenId,
          contract: claim.nftMint.contract,
          network: claim.nftMint.network,
          status: claim.nftMint.status,
          nftDefinition: claim.nftMint.nftDefinition,
          ownerWallet: claim.nftMint.ownerWallet,
        },
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  });

  /**
   * Get NFT mints (admin only)
   * GET /nft/mints
   */
  getNftMints = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const query: NftMintQueryInput = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      definitionCode: req.query.definitionCode as string,
      contract: req.query.contract as string,
      network: req.query.network as string,
      status: req.query.status as 'MINTED' | 'TRANSFERRED' | 'BURNED',
      ownerWalletId: req.query.ownerWalletId as string,
      sortBy: (req.query.sortBy as 'mintedAt' | 'createdAt' | 'tokenId') || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const { mints, total } = await this.nftService.getNftMints(query);

    res.json({
      mints: mints.map(mint => ({
        id: mint.id,
        nftDefCode: mint.nftDefCode,
        tokenId: mint.tokenId,
        contract: mint.contract,
        network: mint.network,
        ownerWalletId: mint.ownerWalletId,
        mintedAt: mint.mintedAt,
        status: mint.status,
        createdAt: mint.createdAt,
        nftDefinition: mint.nftDefinition,
        ownerWallet: mint.ownerWallet,
        nftClaims: mint.nftClaims,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit),
      },
    });
  });

  /**
   * Finalize NFT claim (admin only)
   * PUT /nft/claims/:id/finalize
   */
  finalizeNftClaim = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const adminUserId = (req as any).user?.id;
    const input: FinalizeNftClaimInput = {
      nftClaimId: id,
      txHash: req.body.txHash,
      status: req.body.status,
      error: req.body.error,
    };

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const claim = await this.nftService.finalizeNftClaim(input, adminUserId);

    res.json({
      message: 'NFT claim finalized successfully',
      claim: {
        id: claim.id,
        userId: claim.userId,
        nftMintId: claim.nftMintId,
        claimType: claim.claimType,
        claimedAt: claim.claimedAt,
        status: claim.status,
        nftMint: claim.nftMint,
      },
    });
  });

  /**
   * Manual NFT claim allocation (admin only)
   * POST /nft/claims/manual
   */
  manualNftClaim = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;
    const input: ManualNftClaimInput = req.body;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const claim = await this.nftService.manualNftClaim(input, adminUserId);

    res.status(201).json({
      message: 'Manual NFT claim created successfully',
      claim: {
        id: claim.id,
        userId: claim.userId,
        nftMintId: claim.nftMintId,
        claimType: claim.claimType,
        claimedAt: claim.claimedAt,
        status: claim.status,
        nftMint: claim.nftMint,
        user: claim.user,
      },
    });
  });

  /**
   * Get NFT statistics (admin only)
   * GET /nft/stats
   */
  getNftStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const adminUserId = (req as any).user?.id;

    if (!adminUserId) {
      res.status(401).json({
        error: 'Admin authentication required',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    const stats = await this.nftService.getNftStats();

    res.json({
      stats: {
        totalDefinitions: stats.totalDefinitions,
        totalMints: stats.totalMints,
        totalClaims: stats.totalClaims,
        mintsByStatus: stats.mintsByStatus,
        claimsByStatus: stats.claimsByStatus,
        recentActivity: stats.recentActivity.map(claim => ({
          id: claim.id,
          claimType: claim.claimType,
          status: claim.status,
          claimedAt: claim.claimedAt,
          user: claim.user,
          nftMint: claim.nftMint,
        })),
      },
    });
  });
}
