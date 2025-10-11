const { ethers } = require('ethers');

// Contract ABI for the RecyclingNFT contract
const RECYCLING_NFT_ABI = [
  "function mintNFT(address to, string memory tokenURI) public returns (uint256)",
  "function batchMintNFTs(address to, string[] memory tokenURIs) public returns (uint256[])",
  "function claimNFT(uint256 tokenId) public returns (bool)",
  "function hasUserClaimed(address user) public view returns (bool)",
  "function getRemainingClaimableNFTs() public view returns (uint256)",
  "function getTotalMintedNFTs() public view returns (uint256)",
  "function maxClaimableNFTs() public view returns (uint256)",
  "function claimedNFTs() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function owner() public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string)"
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.adminWallet = null;
    this.contract = null;
  }

  async initializeBlockchain() {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
      const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS, 
        RECYCLING_NFT_ABI, 
        adminWallet
      );
      
      this.provider = provider;
      this.adminWallet = adminWallet;
      this.contract = contract;
      
      console.log('✅ Blockchain service initialized on Mumbai testnet');
      return true;
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error);
      throw error;
    }
  }

  async getContract() {
    if (!this.contract) {
      await this.initializeBlockchain();
    }
    return this.contract;
  }

  async getProvider() {
    if (!this.provider) {
      await this.initializeBlockchain();
    }
    return this.provider;
  }

  async getAdminWallet() {
    if (!this.adminWallet) {
      await this.initializeBlockchain();
    }
    return this.adminWallet;
  }

  // Helper method to check if blockchain is properly initialized
  isInitialized() {
    return !!(this.provider && this.adminWallet && this.contract);
  }

  // Get network information
  async getNetworkInfo() {
    try {
      const provider = await this.getProvider();
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      
      const result = {
        chainId: network.chainId,
        name: network.name,
        blockNumber: blockNumber
      };
      
      return this._serializeBigInt(result);
    } catch (error) {
      console.error('Failed to get network info:', error);
      throw error;
    }
  }

  // Get admin wallet balance
  async getAdminBalance() {
    try {
      const wallet = await this.getAdminWallet();
      const balance = await wallet.provider.getBalance(wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get admin balance:', error);
      throw error;
    }
  }

  // Test contract connection
  async testContractConnection() {
    try {
      const contract = await this.getContract();
      const maxClaimable = await contract.maxClaimableNFTs();
      const totalMinted = await contract.getTotalMintedNFTs();
      
      return {
        success: true,
        maxClaimableNFTs: maxClaimable.toString(),
        totalMintedNFTs: totalMinted.toString(),
        contractAddress: process.env.CONTRACT_ADDRESS
      };
    } catch (error) {
      console.error('Contract connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to convert BigInt values to strings for JSON serialization
  _serializeBigInt(obj) {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (typeof obj === 'bigint') {
      return obj.toString();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this._serializeBigInt(item));
    }
    
    if (typeof obj === 'object') {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this._serializeBigInt(value);
      }
      return result;
    }
    
    return obj;
  }
}

module.exports = BlockchainService;
