const { validationResult } = require('express-validator');

// Mock users database
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    totalPoints: 1250,
    bottlesRecycled: 25,
    badgesEarned: 2,
    nftTokens: 1,
    progressToNextBadge: 0.75,
    progressToNFT: 0.6,
    lastActivity: '2024-01-15T14:30:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    totalPoints: 890,
    bottlesRecycled: 18,
    badgesEarned: 1,
    nftTokens: 0,
    progressToNextBadge: 0.45,
    progressToNFT: 0.3,
    lastActivity: '2024-01-15T13:45:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    totalPoints: 2100,
    bottlesRecycled: 42,
    badgesEarned: 3,
    nftTokens: 2,
    progressToNextBadge: 0.9,
    progressToNFT: 0.8,
    lastActivity: '2024-01-15T14:20:00Z',
    status: 'active',
  },
];

class UserController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      res.json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
        message: error.message,
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = users.find(u => u.id === id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user',
        message: error.message,
      });
    }
  }

  // Get user statistics
  static async getUserStats(req, res) {
    try {
      const { id } = req.params;
      const user = users.find(u => u.id === id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const stats = {
        userId: user.id,
        name: user.name,
        totalPoints: user.totalPoints,
        bottlesRecycled: user.bottlesRecycled,
        badgesEarned: user.badgesEarned,
        nftTokens: user.nftTokens,
        progressToNextBadge: user.progressToNextBadge,
        progressToNFT: user.progressToNFT,
        lastActivity: user.lastActivity,
        status: user.status,
        averageBottlesPerDay: Math.round(user.bottlesRecycled / 30),
        pointsPerBottle: user.bottlesRecycled > 0 ? Math.round(user.totalPoints / user.bottlesRecycled) : 0,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics',
        message: error.message,
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const { name, email, status } = req.body;
      const updatedUser = { ...users[userIndex] };

      if (name) updatedUser.name = name;
      if (email) updatedUser.email = email;
      if (status) updatedUser.status = status;

      users[userIndex] = updatedUser;

      res.json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update user',
        message: error.message,
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const userIndex = users.findIndex(u => u.id === id);

      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      users.splice(userIndex, 1);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
        message: error.message,
      });
    }
  }
}

module.exports = UserController;
