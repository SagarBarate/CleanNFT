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
    phone: '+1234567890',
    profileImage: null,
    totalPoints: 0,
    bottlesRecycled: 0,
    badgesEarned: 0,
    nftTokens: 0,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  },
];

class AuthController {
  // Register new user
  static async signup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // In a real app, you would hash the password
      // const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        password: password, // In real app, use hashedPassword
        phone: phone || null,
        profileImage: null,
        role: 'user',
        totalPoints: 0,
        bottlesRecycled: 0,
        badgesEarned: 0,
        nftTokens: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      users.push(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            totalPoints: newUser.totalPoints,
            bottlesRecycled: newUser.bottlesRecycled,
            badgesEarned: newUser.badgesEarned,
            nftTokens: newUser.nftTokens,
            createdAt: newUser.createdAt,
          },
          token,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        message: error.message,
      });
    }
  }

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

      // Update last login
      user.lastLogin = new Date().toISOString();

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            totalPoints: user.totalPoints,
            bottlesRecycled: user.bottlesRecycled,
            badgesEarned: user.badgesEarned,
            nftTokens: user.nftTokens,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
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



