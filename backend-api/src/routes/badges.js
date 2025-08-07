const express = require('express');
const router = express.Router();
const BadgeController = require('../controllers/badgeController');
const { body } = require('express-validator');

// Get all badges
router.get('/', BadgeController.getAllBadges);

// Get badge by ID
router.get('/:id', BadgeController.getBadgeById);

// Claim badge
router.post('/:id/claim', [
  body('userId').notEmpty().withMessage('User ID is required'),
], BadgeController.claimBadge);

// Get user badges
router.get('/user/:userId', BadgeController.getUserBadges);

module.exports = router;
