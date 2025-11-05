import type { Request, Response } from 'express';
import { EmailService, type ContactMessage } from '../services/email.service.js';
import { logger } from '../libs/logger.js';
import { asyncHandler } from '../middleware/error.js';

export class ContactController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Handle contact form submission
   * POST /api/v1/contact
   */
  submitContact = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!email || !message) {
      res.status(400).json({
        success: false,
        error: 'Email and message are required',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
      return;
    }

    // Validate message length
    if (message.length < 10) {
      res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters',
      });
      return;
    }

    try {
      const contactData: ContactMessage = {
        name: name?.trim(),
        email: email.trim(),
        subject: subject?.trim(),
        message: message.trim(),
      };

      // Send email
      await this.emailService.sendContactMessage(contactData);

      logger.info({ email, name }, 'Contact form submission received');

      res.json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.',
      });
    } catch (error) {
      logger.error({ error, email }, 'Failed to process contact form submission');
      
      // Check if it's an email configuration error
      if (error instanceof Error && error.message.includes('transporter not initialized')) {
        res.status(503).json({
          success: false,
          error: 'Email service is not configured. Please contact support directly.',
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to send message. Please try again later.',
      });
    }
  });
}




