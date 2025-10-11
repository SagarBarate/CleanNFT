const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BinController = require('../controllers/binController');

// Get all bins
router.get('/', BinController.getAllBins);

// Get bin by ID
router.get('/:id', BinController.getBinById);

// Create new bin
router.post('/', [
  body('location').notEmpty().withMessage('Location is required'),
  body('status').isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
], BinController.createBin);

// Update bin
router.put('/:id', [
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid status'),
], BinController.updateBin);

// Delete bin
router.delete('/:id', BinController.deleteBin);

// Get bin QR code
router.get('/:id/qr', BinController.getBinQRCode);

// Get bin statistics
router.get('/:id/stats', BinController.getBinStats);

// Record bottle recycling
router.post('/:id/recycle', [
  body('bottles').isInt({ min: 1 }).withMessage('Bottles must be a positive integer'),
  body('userId').notEmpty().withMessage('User ID is required'),
], BinController.recordRecycling);

module.exports = router;
