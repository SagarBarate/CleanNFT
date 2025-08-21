// Blockchain Configuration for Polygon Mumbai Testnet

export const BLOCKCHAIN_CONFIG = {
  // Network Configuration
  NETWORKS: {
    AMOY: {
      id: 80002,
      name: 'Polygon Amoy Testnet',
      rpcUrl: 'https://polygon-amoy.g.alchemy.com/v2/BAXA8y1jcCe3ghxQhOyUg',
      explorer: 'https://www.oklink.com/amoy',
      faucet: 'https://faucet.polygon.technology/',
      currency: 'MATIC',
      chainId: '0x13882', // 80002 in hex
    },
    MUMBAI: {
      id: 80001,
      name: 'Mumbai Testnet',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorer: 'https://mumbai.polygonscan.com',
      faucet: 'https://faucet.polygon.technology/',
      currency: 'MATIC',
      chainId: '0x13881', // 80001 in hex
    },
    POLYGON: {
      id: 137,
      name: 'Polygon Mainnet',
      rpcUrl: 'https://polygon-rpc.com',
      explorer: 'https://polygonscan.com',
      currency: 'MATIC',
      chainId: '0x89', // 137 in hex
    },
    ETHEREUM: {
      id: 1,
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/your-project-id',
      explorer: 'https://etherscan.io',
      currency: 'ETH',
      chainId: '0x1',
    }
  },

  // Contract Configuration
  CONTRACTS: {
    RECYCLING_BADGE: {
      name: 'RecyclingBadge',
      symbol: 'RCB',
      description: 'Recycling Badge NFT Collection',
          // Update this with your deployed contract address
    address: import.meta.env.VITE_CONTRACT_ADDRESS || '0x9732e6BB31742f9FA4fd650cE20aD595983B3651',
    }
  },

  // Gas Configuration
  GAS: {
    DEFAULT_GAS_LIMIT: 300000,
    GAS_LIMIT_BUFFER: 1.2, // 20% buffer
    MAX_GAS_PRICE: '100000000000', // 100 gwei
  },

  // IPFS Configuration
  IPFS: {
    GATEWAY: 'https://ipfs.io/ipfs/',
    PINATA_API_URL: 'https://api.pinata.cloud',
    // Add your Pinata API keys here for production
    PINATA_API_KEY: import.meta.env.VITE_PINATA_API_KEY || '',
    PINATA_SECRET_KEY: import.meta.env.VITE_PINATA_SECRET_KEY || '',
  },

  // App Configuration
  APP: {
    NAME: 'Recycling Rewards',
    VERSION: '1.0.0',
    DESCRIPTION: 'Earn NFTs for recycling achievements',
    WEBSITE: 'https://recycling-rewards-app.com',
  }
};

// Helper functions
export const getNetworkConfig = (chainId: number) => {
  return Object.values(BLOCKCHAIN_CONFIG.NETWORKS).find(
    network => network.id === chainId
  );
};

export const isAmoyNetwork = (chainId: string | number) => {
  return chainId === 80002 || chainId === '80002';
};

export const isMumbaiNetwork = (chainId: string | number) => {
  return chainId === 80001 || chainId === '80001';
};

export const isPolygonNetwork = (chainId: string | number) => {
  return chainId === 137 || chainId === '137';
};

export const formatChainId = (chainId: string | number) => {
  if (typeof chainId === 'string' && chainId.startsWith('0x')) {
    return parseInt(chainId, 16).toString();
  }
  return chainId.toString();
};

export default BLOCKCHAIN_CONFIG;
