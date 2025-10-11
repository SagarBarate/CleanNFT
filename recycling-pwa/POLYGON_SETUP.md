# Polygon Mumbai Testnet Integration Guide

This guide will help you set up and test your recycling NFT application on the Polygon Mumbai testnet.

## 🚀 Quick Start

### 1. Get MATIC Test Tokens

Before you can mint NFTs, you need MATIC tokens on the Mumbai testnet:

1. **Visit the Polygon Faucet**: https://faucet.polygon.technology/
2. **Connect your MetaMask wallet**
3. **Select Mumbai testnet**
4. **Request MATIC tokens** (usually 0.1 MATIC)
5. **Wait for confirmation** (usually takes 1-2 minutes)

Alternative faucets:
- [Alchemy Mumbai Faucet](https://mumbai-faucet.com/)
- [Chainlink Faucet](https://faucets.chain.link/)

### 2. Configure MetaMask for Mumbai Testnet

If Mumbai testnet is not already in your MetaMask:

1. **Open MetaMask**
2. **Click Network dropdown** → "Add Network"
3. **Add these details**:
   - Network Name: `Mumbai Testnet`
   - New RPC URL: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer URL: `https://mumbai.polygonscan.com/`

### 3. Deploy Your Smart Contract

#### Option A: Using Hardhat (Recommended)

1. **Navigate to contracts directory**:
   ```bash
   cd contracts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Hardhat for Mumbai**:
   ```javascript
   // hardhat.config.js
   require("@nomicfoundation/hardhat-toolbox");
   require("dotenv").config();

   module.exports = {
     solidity: "0.8.20",
     networks: {
       mumbai: {
         url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
         accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
         chainId: 80001,
       },
     },
   };
   ```

4. **Create .env file**:
   ```env
   PRIVATE_KEY=your_wallet_private_key_here
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   ```

5. **Deploy contract**:
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

#### Option B: Using Remix IDE

1. **Go to [Remix IDE](https://remix.ethereum.org/)**
2. **Upload your RecyclingBadge.sol contract**
3. **Compile the contract**
4. **Deploy using Injected Provider (MetaMask)**
5. **Make sure MetaMask is connected to Mumbai testnet**

### 4. Update Contract Address

After deploying, update the contract address in your configuration:

1. **Copy the deployed contract address**
2. **Update `src/config/blockchain.ts`**:
   ```typescript
   CONTRACTS: {
     RECYCLING_BADGE: {
       address: 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE',
       // ... other config
     }
   }
   ```

### 5. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Connect MetaMask wallet** using the wallet connect button
3. **Switch to Mumbai testnet** if prompted
4. **Try minting an NFT** from the NFT screen

## 🔧 Configuration Files

### Environment Variables

Create a `.env` file in your project root:

```env
# Contract Address (update after deployment)
REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddress

# Network Configuration
REACT_APP_NETWORK_ID=80001
REACT_APP_RPC_URL=https://rpc-mumbai.maticvigil.com

# IPFS Configuration (for production)
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key
```

### Smart Contract ABI

The contract ABI is automatically generated when you compile your Solidity contract. Make sure your `RecyclingBadge.sol` contract has these functions:

```solidity
function mintBadge(address to, string memory tokenURI) public onlyOwner
function getTotalSupply() public view returns (uint256)
function getNextTokenId() public view returns (uint256)
```

## 🧪 Testing Your Setup

### 1. Verify Network Connection

- Check that MetaMask shows "Mumbai Testnet"
- Verify the chain ID is 80001
- Ensure you have MATIC tokens (balance > 0)

### 2. Test Contract Interaction

1. **Connect wallet** using the wallet connect button
2. **Check network status** - should show "Connected to Mumbai Testnet"
3. **Try minting an NFT** - this will test the full flow

### 3. Monitor Transactions

- Use [Mumbai Polygonscan](https://mumbai.polygonscan.com/) to view transactions
- Check MetaMask for transaction confirmations
- Monitor gas fees (should be very low on Polygon)

## 🚨 Troubleshooting

### Common Issues

1. **"MetaMask is not installed"**
   - Install MetaMask browser extension
   - Refresh the page

2. **"Please switch to Mumbai Testnet"**
   - Add Mumbai network to MetaMask
   - Switch to Mumbai testnet manually

3. **"Insufficient funds"**
   - Get MATIC from the faucet
   - Wait for faucet transaction to confirm

4. **"Contract not found"**
   - Verify contract address is correct
   - Ensure contract is deployed to Mumbai testnet
   - Check if contract has the correct ABI

5. **"Transaction failed"**
   - Check gas limit and gas price
   - Ensure you have enough MATIC for gas fees
   - Verify contract permissions (onlyOwner functions)

### Debug Mode

Enable debug logging in your browser console:

```typescript
// Add this to your Web3Context for debugging
console.log('Web3 State:', {
  isConnected,
  chainId,
  account,
  contract: contract?.address
});
```

## 🔗 Useful Links

- **Polygon Mumbai Faucet**: https://faucet.polygon.technology/
- **Mumbai Polygonscan**: https://mumbai.polygonscan.com/
- **Polygon Documentation**: https://docs.polygon.technology/
- **Hardhat Documentation**: https://hardhat.org/docs
- **MetaMask Documentation**: https://docs.metamask.io/

## 📱 Next Steps

After successful testing on Mumbai testnet:

1. **Deploy to Polygon mainnet** for production
2. **Integrate real IPFS service** (Pinata, Infura)
3. **Add more NFT metadata** and attributes
4. **Implement batch minting** for multiple NFTs
5. **Add NFT marketplace integration**

## 🎯 Success Criteria

Your setup is working correctly when:

✅ MetaMask connects to Mumbai testnet  
✅ Wallet shows MATIC balance  
✅ Contract address is valid  
✅ NFT minting transaction succeeds  
✅ Transaction appears on Mumbai Polygonscan  
✅ NFT metadata is properly stored  

---

**Need help?** Check the console logs and ensure all configuration steps are completed correctly.
