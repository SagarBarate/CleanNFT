const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AuthController = require('../controllers/authController');

// Register new user
router.post('/signup', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
], AuthController.signup);

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], AuthController.login);

// Logout user
router.post('/logout', AuthController.logout);

// Get current user
router.get('/me', AuthController.getCurrentUser);

module.exports = router;
