# 🚀 Complete NFT Project Service Setup Guide

This guide will help you set up and run all services in your comprehensive NFT recycling rewards system.

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Git** for cloning repositories
- **MetaMask** wallet extension
- **MongoDB** (local or cloud instance)
- **Polygon Mumbai/Amoy testnet** MATIC tokens
- **Pinata account** for IPFS storage (optional)

## 🏗️ Project Architecture Overview

```
clean-nft-contract/
├── 🎨 Frontend Services
│   ├── recycling-pwa/          # Main PWA application
│   ├── admin-portal/           # Admin dashboard
│   └── mobile-app/             # React Native mobile app
├── ⚙️ Backend Services
│   ├── backend-api/            # Node.js API server
│   ├── iot-simulation/         # IoT edge computing
│   └── lambda/                 # AWS Lambda functions
├── 🔗 Smart Contracts
│   └── contracts/              # Solidity smart contracts
└── 🧪 Testing & Deployment
    └── scripts/                # Deployment and testing
```

---

## 🎨 Frontend Services Setup

### 1. Recycling PWA (Progressive Web App)

**Location**: `recycling-pwa/`

```bash
cd recycling-pwa

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
VITE_MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com

# IPFS Configuration
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_PINATA_SECRET_KEY=your_pinata_secret_key
```

**Start the service**:
```bash
npm run dev          # Development mode
npm run build        # Production build
npm run preview      # Preview production build
```

**Features**:
- NFT claiming interface
- Wallet connection (MetaMask)
- QR code scanning
- PWA capabilities (offline, installable)

### 2. Admin Portal

**Location**: `admin-portal/`

```bash
cd admin-portal

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
REACT_APP_ADMIN_WALLET_ADDRESS=your_admin_wallet_address
```

**Start the service**:
```bash
npm start           # Development mode
npm run build       # Production build
```

**Features**:
- NFT minting dashboard
- User management
- Analytics and reporting
- Bin management

### 3. Mobile App

**Location**: `mobile-app/`

```bash
cd mobile-app

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
API_BASE_URL=http://localhost:3001
CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
```

**Start the service**:
```bash
npm start           # Start Expo development server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run in web browser
```

**Features**:
- QR code scanning for recycling bins
- Mobile-optimized interface
- Offline capabilities
- Push notifications

---

## ⚙️ Backend Services Setup

### 1. Backend API Server

**Location**: `backend-api/`

```bash
cd backend-api

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/recycling-nft
MONGODB_URI_PROD=your_mongodb_atlas_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Blockchain Configuration
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
ADMIN_PRIVATE_KEY=your_admin_private_key
CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651

# Pinata Configuration (IPFS)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

**Database Setup**:
```bash
# Install MongoDB locally or use MongoDB Atlas
# For local installation:
# 1. Download MongoDB Community Server
# 2. Start MongoDB service
# 3. Create database: recycling-nft

# Or use MongoDB Atlas:
# 1. Create free cluster at mongodb.com
# 2. Get connection string
# 3. Update MONGODB_URI in .env
```

**Start the service**:
```bash
npm run dev         # Development mode with nodemon
npm start           # Production mode
npm test            # Run tests
```

**API Endpoints**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/nfts/available` - List claimable NFTs
- `POST /api/nfts/claim` - Claim NFT
- `GET /api/users/profile` - User profile
- `POST /api/badges/mint` - Mint recycling badge

### 2. IoT Simulation Service

**Location**: `iot-simulation/`

```bash
cd iot-simulation

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
# MQTT Configuration
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_TOPIC=recycling/bins

# AWS Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Simulation Configuration
SIMULATION_INTERVAL=5000
BIN_COUNT=10
```

**Start the service**:
```bash
npm start           # Start IoT simulation
npm run simulate    # Run dropoff simulation
npm test            # Test sensors
```

**Features**:
- Mock sensor data generation
- MQTT message publishing
- Edge computing simulation
- AWS IoT integration

### 3. AWS Lambda Functions

**Location**: `lambda/metadataLambda/`

```bash
cd lambda/metadataLambda

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
AWS_REGION=us-east-1
```

**Deploy to AWS Lambda**:
```bash
# Package the function
zip -r function.zip index.js node_modules package.json

# Upload to AWS Lambda via AWS Console or CLI
aws lambda create-function \
  --function-name recycling-metadata-lambda \
  --runtime nodejs18.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::your-account:role/lambda-execution-role
```

---

## 🔗 Smart Contract Services Setup

### 1. Smart Contract Deployment

**Location**: `contracts/`

```bash
cd contracts

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

**Environment Configuration** (`.env`):
```env
# Network Configuration
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology

# Wallet Configuration
PRIVATE_KEY=your_deployment_wallet_private_key

# Contract Configuration
CONTRACT_NAME=RecyclingNFT
CONTRACT_SYMBOL=RECYCLE
MAX_CLAIMABLE_NFTS=1000
```

**Deploy Contracts**:
```bash
# Deploy to Mumbai testnet
npx hardhat run scripts/deploy-mumbai.js --network mumbai

# Deploy to Amoy testnet
npx hardhat run scripts/deploy-amoy.js --network amoy

# Verify contracts on block explorer
npx hardhat run scripts/verify-mumbai.js --network mumbai
npx hardhat run scripts/verify-amoy.js --network amoy
```

**Contract Functions**:
- `mintNFT()` - Admin NFT minting
- `batchMintNFTs()` - Bulk NFT creation
- `claimNFT()` - User NFT claiming
- `transferNFT()` - Admin NFT transfers
- `pauseContract()` - Emergency pause

### 2. Contract Testing

```bash
# Run tests
npx hardhat test

# Test on specific network
npx hardhat test test/test-mumbai.js --network mumbai
```

---

## 🚀 Complete System Startup

### 1. Start All Services (Development)

**Terminal 1 - Backend API**:
```bash
cd backend-api
npm run dev
# Server running on http://localhost:3001
```

**Terminal 2 - Recycling PWA**:
```bash
cd recycling-pwa
npm run dev
# PWA running on http://localhost:5173
```

**Terminal 3 - Admin Portal**:
```bash
cd admin-portal
npm start
# Admin portal running on http://localhost:3000
```

**Terminal 4 - Mobile App**:
```bash
cd mobile-app
npm start
# Expo server running on http://localhost:19000
```

**Terminal 5 - IoT Simulation**:
```bash
cd iot-simulation
npm start
# IoT simulation running
```

### 2. Production Deployment

**Backend API**:
```bash
cd backend-api
npm run build
# Deploy to your hosting service (Heroku, AWS, etc.)
```

**Frontend Services**:
```bash
# Recycling PWA
cd recycling-pwa
npm run build
# Deploy dist/ folder to Vercel, Netlify, or Firebase

# Admin Portal
cd admin-portal
npm run build
# Deploy build/ folder to your hosting service
```

**Smart Contracts**:
```bash
cd contracts
npx hardhat run scripts/deploy-amoy.js --network amoy
# Deploy to Polygon Amoy testnet or mainnet
```

---

## 🔧 Configuration Checklist

### ✅ Environment Files
- [ ] `recycling-pwa/.env`
- [ ] `admin-portal/.env`
- [ ] `mobile-app/.env`
- [ ] `backend-api/.env`
- [ ] `iot-simulation/.env`
- [ ] `contracts/.env`

### ✅ Database Setup
- [ ] MongoDB instance running
- [ ] Database connection string configured
- [ ] Collections created (users, nfts, badges, bins)

### ✅ Blockchain Setup
- [ ] MetaMask wallet configured
- [ ] Mumbai/Amoy testnet added
- [ ] Test MATIC tokens obtained
- [ ] Smart contracts deployed
- [ ] Contract addresses updated in all services

### ✅ External Services
- [ ] Pinata account created (optional)
- [ ] IPFS gateway configured
- [ ] AWS Lambda deployed (optional)

---

## 🧪 Testing Your Setup

### 1. Test Backend API
```bash
curl http://localhost:3001/api/health
# Should return: {"status": "ok", "message": "Recycling NFT API is running"}
```

### 2. Test Smart Contract
```bash
cd contracts
npx hardhat run scripts/test-rpc.js --network mumbai
```

### 3. Test Frontend Integration
1. Open PWA in browser
2. Connect MetaMask wallet
3. Navigate to NFT claiming
4. Verify contract connection

### 4. Test Complete Flow
1. User scans QR code at recycling bin
2. IoT simulation sends data
3. Backend processes and mints NFT
4. User claims NFT via PWA
5. NFT appears in user's wallet

---

## 🚨 Troubleshooting

### Common Issues

**Contract Connection Failed**:
- Verify contract address in `.env` files
- Ensure wallet is on correct network
- Check RPC URL configuration

**Database Connection Error**:
- Verify MongoDB is running
- Check connection string format
- Ensure network access

**Frontend Build Errors**:
- Clear `node_modules` and reinstall
- Check TypeScript compilation
- Verify environment variables

**MetaMask Connection Issues**:
- Ensure MetaMask is installed
- Add correct network configuration
- Check wallet permissions

---

## 📊 Monitoring & Maintenance

### Health Checks
- Backend API: `http://localhost:3001/api/health`
- PWA: Check browser console for errors
- Smart Contracts: Monitor transaction status

### Logs
- Backend: Check terminal output
- Frontend: Browser developer tools
- Smart Contracts: Block explorer logs

### Performance
- Monitor API response times
- Check blockchain gas fees
- Optimize database queries

---

## 🎯 Next Steps

1. **Customize NFT Metadata**: Update metadata templates
2. **Add More Badges**: Create additional achievement badges
3. **Implement Analytics**: Add user behavior tracking
4. **Scale Infrastructure**: Move to cloud hosting
5. **Add More Networks**: Deploy to additional blockchains

---

## 📚 Additional Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**🎉 Congratulations! Your complete NFT recycling rewards system is now set up and running.**

For support and questions, check the individual service README files or create an issue in the repository.


