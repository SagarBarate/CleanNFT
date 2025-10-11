import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { initializeDatabase, disconnectDatabase } from '../src/libs/db.js';

describe('Authentication API', () => {
  let app: any;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Initialize database
    await initializeDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(() => {
    // Reset state for each test
    authToken = '';
    userId = '';
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.displayName).toBe(userData.displayName);
      expect(response.body.user.roles).toContain('USER');
      expect(response.body.token).toBeDefined();

      // Store for other tests
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'TestPassword123!',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.error).toContain('Invalid email');
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        email: 'test2@example.com',
        password: 'weak',
        displayName: 'Test User',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.error).toContain('Password must be at least 8 characters');
    });

    it('should reject duplicate email registration', async () => {
      const userData = {
        email: 'test@example.com', // Same as previous test
        password: 'TestPassword123!',
        displayName: 'Test User 2',
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.code).toBe('DUPLICATE_ENTRY');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.token).toBeDefined();

      // Store for other tests
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123!',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.code).toBe('UNAUTHORIZED');
      expect(response.body.error).toContain('Invalid email or password');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should get user profile with valid token', async () => {
      // First login to get token
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.roles).toContain('USER');
      expect(response.body.user.stats).toBeDefined();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.code).toBe('MISSING_TOKEN');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.code).toBe('AUTH_FAILED');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully with valid session', async () => {
      // First login to get token
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Session-ID', 'test-session-id')
        .expect(200);

      expect(response.body.message).toBe('Logout successful');
    });
  });

  describe('GET /api/v1/auth/status', () => {
    it('should return authenticated status with valid token', async () => {
      // First login to get token
      const loginData = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData);

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/v1/auth/status')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.authenticated).toBe(true);
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should return unauthenticated status without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/status')
        .expect(401);

      expect(response.body.authenticated).toBe(false);
    });
  });
});
