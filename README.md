# Clean NFT Contract Project

A comprehensive blockchain-based recycling reward system that incentivizes proper waste disposal through NFT badges and rewards.

## 🏗️ Project Architecture

This project consists of multiple interconnected components:

### 📱 Mobile Application
- **Location**: `mobile-app/`
- **Tech Stack**: React Native, Expo
- **Features**: 
  - QR code scanning for bin identification and user login
  - NFT badge claiming
  - User dashboard
  - Real-time recycling tracking

### 🖥️ Admin Portal
- **Location**: `admin-portal/`
- **Tech Stack**: React, TypeScript
- **Features**:
  - User management
  - NFT management
  - Bin management
  - Analytics dashboard

### 🔧 Backend API
- **Location**: `backend-api/`
- **Tech Stack**: Node.js, Express
- **Features**:
  - User authentication
  - NFT metadata management
  - Badge system
  - Bin tracking

### ⛓️ Smart Contracts
- **Location**: `contracts/`
- **Tech Stack**: Solidity, Hardhat
- **Features**:
  - RecyclingBadge NFT contract
  - Reward distribution logic

### 🌐 IoT Simulation
- **Location**: `iot-simulation/`
- **Tech Stack**: Node.js, MQTT
- **Features**:
  - Mock sensor data
  - Edge computing simulation
  - Real-time data publishing

### ☁️ AWS Lambda
- **Location**: `lambda/`
- **Tech Stack**: Node.js, AWS Lambda
- **Features**:
  - NFT metadata generation
  - Serverless processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Hardhat (for smart contracts)
- Expo CLI (for mobile app)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clean-nft-contract
   ```

2. **Install dependencies for all components**
   ```bash
   # Root dependencies
   npm install
   
   # Mobile app
   cd mobile-app && npm install
   
   # Admin portal
   cd ../admin-portal && npm install
   
   # Backend API
   cd ../backend-api && npm install
   
   # IoT simulation
   cd ../iot-simulation && npm install
   
   # Lambda function
   cd ../lambda/metadataLambda && npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend-api/env.example backend-api/.env
   cp mobile-app/env.example mobile-app/.env
   cp iot-simulation/env.example iot-simulation/.env
   ```

4. **Smart Contract Deployment**
   ```bash
   # Install Hardhat dependencies
   npm install
   
   # Compile contracts
   npx hardhat compile
   
   # Deploy to local network
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```

## 🏃‍♂️ Running the Application

### Backend API
```bash
cd backend-api
npm start
```

### Admin Portal
```bash
cd admin-portal
npm start
```

### Mobile App
```bash
cd mobile-app
npx expo start
```

### IoT Simulation
```bash
cd iot-simulation
npm start
```

## 📁 Project Structure

```
clean-nft-contract/
├── mobile-app/          # React Native mobile application
├── admin-portal/        # React admin dashboard
├── backend-api/         # Express.js backend server
├── contracts/           # Solidity smart contracts
├── iot-simulation/      # IoT sensor simulation
├── lambda/              # AWS Lambda functions
├── ignition/            # Hardhat Ignition deployments
└── test/               # Test files
```

## 🔧 Configuration

### Environment Variables

Each component has its own environment configuration:

- **Backend API**: Database connection, JWT secrets, blockchain RPC
- **Mobile App**: API endpoints, blockchain network
- **IoT Simulation**: MQTT broker settings, sensor configurations
- **Lambda**: AWS credentials, blockchain network

### Smart Contract Configuration

The smart contracts are configured for:
- **Network**: Ethereum mainnet/testnet or local development
- **Gas Optimization**: Optimized for cost efficiency
- **Security**: Audited and secure patterns

## 🧪 Testing

```bash
# Smart contract tests
npx hardhat test

# Backend API tests
cd backend-api && npm test

# Mobile app tests
cd mobile-app && npm test
```

## 📊 Features

### For Users
- Scan QR codes on recycling bins
- Earn NFT badges for recycling
- Track recycling history
- View earned rewards

### For Administrators
- Manage user accounts
- Monitor recycling statistics
- Configure bin locations
- Manage NFT badge types

### For IoT Devices
- Real-time sensor data collection
- Automated reward distribution
- Edge computing processing

## 🔐 Security

- JWT-based authentication
- Secure smart contract patterns
- Input validation and sanitization
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in each component's README
- Review the troubleshooting guides

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added IoT simulation and edge computing
- **v1.2.0**: Enhanced admin portal and analytics
- **v1.3.0**: Mobile app improvements and bug fixes
