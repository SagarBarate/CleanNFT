const { validationResult } = require('express-validator');
const { ethers } = require('ethers');

// Mock NFTs database
let nfts = [
  {
    id: '1',
    name: 'Recycling Pioneer',
    description: 'First NFT for recycling 100 bottles',
    image: '🌱',
    tokenId: 1,
    owner: 'John Doe',
    mintedAt: '2024-01-10T10:30:00Z',
    pointsRequired: 2000,
    rarity: 'common',
    status: 'minted',
  },
  {
    id: '2',
    name: 'Green Innovator',
    description: 'NFT for recycling 500 bottles',
    image: '🌿',
    tokenId: 2,
    owner: 'Mike Johnson',
    mintedAt: '2024-01-12T14:20:00Z',
    pointsRequired: 5000,
    rarity: 'rare',
    status: 'minted',
  },
  {
    id: '3',
    name: 'Sustainability Leader',
    description: 'NFT for recycling 1000 bottles',
    image: '🌳',
    tokenId: 3,
    owner: 'Available',
    mintedAt: 'Not minted',
    pointsRequired: 10000,
    rarity: 'epic',
    status: 'available',
  },
];

class NFTController {
  // Get all NFTs
  static async getAllNFTs(req, res) {
    try {
      res.json({
        success: true,
        data: nfts,
        count: nfts.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch NFTs',
        message: error.message,
      });
    }
  }

  // Get NFT by ID
  static async getNFTById(req, res) {
    try {
      const { id } = req.params;
      const nft = nfts.find(n => n.id === id);

      if (!nft) {
        return res.status(404).json({
          success: false,
          error: 'NFT not found',
        });
      }

      res.json({
        success: true,
        data: nft,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch NFT',
        message: error.message,
      });
    }
  }

  // Create new NFT
  static async createNFT(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, description, pointsRequired, rarity = 'common' } = req.body;
      const nftId = String(nfts.length + 1);
      const tokenId = nfts.length + 1;

      const newNFT = {
        id: nftId,
        name,
        description,
        image: '🌱',
        tokenId,
        owner: 'Available',
        mintedAt: 'Not minted',
        pointsRequired,
        rarity,
        status: 'available',
      };

      nfts.push(newNFT);

      res.status(201).json({
        success: true,
        data: newNFT,
        message: 'NFT created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create NFT',
        message: error.message,
      });
    }
  }

  // Mint NFT
  static async mintNFT(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { userId } = req.body;

      const nftIndex = nfts.findIndex(n => n.id === id);
      if (nftIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'NFT not found',
        });
      }

      const nft = nfts[nftIndex];
      if (nft.status !== 'available') {
        return res.status(400).json({
          success: false,
          error: 'NFT is not available for minting',
        });
      }

      // In a real app, you would interact with the smart contract here
      // For demo purposes, we'll just update the status
      nfts[nftIndex].status = 'minted';
      nfts[nftIndex].owner = `User ${userId}`;
      nfts[nftIndex].mintedAt = new Date().toISOString();

      res.json({
        success: true,
        data: nfts[nftIndex],
        message: 'NFT minted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to mint NFT',
        message: error.message,
      });
    }
  }

  // Update NFT
  static async updateNFT(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const nftIndex = nfts.findIndex(n => n.id === id);

      if (nftIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'NFT not found',
        });
      }

      const { name, description, pointsRequired, rarity } = req.body;
      const updatedNFT = { ...nfts[nftIndex] };

      if (name) updatedNFT.name = name;
      if (description) updatedNFT.description = description;
      if (pointsRequired) updatedNFT.pointsRequired = pointsRequired;
      if (rarity) updatedNFT.rarity = rarity;

      nfts[nftIndex] = updatedNFT;

      res.json({
        success: true,
        data: updatedNFT,
        message: 'NFT updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update NFT',
        message: error.message,
      });
    }
  }

  // Delete NFT
  static async deleteNFT(req, res) {
    try {
      const { id } = req.params;
      const nftIndex = nfts.findIndex(n => n.id === id);

      if (nftIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'NFT not found',
        });
      }

      nfts.splice(nftIndex, 1);

      res.json({
        success: true,
        message: 'NFT deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete NFT',
        message: error.message,
      });
    }
  }
}

module.exports = NFTController;
