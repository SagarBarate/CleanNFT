import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { body, validationResult } from 'express-validator';

export const contactRoutes = Router();
const contactController = new ContactController();

/**
 * Contact form routes
 */

// Submit contact form
contactRoutes.post(
  '/contact',
  authLimiter, // Use rate limiting to prevent spam
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('message')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Message must be at least 10 characters'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters if provided'),
    body('subject')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Subject must be at least 3 characters if provided'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    next();
  },
  contactController.submitContact
);




