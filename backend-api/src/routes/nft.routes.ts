import { Router } from 'express';
import { NftController } from '../controllers/nft.controller.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { nftClaimLimiter } from '../middleware/rateLimit.js';
import { 
  createNftDefinitionSchema, 
  updateNftDefinitionSchema, 
  createNftMintBatchSchema,
  createNftClaimSchema,
  finalizeNftClaimSchema,
  manualNftClaimSchema
} from '../validators/nft.schemas.js';
import { validateRequest } from '../middleware/validation.js';

export const nftRoutes = Router();
const nftController = new NftController();

/**
 * NFT system routes
 */

// Get all NFT definitions
nftRoutes.get('/nft/definitions',
  nftController.getNftDefinitions
);

// Get NFT definition by code
nftRoutes.get('/nft/definitions/:code',
  nftController.getNftDefinition
);

// Create NFT definition (admin only)
nftRoutes.post('/nft/definitions',
  authenticateToken,
  requireAdmin,
  validateRequest(createNftDefinitionSchema),
  nftController.createNftDefinition
);

// Update NFT definition (admin only)
nftRoutes.put('/nft/definitions/:code',
  authenticateToken,
  requireAdmin,
  validateRequest(updateNftDefinitionSchema),
  nftController.updateNftDefinition
);

// Create NFT mint batch (admin only)
nftRoutes.post('/nft/mint-batch',
  authenticateToken,
  requireAdmin,
  validateRequest(createNftMintBatchSchema),
  nftController.createNftMintBatch
);

// Claim NFT
nftRoutes.post('/nft/claim',
  authenticateToken,
  nftClaimLimiter,
  validateRequest(createNftClaimSchema),
  nftController.claimNft
);

// Get user's NFT claims
nftRoutes.get('/nft/my',
  authenticateToken,
  nftController.getMyNftClaims
);

// Get NFT mints (admin only)
nftRoutes.get('/nft/mints',
  authenticateToken,
  requireAdmin,
  nftController.getNftMints
);

// Finalize NFT claim (admin only)
nftRoutes.put('/nft/claims/:id/finalize',
  authenticateToken,
  requireAdmin,
  validateRequest(finalizeNftClaimSchema),
  nftController.finalizeNftClaim
);

// Manual NFT claim allocation (admin only)
nftRoutes.post('/nft/claims/manual',
  authenticateToken,
  requireAdmin,
  validateRequest(manualNftClaimSchema),
  nftController.manualNftClaim
);

// Get NFT statistics (admin only)
nftRoutes.get('/nft/stats',
  authenticateToken,
  requireAdmin,
  nftController.getNftStats
);
