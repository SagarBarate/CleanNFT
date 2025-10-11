import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/crypto.js';
import { logger } from '../src/libs/logger.js';

const prisma = new PrismaClient();

/**
 * Seed the database with initial data
 */
async function main() {
  try {
    logger.info('Starting database seeding...');

    // Create roles
    const roles = await Promise.all([
      prisma.role.upsert({
        where: { code: 'ADMIN' },
        update: {},
        create: {
          code: 'ADMIN',
          name: 'Administrator',
          description: 'System administrator with full access',
        },
      }),
      prisma.role.upsert({
        where: { code: 'USER' },
        update: {},
        create: {
          code: 'USER',
          name: 'User',
          description: 'Regular user with basic access',
        },
      }),
    ]);

    logger.info({ roles: roles.map(r => r.code) }, 'Created roles');

    // Create admin user
    const adminPassword = await hashPassword('admin123!');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@cleannft.com' },
      update: {},
      create: {
        email: 'admin@cleannft.com',
        displayName: 'CleanNFT Admin',
        isActive: true,
        authAccounts: {
          create: {
            provider: 'PASSWORD',
            providerUid: 'admin@cleannft.com',
            passwordHash: adminPassword,
          },
        },
        userRoles: {
          create: {
            roleCode: 'ADMIN',
          },
        },
      },
    });

    logger.info({ userId: adminUser.id, email: adminUser.email }, 'Created admin user');

    // Create demo user
    const demoPassword = await hashPassword('demo123!');
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@cleannft.com' },
      update: {},
      create: {
        email: 'demo@cleannft.com',
        displayName: 'Demo User',
        isActive: true,
        authAccounts: {
          create: {
            provider: 'PASSWORD',
            providerUid: 'demo@cleannft.com',
            passwordHash: demoPassword,
          },
        },
        userRoles: {
          create: {
            roleCode: 'USER',
          },
        },
      },
    });

    logger.info({ userId: demoUser.id, email: demoUser.email }, 'Created demo user');

    // Create recycling stations
    const stations = await Promise.all([
      prisma.recyclingStation.upsert({
        where: { code: 'STATION_001' },
        update: {},
        create: {
          code: 'STATION_001',
          name: 'Downtown Recycling Center',
          location: '123 Main Street, Downtown',
          metadata: {
            capacity: 1000,
            operatingHours: '24/7',
            contactPhone: '+1-555-0123',
          },
        },
      }),
      prisma.recyclingStation.upsert({
        where: { code: 'STATION_002' },
        update: {},
        create: {
          code: 'STATION_002',
          name: 'Mall Recycling Hub',
          location: '456 Shopping Mall, Midtown',
          metadata: {
            capacity: 500,
            operatingHours: '6:00 AM - 10:00 PM',
            contactPhone: '+1-555-0456',
          },
        },
      }),
    ]);

    logger.info({ stations: stations.map(s => s.code) }, 'Created recycling stations');

    // Create devices
    const devices = await Promise.all([
      prisma.device.upsert({
        where: { hwId: 'DEVICE_001' },
        update: {},
        create: {
          stationCode: 'STATION_001',
          hwId: 'DEVICE_001',
          status: 'ACTIVE',
          metadata: {
            type: 'SMART_BIN',
            model: 'CleanBin Pro',
            firmware: '1.2.3',
            lastMaintenance: new Date(),
          },
        },
      }),
      prisma.device.upsert({
        where: { hwId: 'DEVICE_002' },
        update: {},
        create: {
          stationCode: 'STATION_001',
          hwId: 'DEVICE_002',
          status: 'ACTIVE',
          metadata: {
            type: 'SMART_BIN',
            model: 'CleanBin Pro',
            firmware: '1.2.3',
            lastMaintenance: new Date(),
          },
        },
      }),
      prisma.device.upsert({
        where: { hwId: 'DEVICE_003' },
        update: {},
        create: {
          stationCode: 'STATION_002',
          hwId: 'DEVICE_003',
          status: 'ACTIVE',
          metadata: {
            type: 'SMART_BIN',
            model: 'CleanBin Lite',
            firmware: '1.1.0',
            lastMaintenance: new Date(),
          },
        },
      }),
    ]);

    logger.info({ devices: devices.map(d => d.hwId) }, 'Created devices');

    // Create point rules
    const pointRules = await Promise.all([
      prisma.pointRule.upsert({
        where: { code: 'DUMP_WEIGHTED' },
        update: {},
        create: {
          code: 'DUMP_WEIGHTED',
          description: 'Points awarded based on weight of recycled materials',
          pointsExpr: { type: 'per_kg', value: 10 },
          activeFrom: new Date(),
        },
      }),
      prisma.pointRule.upsert({
        where: { code: 'FIRST_DUMP_BONUS' },
        update: {},
        create: {
          code: 'FIRST_DUMP_BONUS',
          description: 'Bonus points for first waste dump',
          pointsExpr: { type: 'flat', value: 100 },
          activeFrom: new Date(),
        },
      }),
      prisma.pointRule.upsert({
        where: { code: 'PLASTIC_BONUS' },
        update: {},
        create: {
          code: 'PLASTIC_BONUS',
          description: 'Extra points for plastic recycling',
          pointsExpr: { type: 'per_kg', value: 15 },
          activeFrom: new Date(),
        },
      }),
    ]);

    logger.info({ rules: pointRules.map(r => r.code) }, 'Created point rules');

    // Create NFT definitions
    const nftDefinitions = await Promise.all([
      prisma.nftDefinition.upsert({
        where: { code: 'RECYCLER_BADGE' },
        update: {},
        create: {
          code: 'RECYCLER_BADGE',
          name: 'Recycler Badge',
          description: 'Awarded for your first successful recycling action',
          imageIpfsCid: 'QmRecyclerBadgeExample',
          attributes: {
            rarity: 'common',
            category: 'achievement',
            tier: 1,
          },
          supplyCap: 10000,
          createdBy: adminUser.id,
        },
      }),
      prisma.nftDefinition.upsert({
        where: { code: 'PLASTIC_HERO' },
        update: {},
        create: {
          code: 'PLASTIC_HERO',
          name: 'Plastic Hero',
          description: 'Awarded for recycling 10kg of plastic',
          imageIpfsCid: 'QmPlasticHeroExample',
          attributes: {
            rarity: 'uncommon',
            category: 'achievement',
            tier: 2,
            requirement: '10kg_plastic',
          },
          supplyCap: 5000,
          createdBy: adminUser.id,
        },
      }),
      prisma.nftDefinition.upsert({
        where: { code: 'ENVIRONMENTAL_CHAMPION' },
        update: {},
        create: {
          code: 'ENVIRONMENTAL_CHAMPION',
          name: 'Environmental Champion',
          description: 'Awarded for recycling 100kg of materials',
          imageIpfsCid: 'QmEnvironmentalChampionExample',
          attributes: {
            rarity: 'rare',
            category: 'achievement',
            tier: 3,
            requirement: '100kg_total',
          },
          supplyCap: 1000,
          createdBy: adminUser.id,
        },
      }),
    ]);

    logger.info({ definitions: nftDefinitions.map(d => d.code) }, 'Created NFT definitions');

    // Create admin wallet for NFT ownership
    const adminWallet = await prisma.wallet.upsert({
      where: {
        address_network: {
          address: '0x1234567890123456789012345678901234567890',
          network: 'polygon-amoy',
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        address: '0x1234567890123456789012345678901234567890',
        network: 'polygon-amoy',
        isPrimary: true,
      },
    });

    logger.info('Created admin wallet');

    // Create some NFT mints for the Recycler Badge
    const nftMints = await Promise.all([
      prisma.nftMint.upsert({
        where: {
          contract_network_tokenId: {
            contract: '0x1234567890123456789012345678901234567890',
            network: 'polygon-amoy',
            tokenId: 1,
          },
        },
        update: {},
        create: {
          nftDefCode: 'RECYCLER_BADGE',
          tokenId: 1,
          contract: '0x1234567890123456789012345678901234567890',
          network: 'polygon-amoy',
          ownerWalletId: adminWallet.id, // Admin wallet owns the mints initially
          status: 'MINTED',
        },
      }),
      prisma.nftMint.upsert({
        where: {
          contract_network_tokenId: {
            contract: '0x1234567890123456789012345678901234567890',
            network: 'polygon-amoy',
            tokenId: 2,
          },
        },
        update: {},
        create: {
          nftDefCode: 'RECYCLER_BADGE',
          tokenId: 2,
          contract: '0x1234567890123456789012345678901234567890',
          network: 'polygon-amoy',
          ownerWalletId: adminWallet.id,
          status: 'MINTED',
        },
      }),
      prisma.nftMint.upsert({
        where: {
          contract_network_tokenId: {
            contract: '0x1234567890123456789012345678901234567890',
            network: 'polygon-amoy',
            tokenId: 3,
          },
        },
        update: {},
        create: {
          nftDefCode: 'PLASTIC_HERO',
          tokenId: 3,
          contract: '0x1234567890123456789012345678901234567890',
          network: 'polygon-amoy',
          ownerWalletId: adminWallet.id,
          status: 'MINTED',
        },
      }),
    ]);

    logger.info({ mints: nftMints.map(m => `${m.nftDefCode}#${m.tokenId}`) }, 'Created NFT mints');

    // Create some sample waste events for demo user
    const wasteEvents = await Promise.all([
      prisma.wasteEvent.create({
        data: {
          userId: demoUser.id,
          stationCode: 'STATION_001',
          deviceId: devices[0].id,
          occurredAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          materialType: 'plastic',
          weightGrams: 2500, // 2.5kg
          source: 'IOT',
          rawPayload: {
            deviceReading: true,
            temperature: 22.5,
            humidity: 45.2,
          },
        },
      }),
      prisma.wasteEvent.create({
        data: {
          userId: demoUser.id,
          stationCode: 'STATION_001',
          deviceId: devices[1].id,
          occurredAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          materialType: 'paper',
          weightGrams: 1800, // 1.8kg
          source: 'MANUAL',
          rawPayload: {
            manualEntry: true,
            verifiedBy: 'station_operator_001',
          },
        },
      }),
    ]);

    logger.info({ events: wasteEvents.map(e => e.id) }, 'Created sample waste events');

    // Create point ledger entries (these would normally be created by triggers)
    const pointLedger = await Promise.all([
      prisma.pointLedger.create({
        data: {
          userId: demoUser.id,
          refTable: 'waste_events',
          refId: wasteEvents[0].id,
          deltaPoints: 25, // 2.5kg * 10 points/kg
          reasonCode: 'DUMP_WEIGHTED',
          occurredAt: wasteEvents[0].occurredAt,
        },
      }),
      prisma.pointLedger.create({
        data: {
          userId: demoUser.id,
          refTable: 'waste_events',
          refId: wasteEvents[1].id,
          deltaPoints: 18, // 1.8kg * 10 points/kg
          reasonCode: 'DUMP_WEIGHTED',
          occurredAt: wasteEvents[1].occurredAt,
        },
      }),
      prisma.pointLedger.create({
        data: {
          userId: demoUser.id,
          refTable: 'waste_events',
          refId: wasteEvents[0].id,
          deltaPoints: 100, // First dump bonus
          reasonCode: 'FIRST_DUMP_BONUS',
          occurredAt: wasteEvents[0].occurredAt,
        },
      }),
    ]);

    logger.info({ ledgerEntries: pointLedger.map(l => l.id) }, 'Created point ledger entries');

    // Create point balance for demo user
    await prisma.pointBalance.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
        points: 143, // 25 + 18 + 100
      },
    });

    logger.info('Created point balance for demo user');

    // Create sample NFT claim for demo user
    const nftClaim = await prisma.nftClaim.create({
      data: {
        userId: demoUser.id,
        nftMintId: nftMints[0].id,
        claimType: 'ACHIEVEMENT',
        claimedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'COMPLETED',
      },
    });

    logger.info({ claimId: nftClaim.id }, 'Created sample NFT claim');

    // Update NFT mint status
    await prisma.nftMint.update({
      where: { id: nftMints[0].id },
      data: { status: 'TRANSFERRED' },
    });

    logger.info('Updated NFT mint status');

    // Create blockchain transaction record
    await prisma.blockchainTx.create({
      data: {
        relatedTable: 'nft_claims',
        relatedId: nftClaim.id,
        network: 'polygon-amoy',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'CONFIRMED',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        confirmedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000), // 30 seconds later
      },
    });

    logger.info('Created blockchain transaction record');

    // Create demo wallet for demo user
    await prisma.wallet.upsert({
      where: {
        address_network: {
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          network: 'polygon-amoy',
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        address: '0xabcdef1234567890abcdef1234567890abcdef12',
        network: 'polygon-amoy',
        isPrimary: true,
      },
    });

    logger.info('Created demo user wallet');

    logger.info('✅ Database seeding completed successfully!');
    logger.info('📊 Summary:');
    logger.info(`  - ${roles.length} roles created`);
    logger.info(`  - ${[adminUser, demoUser].length} users created`);
    logger.info(`  - ${stations.length} recycling stations created`);
    logger.info(`  - ${devices.length} devices created`);
    logger.info(`  - ${pointRules.length} point rules created`);
    logger.info(`  - ${nftDefinitions.length} NFT definitions created`);
    logger.info(`  - ${nftMints.length} NFT mints created`);
    logger.info(`  - ${wasteEvents.length} sample waste events created`);
    logger.info(`  - ${pointLedger.length} point ledger entries created`);
    logger.info(`  - 1 NFT claim created`);
    logger.info('🔐 Admin credentials:');
    logger.info('  Email: admin@cleannft.com');
    logger.info('  Password: admin123!');
    logger.info('👤 Demo credentials:');
    logger.info('  Email: demo@cleannft.com');
    logger.info('  Password: demo123!');

  } catch (error) {
    logger.error({ error }, 'Database seeding failed');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
