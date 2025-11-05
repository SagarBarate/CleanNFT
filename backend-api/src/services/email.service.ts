import nodemailer from 'nodemailer';
import { logger } from '../libs/logger.js';
import { env } from '../config/env.js';

export interface ContactMessage {
  name?: string;
  email: string;
  subject?: string;
  message: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly recipientEmail = process.env.CONTACT_EMAIL || 'sagarbarateirl@gmail.com';

  constructor() {
    this.initializeTransporter();
  }

  /**
   * Initialize the email transporter
   * Supports both SMTP and Gmail OAuth2
   */
  private initializeTransporter(): void {
    try {
      // Check if email configuration is provided
      const emailHost = process.env.EMAIL_HOST;
      const emailPort = process.env.EMAIL_PORT;
      const emailUser = process.env.EMAIL_USER;
      const emailPassword = process.env.EMAIL_PASSWORD;

      // If no email configuration, use a test transporter (won't send emails)
      if (!emailHost || !emailUser || !emailPassword) {
        logger.warn('Email configuration not found. Using test transporter. Emails will not be sent.');
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'test',
            pass: 'test',
          },
        });
        return;
      }

      // Create SMTP transporter
      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort ? parseInt(emailPort, 10) : 587,
        secure: emailPort === '465',
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
        tls: {
          rejectUnauthorized: false, // For development/testing
        },
      });

      logger.info('Email transporter initialized successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize email transporter');
      this.transporter = null;
    }
  }

  /**
   * Send contact form message to recipient email
   */
  async sendContactMessage(data: ContactMessage): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    try {
      const subject = data.subject || `Contact Form Message from ${data.name || 'Anonymous'}`;
      
      // Format email body
      const emailBody = `
New Contact Form Submission

Name: ${data.name || 'Not provided'}
Email: ${data.email}
Subject: ${data.subject || 'No subject'}

Message:
${data.message}

---
This message was sent from the CleanNFT contact form.
Timestamp: ${new Date().toISOString()}
      `.trim();

      // Send email
      const mailOptions = {
        from: `"CleanNFT Contact Form" <${process.env.EMAIL_USER || 'noreply@cleannft.com'}>`,
        to: this.recipientEmail,
        replyTo: data.email,
        subject: subject,
        text: emailBody,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00A86B;">New Contact Form Submission</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #00A86B; margin: 20px 0;">
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This message was sent from the CleanNFT contact form.<br>
              Timestamp: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info({ messageId: info.messageId }, 'Contact form email sent successfully');
    } catch (error) {
      logger.error({ error, data }, 'Failed to send contact form email');
      throw error;
    }
  }

  /**
   * Verify email transporter connection
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.error({ error }, 'Email transporter verification failed');
      return false;
    }
  }
}

