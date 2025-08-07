const { validationResult } = require('express-validator');

// Mock badges database
let badges = [
  {
    id: '1',
    name: 'Recycling Rookie',
    description: 'Recycle your first 10 bottles',
    icon: '🌱',
    pointsRequired: 500,
    isEarned: true,
    isClaimed: true,
    progress: 1.0,
  },
  {
    id: '2',
    name: 'Green Guardian',
    description: 'Recycle 50 bottles and earn 1000 points',
    icon: '🌿',
    pointsRequired: 1000,
    isEarned: true,
    isClaimed: true,
    progress: 1.0,
  },
  {
    id: '3',
    name: 'Eco Warrior',
    description: 'Recycle 100 bottles and earn 2000 points',
    icon: '🌳',
    pointsRequired: 2000,
    isEarned: false,
    isClaimed: false,
    progress: 0.75,
  },
  {
    id: '4',
    name: 'Sustainability Champion',
    description: 'Recycle 200 bottles and earn 5000 points',
    icon: '🏆',
    pointsRequired: 5000,
    isEarned: false,
    isClaimed: false,
    progress: 0.25,
  },
  {
    id: '5',
    name: 'Planet Protector',
    description: 'Recycle 500 bottles and earn 10000 points',
    icon: '🌍',
    pointsRequired: 10000,
    isEarned: false,
    isClaimed: false,
    progress: 0.125,
  },
];

// Mock user badges
let userBadges = [
  {
    userId: '1',
    badgeId: '1',
    earnedAt: '2024-01-10T10:30:00Z',
    claimedAt: '2024-01-10T10:35:00Z',
  },
  {
    userId: '1',
    badgeId: '2',
    earnedAt: '2024-01-12T14:20:00Z',
    claimedAt: '2024-01-12T14:25:00Z',
  },
  {
    userId: '2',
    badgeId: '1',
    earnedAt: '2024-01-11T09:15:00Z',
    claimedAt: '2024-01-11T09:20:00Z',
  },
];

class BadgeController {
  // Get all badges
  static async getAllBadges(req, res) {
    try {
      res.json({
        success: true,
        data: badges,
        count: badges.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch badges',
        message: error.message,
      });
    }
  }

  // Get badge by ID
  static async getBadgeById(req, res) {
    try {
      const { id } = req.params;
      const badge = badges.find(b => b.id === id);

      if (!badge) {
        return res.status(404).json({
          success: false,
          error: 'Badge not found',
        });
      }

      res.json({
        success: true,
        data: badge,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch badge',
        message: error.message,
      });
    }
  }

  // Claim badge
  static async claimBadge(req, res) {
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

      const badge = badges.find(b => b.id === id);
      if (!badge) {
        return res.status(404).json({
          success: false,
          error: 'Badge not found',
        });
      }

      if (!badge.isEarned) {
        return res.status(400).json({
          success: false,
          error: 'Badge not yet earned',
        });
      }

      if (badge.isClaimed) {
        return res.status(400).json({
          success: false,
          error: 'Badge already claimed',
        });
      }

      // Update badge status
      const badgeIndex = badges.findIndex(b => b.id === id);
      badges[badgeIndex].isClaimed = true;

      // Record user badge claim
      userBadges.push({
        userId,
        badgeId: id,
        earnedAt: new Date().toISOString(),
        claimedAt: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: badges[badgeIndex],
        message: 'Badge claimed successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to claim badge',
        message: error.message,
      });
    }
  }

  // Get user badges
  static async getUserBadges(req, res) {
    try {
      const { userId } = req.params;

      const userBadgeList = userBadges.filter(ub => ub.userId === userId);
      const userBadgeDetails = userBadgeList.map(ub => {
        const badge = badges.find(b => b.id === ub.badgeId);
        return {
          ...badge,
          earnedAt: ub.earnedAt,
          claimedAt: ub.claimedAt,
        };
      });

      res.json({
        success: true,
        data: userBadgeDetails,
        count: userBadgeDetails.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user badges',
        message: error.message,
      });
    }
  }
}

module.exports = BadgeController;
