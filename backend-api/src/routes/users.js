const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Get user statistics
router.get('/:id/stats', UserController.getUserStats);

// Update user
router.put('/:id', UserController.updateUser);

// Delete user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
