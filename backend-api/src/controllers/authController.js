const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock users database
let users = [
  {
    id: '1',
    email: 'admin@recycling.com',
    password: '$2a$10$example.hash', // bcrypt hash
    name: 'Admin User',
    role: 'admin',
  },
];

class AuthController {
  // Login user
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // In a real app, you would verify the password hash
      // For demo purposes, we'll accept any password
      const isValidPassword = true; // bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
        message: 'Login successful',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: error.message,
      });
    }
  }

  // Logout user
  static async logout(req, res) {
    try {
      // In a real app, you might blacklist the token
      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        message: error.message,
      });
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      // In a real app, you would get the user from the JWT token
      const userId = req.headers['user-id'] || '1';
      const user = users.find(u => u.id === userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get current user',
        message: error.message,
      });
    }
  }
}

module.exports = AuthController;
