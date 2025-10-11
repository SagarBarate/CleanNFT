# NFT Minting and Claiming System Setup Guide

This guide will walk you through setting up a complete NFT minting and claiming system for the Polygon Mumbai testnet, including smart contract deployment, backend API, and frontend components.

## 🏗️ System Architecture

The system consists of:
- **Smart Contract**: ERC-721 NFT contract deployed on Polygon Mumbai testnet
- **Backend API**: Express.js server handling NFT minting and metadata management
- **Frontend**: React components for admin minting and user claiming
- **IPFS Storage**: Pinata service for storing NFT metadata and images

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
2. **MetaMask** wallet extension
3. **Polygon Mumbai testnet MATIC** (get from [faucet](https://faucet.polygon.technology/))
4. **Pinata account** for IPFS storage
5. **Git** for cloning the repository

## 🚀 Step 1: Smart Contract Deployment

### 1.1 Install Dependencies

```bash
cd contracts
npm install
```

### 1.2 Configure Hardhat

Update `hardhat.config.js` with your Mumbai testnet configuration:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80001,
    },
  },
};
```

### 1.3 Set Environment Variables

Create `.env` file in the contracts directory:

```bash
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_wallet_private_key_here
```

### 1.4 Deploy Contract

```bash
npx hardhat run scripts/deploy-mumbai.js --network mumbai
```

**Important**: Save the deployed contract address from the output!

## 🔧 Step 2: Backend API Setup

### 2.1 Install Dependencies

```bash
cd backend-api
npm install
npm install ethers@6.0.0 form-data node-fetch
```

### 2.2 Configure Environment

Copy `env.example` to `.env` and update:

```bash
# Blockchain Configuration
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
ADMIN_PRIVATE_KEY=your_admin_wallet_private_key

# Pinata Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# Server Configuration
PORT=3001
JWT_SECRET=your_jwt_secret
```

### 2.3 Start Backend Server

```bash
npm start
```

The API will be available at `http://localhost:3001`

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies

```bash
cd recycling-pwa
npm install
npm install ethers@6.0.0
```

### 3.2 Configure Environment

Copy `env.example` to `.env` and update:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001

# Blockchain Configuration
REACT_APP_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS

# Pinata Configuration
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
```

### 3.3 Start Frontend

```bash
npm start
```

The app will be available at `http://localhost:3000`

## 🔑 Step 4: Pinata IPFS Setup

### 4.1 Create Pinata Account

1. Go to [Pinata.cloud](https://pinata.cloud/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key with permissions for:
   - Pin files to IPFS
   - Pin JSON to IPFS

### 4.2 Get API Credentials

Copy your API Key and Secret Key to your environment files.

## 💰 Step 5: Get Mumbai Testnet MATIC

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Mumbai" testnet
3. Enter your wallet address
4. Request test MATIC (you'll need this for gas fees)

## 🧪 Step 6: Testing the System

### 6.1 Admin NFT Minting

1. Open the admin minting page
2. Connect your MetaMask wallet to Mumbai testnet
3. Fill in NFT details (name, description, image)
4. Click "Mint NFT"
5. Confirm transaction in MetaMask

### 6.2 User NFT Claiming

1. Open the NFT claiming page
2. Connect a different wallet to Mumbai testnet
3. View available NFTs
4. Click "Claim NFT" on any available NFT
5. Confirm transaction in MetaMask

## 📱 Available Components

### Admin Components
- **AdminNFTMinting**: Mint single or batch NFTs
- **NFT Management**: View and manage minted NFTs

### User Components
- **NFTClaiming**: View and claim available NFTs
- **Wallet Connection**: MetaMask integration
- **NFT Gallery**: View owned NFTs

## 🔌 API Endpoints

### NFT Management
- `POST /api/nfts/mint` - Mint single NFT
- `POST /api/nfts/batch-mint` - Mint multiple NFTs
- `GET /api/nfts/available` - Get available NFTs
- `GET /api/nfts/stats` - Get contract statistics
- `GET /api/nfts/metadata/:tokenId` - Get NFT metadata
- `GET /api/nfts/claim-status/:userAddress` - Check user claim status

## 🛠️ Troubleshooting

### Common Issues

1. **"MetaMask not detected"**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network (Mumbai testnet)

2. **"Insufficient funds"**
   - Get MATIC from the Mumbai faucet
   - Ensure you have enough for gas fees

3. **"Contract not found"**
   - Verify the contract address in your environment files
   - Ensure the contract was deployed successfully

4. **"Pinata upload failed"**
   - Check your Pinata API credentials
   - Verify API key permissions

5. **"Transaction failed"**
   - Check gas limits and prices
   - Ensure you're on Mumbai testnet
   - Verify contract ownership

### Debug Steps

1. Check browser console for errors
2. Verify network connection in MetaMask
3. Check backend server logs
4. Verify environment variables
5. Test contract functions on Mumbai Polygonscan

## 🔒 Security Considerations

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Validate all inputs** on both frontend and backend
4. **Implement rate limiting** to prevent abuse
5. **Use HTTPS** in production
6. **Regular security audits** of smart contracts

## 📚 Additional Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Pinata API Documentation](https://docs.pinata.cloud/)
- [Mumbai Testnet Explorer](https://mumbai.polygonscan.com/)

## 🚀 Production Deployment

When deploying to production:

1. **Deploy to Polygon mainnet** instead of Mumbai
2. **Use production Pinata account** with higher limits
3. **Implement proper authentication** and authorization
4. **Add monitoring and logging**
5. **Use production-grade RPC providers**
6. **Implement backup and recovery procedures**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error logs and console output
3. Verify all configuration steps were completed
4. Test with a fresh deployment
5. Check network status and RPC availability

---

**Happy NFT Minting! 🎉**

This system provides a complete foundation for NFT-based rewards and can be extended with additional features like:
- Advanced metadata management
- Batch operations
- Analytics and reporting
- Integration with other blockchain networks
- Mobile app support
