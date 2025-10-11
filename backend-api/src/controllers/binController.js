const { validationResult } = require('express-validator');
const { ethers } = require('ethers');
const QRCode = require('qrcode');

// Mock database - in a real app, this would be MongoDB or PostgreSQL
let bins = [
  {
    id: 'BIN-001',
    location: 'Central Park - Main Entrance',
    status: 'active',
    bottlesRecycled: 150,
    totalPoints: 7500,
    lastActivity: '2024-01-15T14:30:00Z',
    qrCodeData: {
      binId: 'BIN-001',
      location: 'Central Park - Main Entrance',
      type: 'recycling_bin',
    },
  },
  {
    id: 'BIN-002',
    location: 'Shopping Mall - Food Court',
    status: 'active',
    bottlesRecycled: 89,
    totalPoints: 4450,
    lastActivity: '2024-01-15T13:45:00Z',
    qrCodeData: {
      binId: 'BIN-002',
      location: 'Shopping Mall - Food Court',
      type: 'recycling_bin',
    },
  },
];

// Mock users for tracking recycling activity
let users = [
  {
    id: '1',
    name: 'John Doe',
    totalPoints: 1250,
    bottlesRecycled: 25,
    badgesEarned: 2,
    nftTokens: 1,
  },
];

class BinController {
  // Get all bins
  static async getAllBins(req, res) {
    try {
      res.json({
        success: true,
        data: bins,
        count: bins.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bins',
        message: error.message,
      });
    }
  }

  // Get bin by ID
  static async getBinById(req, res) {
    try {
      const { id } = req.params;
      const bin = bins.find(b => b.id === id);

      if (!bin) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found',
        });
      }

      res.json({
        success: true,
        data: bin,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bin',
        message: error.message,
      });
    }
  }

  // Create new bin
  static async createBin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { location, status = 'active' } = req.body;
      const binId = `BIN-${String(bins.length + 1).padStart(3, '0')}`;

      const newBin = {
        id: binId,
        location,
        status,
        bottlesRecycled: 0,
        totalPoints: 0,
        lastActivity: new Date().toISOString(),
        qrCodeData: {
          binId,
          location,
          type: 'recycling_bin',
        },
      };

      bins.push(newBin);

      res.status(201).json({
        success: true,
        data: newBin,
        message: 'Bin created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to create bin',
        message: error.message,
      });
    }
  }

  // Update bin
  static async updateBin(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const binIndex = bins.findIndex(b => b.id === id);

      if (binIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found',
        });
      }

      const { location, status } = req.body;
      const updatedBin = { ...bins[binIndex] };

      if (location) {
        updatedBin.location = location;
        updatedBin.qrCodeData.location = location;
      }

      if (status) {
        updatedBin.status = status;
      }

      bins[binIndex] = updatedBin;

      res.json({
        success: true,
        data: updatedBin,
        message: 'Bin updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to update bin',
        message: error.message,
      });
    }
  }

  // Delete bin
  static async deleteBin(req, res) {
    try {
      const { id } = req.params;
      const binIndex = bins.findIndex(b => b.id === id);

      if (binIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found',
        });
      }

      bins.splice(binIndex, 1);

      res.json({
        success: true,
        message: 'Bin deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete bin',
        message: error.message,
      });
    }
  }

  // Get bin QR code
  static async getBinQRCode(req, res) {
    try {
      const { id } = req.params;
      const bin = bins.find(b => b.id === id);

      if (!bin) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found',
        });
      }

      const qrCodeData = JSON.stringify(bin.qrCodeData);
      const qrCodeBuffer = await QRCode.toBuffer(qrCodeData, {
        type: 'image/png',
        width: 256,
        margin: 2,
      });

      res.set('Content-Type', 'image/png');
      res.send(qrCodeBuffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate QR code',
        message: error.message,
      });
    }
  }

  // Get bin statistics
  static async getBinStats(req, res) {
    try {
      const { id } = req.params;
      const bin = bins.find(b => b.id === id);

      if (!bin) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found',
        });
      }

      const stats = {
        binId: bin.id,
        location: bin.location,
        status: bin.status,
        bottlesRecycled: bin.bottlesRecycled,
        totalPoints: bin.totalPoints,
        lastActivity: bin.lastActivity,
        averageBottlesPerDay: Math.round(bin.bottlesRecycled / 30), // Mock calculation
        pointsPerBottle: bin.bottlesRecycled > 0 ? Math.round(bin.totalPoints / bin.bottlesRecycled) : 0,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch bin statistics',
        message: error.message,
      });
    }
  }

  // Record bottle recycling
  static async recordRecycling(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { bottles, userId } = req.body;

      const binIndex = bins.findIndex(b => b.id === id);
      if (binIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Bin not found',
        });
      }

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Calculate points (50 points per bottle)
      const pointsEarned = bottles * 50;

      // Update bin
      bins[binIndex].bottlesRecycled += bottles;
      bins[binIndex].totalPoints += pointsEarned;
      bins[binIndex].lastActivity = new Date().toISOString();

      // Update user
      users[userIndex].bottlesRecycled += bottles;
      users[userIndex].totalPoints += pointsEarned;

      // Check for badge eligibility
      const newBadges = checkBadgeEligibility(users[userIndex]);
      if (newBadges.length > 0) {
        users[userIndex].badgesEarned += newBadges.length;
      }

      // Check for NFT eligibility
      const newNFTs = checkNFTEligibility(users[userIndex]);
      if (newNFTs.length > 0) {
        users[userIndex].nftTokens += newNFTs.length;
      }

      res.json({
        success: true,
        data: {
          bottlesRecycled: bottles,
          pointsEarned,
          totalPoints: users[userIndex].totalPoints,
          newBadges,
          newNFTs,
        },
        message: 'Recycling recorded successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to record recycling',
        message: error.message,
      });
    }
  }
}

// Helper functions
function checkBadgeEligibility(user) {
  const badges = [];
  const totalBottles = user.bottlesRecycled;

  if (totalBottles >= 10 && user.badgesEarned < 1) {
    badges.push('Recycling Rookie');
  }
  if (totalBottles >= 50 && user.badgesEarned < 2) {
    badges.push('Green Guardian');
  }
  if (totalBottles >= 100 && user.badgesEarned < 3) {
    badges.push('Eco Warrior');
  }

  return badges;
}

function checkNFTEligibility(user) {
  const nfts = [];
  const totalPoints = user.totalPoints;

  if (totalPoints >= 2000 && user.nftTokens < 1) {
    nfts.push('Recycling Pioneer');
  }
  if (totalPoints >= 5000 && user.nftTokens < 2) {
    nfts.push('Green Innovator');
  }
  if (totalPoints >= 10000 && user.nftTokens < 3) {
    nfts.push('Sustainability Leader');
  }

  return nfts;
}

module.exports = BinController;
