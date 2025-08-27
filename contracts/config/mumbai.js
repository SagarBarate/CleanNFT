// Mumbai Testnet Configuration
// Copy this configuration to your .env file

module.exports = {
  // Network Configuration
  NETWORK: {
    name: 'Mumbai Testnet',
    chainId: 80001,
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    explorer: 'https://mumbai.polygonscan.com',
    currency: 'MATIC',
    faucet: 'https://faucet.polygon.technology/'
  },

  // Deployment Configuration
  DEPLOYMENT: {
    // Your wallet private key (keep this secret!)
    privateKey: process.env.PRIVATE_KEY || 'your_private_key_here',
    
    // Mumbai RPC URL
    rpcUrl: process.env.MUMBAI_RPC || 'https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    
    // Contract address (will be filled after deployment)
    contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
  },

  // Gas Configuration
  GAS: {
    gasLimit: 300000,
    gasPrice: 'auto', // Let Hardhat estimate
    maxFeePerGas: '100000000000', // 100 gwei
    maxPriorityFeePerGas: '2000000000' // 2 gwei
  },

  // Contract Configuration
  CONTRACT: {
    name: 'RecyclingBadge',
    symbol: 'RCB',
    description: 'Recycling Badge NFT Collection'
  },

  // Test Configuration
  TEST: {
    // Test accounts for verification
    testAccounts: [
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
    ],
    
    // Test token URIs
    testTokenURIs: [
      'ipfs://QmTestToken1',
      'ipfs://QmTestToken2',
      'ipfs://QmTestToken3'
    ]
  }
};

// Environment Variables Template
const envTemplate = `
# Copy these to your .env file

# Your wallet private key (keep this secret!)
PRIVATE_KEY=your_private_key_here

# Mumbai RPC URL
MUMBAI_RPC=https://polygon-mumbai.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161

# Contract address (will be filled after deployment)
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Custom RPC endpoints
# MUMBAI_RPC=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
# MUMBAI_RPC=https://rpc-mumbai.maticvigil.com/v1/YOUR_API_KEY
# Alternative working endpoints:
# MUMBAI_RPC=https://rpc.ankr.com/polygon_mumbai
# MUMBAI_RPC=https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
`;

console.log('📝 Environment Variables Template:');
console.log(envTemplate);
