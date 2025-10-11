# CleanNFT Backend API

A comprehensive backend API for the CleanNFT system that enables waste recycling to NFT rewards. Built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control
- **Waste Event Tracking**: IoT device integration with idempotency protection
- **Points System**: Automated point calculation with database triggers
- **NFT Management**: Definition creation, minting, and claim allocation
- **Blockchain Integration**: Outbox pattern for reliable transaction processing
- **Admin Dashboard**: Comprehensive analytics and system management
- **Rate Limiting**: Protection against abuse and spam
- **Comprehensive Testing**: Unit and integration tests with Vitest

## 🏗️ Architecture

```
backend-api/
├── src/
│   ├── config/          # Environment configuration
│   ├── libs/            # Shared utilities (logger, database)
│   ├── middleware/      # Express middleware (auth, validation, errors)
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic layer
│   ├── validators/      # Zod validation schemas
│   └── utils/           # Helper functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # SQL migrations
│   └── seed.ts          # Database seeding
├── tests/               # Test files
└── docs/               # API documentation
```

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript (ESM)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Argon2 password hashing
- **Validation**: Zod schemas
- **Testing**: Vitest + Supertest
- **Logging**: Pino structured logging
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend-api
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cleannft?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
PORT=4000
NODE_ENV=development
ADMIN_WALLET_ADDRESS="0xYourAdminWalletAddress"
CHAIN_NETWORK="polygon-amoy"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with initial data
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 📚 API Documentation

### Base URL
- Development: `http://localhost:4000`
- Production: `https://api.cleannft.com`

### Authentication
Most endpoints require a JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:4000/api/v1/auth/me
```

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile

#### Waste Events
- `POST /api/v1/waste-events` - Create waste event
- `GET /api/v1/waste-events/my` - Get user's waste events

#### Points
- `GET /api/v1/points/balance` - Get point balance
- `GET /api/v1/points/ledger` - Get point transaction history

#### NFT Claims
- `POST /api/v1/nft/claim` - Claim NFT
- `GET /api/v1/nft/my` - Get user's NFT claims

#### Admin (requires ADMIN role)
- `GET /api/v1/admin/analytics` - System analytics
- `POST /api/v1/nft/definitions` - Create NFT definition
- `POST /api/v1/nft/mint-batch` - Mint NFT batch

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test auth.test.ts
```

### Test Coverage
The test suite covers:
- User registration and authentication
- Waste event creation and idempotency
- Point calculation and balance updates
- NFT claiming with concurrent protection
- Admin functionality and permissions

## 🗄️ Database Schema

### Key Models

#### Users & Authentication
- `User` - User accounts with email/password
- `AuthAccount` - Authentication providers (password, Google, wallet)
- `Session` - Active user sessions
- `LoginEvent` - Audit trail of login attempts

#### Waste & Recycling
- `RecyclingStation` - Physical recycling locations
- `Device` - IoT devices at stations
- `WasteEvent` - Individual recycling events with idempotency

#### Points System
- `PointRule` - Configurable point calculation rules
- `PointLedger` - Append-only transaction log
- `PointBalance` - Current user balances (updated via triggers)

#### NFT System
- `NftDefinition` - NFT types and metadata
- `NftMint` - Individual NFT instances
- `NftClaim` - User claims on NFTs
- `BlockchainTx` - Transaction tracking

#### System
- `OutboxEvent` - Reliable event processing pattern
- `AdminAction` - Audit trail for admin operations

### Database Triggers

1. **Login Tracking**: Updates `users.last_login_at` on successful login
2. **Point Balance**: Automatically updates balances when ledger entries are added

## 🔐 Security Features

- **Password Hashing**: Argon2 with secure parameters
- **JWT Tokens**: Signed tokens with expiration
- **Rate Limiting**: Per-endpoint rate limits
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Request Sanitization**: Removes potentially harmful content

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Set these in your production environment:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
PORT=4000
ADMIN_WALLET_ADDRESS=your-admin-wallet
CHAIN_NETWORK=polygon-mainnet
```

### Database Migration
```bash
npm run prisma:deploy
```

### Start Production Server
```bash
npm start
```

## 📊 Monitoring & Logging

### Structured Logging
All logs use structured JSON format with Pino:

```json
{
  "level": "info",
  "time": "2024-01-01T12:00:00.000Z",
  "msg": "User logged in successfully",
  "userId": "uuid",
  "email": "user@example.com",
  "ip": "192.168.1.1"
}
```

### Health Checks
- `GET /health` - Basic health check
- `GET /api/v1/admin/health` - Detailed system health (admin only)

## 🔧 Development

### Code Structure
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and database operations
- **Validators**: Request validation schemas
- **Middleware**: Cross-cutting concerns (auth, logging, etc.)

### Adding New Features

1. **Create Database Schema**: Add models to `prisma/schema.prisma`
2. **Run Migration**: `npm run prisma:migrate`
3. **Create Service**: Implement business logic in `src/services/`
4. **Create Controller**: Handle requests in `src/controllers/`
5. **Add Routes**: Define endpoints in `src/routes/`
6. **Add Validation**: Create Zod schemas in `src/validators/`
7. **Write Tests**: Add test cases in `tests/`

### Database Seeding

The seed script creates:
- Admin user: `admin@cleannft.com` / `admin123!`
- Demo user: `demo@cleannft.com` / `demo123!`
- Sample recycling stations and devices
- Point rules and NFT definitions
- Sample data for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

#### Migration Issues
```bash
# Reset database (development only)
npm run prisma:reset

# Check migration status
npx prisma migrate status
```

#### JWT Issues
- Ensure JWT_SECRET is at least 32 characters
- Check token expiration in browser dev tools
- Verify Authorization header format: `Bearer <token>`

#### Rate Limiting
- Default limits: 100 requests/15min (general), 5 requests/15min (auth)
- Check response headers for rate limit info
- Use different IP or wait for reset

### Getting Help

- Check the [API Documentation](./docs/openapi.yaml)
- Review the test files for usage examples
- Open an issue on GitHub

## 📈 Performance

### Optimization Features
- Database connection pooling
- Efficient queries with Prisma
- Rate limiting to prevent abuse
- Structured logging for monitoring
- Transaction handling for consistency

### Scaling Considerations
- Use connection pooling for high traffic
- Consider Redis for session storage
- Implement caching for frequently accessed data
- Use database read replicas for analytics queries
