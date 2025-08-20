const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const NFTController = require('../controllers/nftController');

// Get all NFTs
router.get('/', NFTController.getAllNFTs);

// Get NFT by ID
router.get('/:id', NFTController.getNFTById);

// Create new NFT
router.post('/', [
  body('name').notEmpty().withMessage('NFT name is required'),
  body('description').notEmpty().withMessage('NFT description is required'),
  body('pointsRequired').isInt({ min: 0 }).withMessage('Points required must be a positive integer'),
], NFTController.createNFT);

// Mint NFT
router.post('/:id/mint', [
  body('userId').notEmpty().withMessage('User ID is required'),
], NFTController.mintNFT);

// Update NFT
router.put('/:id', NFTController.updateNFT);

// Delete NFT
router.delete('/:id', NFTController.deleteNFT);

module.exports = router;



