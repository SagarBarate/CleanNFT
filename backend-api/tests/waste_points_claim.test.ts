import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { initializeDatabase, disconnectDatabase } from '../src/libs/db.js';
import { getPrismaClient } from '../src/libs/db.js';

describe('Waste Events, Points, and NFT Claims Integration', () => {
  let app: any;
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminUserId: string;
  let prisma: any;

  beforeAll(async () => {
    // Initialize database
    await initializeDatabase();
    app = createApp();
    prisma = getPrismaClient();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    // Create test user for each test
    const userData = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      displayName: 'Test User',
    };

    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    userToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;

    // Create admin user
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@cleannft.com' },
    });

    if (adminUser) {
      adminUserId = adminUser.id;
      // Login as admin
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@cleannft.com',
          password: 'admin123!',
        });
      adminToken = loginResponse.body.token;
    }
  });

  describe('Waste Events Flow', () => {
    it('should create waste event and award points', async () => {
      const wasteEventData = {
        stationCode: 'STATION_001',
        deviceHwId: 'DEVICE_001',
        materialType: 'plastic',
        weightGrams: 2500, // 2.5kg
        source: 'IOT',
        rawPayload: {
          temperature: 22.5,
          humidity: 45.2,
        },
      };

      const response = await request(app)
        .post('/api/v1/waste-events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(wasteEventData)
        .expect(201);

      expect(response.body.message).toBe('Waste event created successfully');
      expect(response.body.wasteEvent.materialType).toBe('plastic');
      expect(response.body.wasteEvent.weightGrams).toBe(2500);
      expect(response.body.pointsAwarded).toBeGreaterThan(0);
    });

    it('should handle duplicate waste events (idempotency)', async () => {
      const wasteEventData = {
        deviceHwId: 'DEVICE_001',
        materialType: 'paper',
        weightGrams: 1000,
        source: 'IOT',
        rawPayload: {
          nonce: 'test-nonce-123',
        },
      };

      // Create first event
      const response1 = await request(app)
        .post('/api/v1/waste-events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(wasteEventData)
        .expect(201);

      expect(response1.body.pointsAwarded).toBeGreaterThan(0);

      // Try to create duplicate event with same nonce
      const response2 = await request(app)
        .post('/api/v1/waste-events')
        .set('Authorization', `Bearer ${userToken}`)
        .send(wasteEventData)
        .expect(201);

      // Should return existing event with no additional points
      expect(response2.body.wasteEvent.id).toBe(response1.body.wasteEvent.id);
      expect(response2.body.pointsAwarded).toBe(0);
    });

    it('should get user waste events', async () => {
      // Create a waste event first
      await request(app)
        .post('/api/v1/waste-events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          materialType: 'metal',
          weightGrams: 1500,
          source: 'MANUAL',
        });

      const response = await request(app)
        .get('/api/v1/waste-events/my')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.wasteEvents.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('Points System', () => {
    it('should update point balance via trigger after waste event', async () => {
      // Create waste event
      const wasteEventResponse = await request(app)
        .post('/api/v1/waste-events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          materialType: 'plastic',
          weightGrams: 1000, // 1kg
          source: 'IOT',
        });

      const pointsAwarded = wasteEventResponse.body.pointsAwarded;

      // Check point balance
      const balanceResponse = await request(app)
        .get('/api/v1/points/balance')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(balanceResponse.body.balance.points).toBe(pointsAwarded);
    });

    it('should get point ledger', async () => {
      // Create waste event to generate points
      await request(app)
        .post('/api/v1/waste-events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          materialType: 'glass',
          weightGrams: 2000,
          source: 'QR',
        });

      const response = await request(app)
        .get('/api/v1/points/ledger')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.ledger.length).toBeGreaterThan(0);
      expect(response.body.ledger[0].deltaPoints).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });

    it('should get point summary', async () => {
      const response = await request(app)
        .get('/api/v1/points/summary')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.summary.currentBalance).toBeDefined();
      expect(response.body.summary.totalEarned).toBeDefined();
      expect(response.body.summary.reasonStats).toBeDefined();
    });
  });

  describe('NFT Claims', () => {
    it('should claim NFT successfully', async () => {
      // First, create an NFT definition and mint (as admin)
      const nftDefinitionResponse = await request(app)
        .post('/api/v1/nft/definitions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'TEST_BADGE',
          name: 'Test Badge',
          description: 'A test badge for testing',
          attributes: {
            rarity: 'common',
            category: 'test',
          },
          supplyCap: 100,
        })
        .expect(201);

      // Create NFT mint batch
      const mintResponse = await request(app)
        .post('/api/v1/nft/mint-batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          definitionCode: 'TEST_BADGE',
          count: 5,
          contract: '0x1234567890123456789012345678901234567890',
          network: 'polygon-amoy',
          ownerWalletId: adminUserId,
        })
        .expect(201);

      // Claim NFT
      const claimResponse = await request(app)
        .post('/api/v1/nft/claim')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          definitionCode: 'TEST_BADGE',
          claimType: 'DRIP',
        })
        .expect(201);

      expect(claimResponse.body.message).toBe('NFT claim initiated successfully');
      expect(claimResponse.body.claim.status).toBe('PENDING');
      expect(claimResponse.body.nftMint).toBeDefined();
    });

    it('should handle concurrent NFT claims without double-claiming', async () => {
      // Create NFT definition and mints
      await request(app)
        .post('/api/v1/nft/definitions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          code: 'CONCURRENT_TEST',
          name: 'Concurrent Test',
          description: 'For testing concurrent claims',
          supplyCap: 1,
        });

      await request(app)
        .post('/api/v1/nft/mint-batch')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          definitionCode: 'CONCURRENT_TEST',
          count: 1,
          contract: '0x1234567890123456789012345678901234567890',
          network: 'polygon-amoy',
          ownerWalletId: adminUserId,
        });

      // Create multiple users for concurrent testing
      const users = [];
      for (let i = 0; i < 3; i++) {
        const userData = {
          email: `concurrent-${i}-${Date.now()}@example.com`,
          password: 'TestPassword123!',
          displayName: `Concurrent User ${i}`,
        };

        const registerResponse = await request(app)
          .post('/api/v1/auth/register')
          .send(userData);

        users.push({
          token: registerResponse.body.token,
          id: registerResponse.body.user.id,
        });
      }

      // Attempt concurrent claims
      const claimPromises = users.map(user =>
        request(app)
          .post('/api/v1/nft/claim')
          .set('Authorization', `Bearer ${user.token}`)
          .send({
            definitionCode: 'CONCURRENT_TEST',
            claimType: 'DRIP',
          })
      );

      const results = await Promise.allSettled(claimPromises);

      // Only one should succeed, others should fail with conflict
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 201);
      const failed = results.filter(r => r.status === 'fulfilled' && r.value.status === 409);

      expect(successful.length).toBe(1);
      expect(failed.length).toBe(2);
    });

    it('should get user NFT claims', async () => {
      const response = await request(app)
        .get('/api/v1/nft/my')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.claims).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('Admin Functions', () => {
    it('should get analytics (admin only)', async () => {
      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.analytics).toBeDefined();
      expect(response.body.analytics.users).toBeDefined();
      expect(response.body.analytics.waste).toBeDefined();
      expect(response.body.analytics.points).toBeDefined();
      expect(response.body.analytics.nfts).toBeDefined();
    });

    it('should get system health (admin only)', async () => {
      const response = await request(app)
        .get('/api/v1/admin/health')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.health).toBeDefined();
      expect(response.body.health.database).toBe(true);
      expect(response.body.health.overall).toBeDefined();
    });

    it('should reject admin endpoints for regular users', async () => {
      const response = await request(app)
        .get('/api/v1/admin/analytics')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.code).toBe('INSUFFICIENT_PERMISSIONS');
    });
  });
});
