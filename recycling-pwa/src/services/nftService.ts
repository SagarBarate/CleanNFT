import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';
import { NFTMetadata } from './pinataService';

// ABI for the RecyclingNFT contract
const RECYCLING_NFT_ABI = [
  // ERC721 functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  
  // Custom contract functions
  "function mintNFT(address to, string memory tokenURI) public returns (uint256)",
  "function batchMintNFTs(address to, string[] memory tokenURIs) public returns (uint256[])",
  "function claimNFT(uint256 tokenId) public returns (bool)",
  "function hasUserClaimed(address user) public view returns (bool)",
  "function getRemainingClaimableNFTs() public view returns (uint256)",
  "function getTotalMintedNFTs() public view returns (uint256)",
  "function maxClaimableNFTs() public view returns (uint256)",
  "function claimedNFTs() public view returns (uint256)",
  "function updateTokenURI(uint256 tokenId, string memory newTokenURI) public",
  "function setMaxClaimableNFTs(uint256 _maxClaimable) public",
  
  // Events
  "event NFTMinted(uint256 indexed tokenId, address indexed to, string tokenURI)",
  "event NFTClaimed(uint256 indexed tokenId, address indexed from, address indexed to)",
  "event MetadataUpdated(uint256 indexed tokenId, string newTokenURI)",
  
  // Transfer events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];

export interface NFTInfo {
  tokenId: number;
  owner: string;
  tokenURI: string;
  metadata?: NFTMetadata;
}

export interface ContractInfo {
  name: string;
  symbol: string;
  totalMinted: number;
  maxClaimable: number;
  claimed: number;
  remaining: number;
}

export class NFTService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private contractAddress: string;

  constructor() {
    this.contractAddress = BLOCKCHAIN_CONFIG.CONTRACTS.RECYCLING_BADGE.address;
  }

  /**
   * Initialize the service with a provider and signer
   */
  async initialize(): Promise<void> {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create provider and signer
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Create contract instance
        this.contract = new ethers.Contract(
          this.contractAddress,
          RECYCLING_NFT_ABI,
          this.signer
        );

        console.log('NFT Service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize NFT Service:', error);
        throw new Error('Failed to connect to MetaMask');
      }
    } else {
      throw new Error('MetaMask not detected');
    }
  }

  /**
   * Check if the service is initialized
   */
  isInitialized(): boolean {
    return !!(this.provider && this.signer && this.contract);
  }

  /**
   * Get the current signer address
   */
  async getSignerAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('Service not initialized');
    }
    return await this.signer.getAddress();
  }

  /**
   * Get contract information
   */
  async getContractInfo(): Promise<ContractInfo> {
    if (!this.contract) {
      throw new Error('Service not initialized');
    }

    try {
      const [name, symbol, totalMinted, maxClaimable, claimed] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.getTotalMintedNFTs(),
        this.contract.maxClaimableNFTs(),
        this.contract.claimedNFTs()
      ]);

      return {
        name,
        symbol,
        totalMinted: Number(totalMinted),
        maxClaimable: Number(maxClaimable),
        claimed: Number(claimed),
        remaining: Number(maxClaimable) - Number(claimed)
      };
    } catch (error) {
      console.error('Error getting contract info:', error);
      throw new Error('Failed to get contract information');
    }
  }

  /**
   * Check if a user has already claimed an NFT
   */
  async hasUserClaimed(userAddress: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Service not initialized');
    }

    try {
      return await this.contract.hasUserClaimed(userAddress);
    } catch (error) {
      console.error('Error checking if user claimed:', error);
      throw new Error('Failed to check user claim status');
    }
  }

  /**
   * Get NFT information by token ID
   */
  async getNFTInfo(tokenId: number): Promise<NFTInfo> {
    if (!this.contract) {
      throw new Error('Service not initialized');
    }

    try {
      const [owner, tokenURI] = await Promise.all([
        this.contract.ownerOf(tokenId),
        this.contract.tokenURI(tokenId)
      ]);

      return {
        tokenId,
        owner,
        tokenURI
      };
    } catch (error) {
      console.error('Error getting NFT info:', error);
      throw new Error('Failed to get NFT information');
    }
  }

  /**
   * Get all NFTs owned by a specific address
   */
  async getNFTsByOwner(ownerAddress: string): Promise<NFTInfo[]> {
    if (!this.contract) {
      throw new Error('Service not initialized');
    }

    try {
      const totalMinted = await this.contract.getTotalMintedNFTs();
      const nfts: NFTInfo[] = [];

      for (let i = 1; i <= totalMinted; i++) {
        try {
          const owner = await this.contract.ownerOf(i);
          if (owner.toLowerCase() === ownerAddress.toLowerCase()) {
            const tokenURI = await this.contract.tokenURI(i);
            nfts.push({
              tokenId: i,
              owner,
              tokenURI
            });
          }
        } catch (error) {
          // Skip tokens that don't exist or have errors
          continue;
        }
      }

      return nfts;
    } catch (error) {
      console.error('Error getting NFTs by owner:', error);
      throw new Error('Failed to get NFTs by owner');
    }
  }

  /**
   * Claim an NFT (only works if user hasn't claimed before)
   */
  async claimNFT(tokenId: number): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) {
      throw new Error('Service not initialized');
    }

    try {
      // Check if user has already claimed
      const signerAddress = await this.getSignerAddress();
      const hasClaimed = await this.hasUserClaimed(signerAddress);
      
      if (hasClaimed) {
        throw new Error('User has already claimed an NFT');
      }

      // Check if NFT is available for claiming
      const owner = await this.contract.ownerOf(tokenId);
      const contractOwner = await this.contract.owner();
      
      if (owner.toLowerCase() !== contractOwner.toLowerCase()) {
        throw new Error('NFT is not available for claiming');
      }

      // Claim the NFT
      const tx = await this.contract.claimNFT(tokenId);
      return tx;
    } catch (error) {
      console.error('Error claiming NFT:', error);
      throw new Error(`Failed to claim NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Wait for a transaction to be mined
   */
  async waitForTransaction(tx: ethers.ContractTransactionResponse): Promise<ethers.ContractTransactionReceipt | null> {
    if (!this.provider) {
      throw new Error('Service not initialized');
    }

    try {
      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error('Transaction receipt is null');
      }
      return receipt;
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw new Error('Transaction failed or timed out');
    }
  }

  /**
   * Get the current network
   */
  async getNetwork(): Promise<ethers.Network> {
    if (!this.provider) {
      throw new Error('Service not initialized');
    }

    try {
      return await this.provider.getNetwork();
    } catch (error) {
      console.error('Error getting network:', error);
      throw new Error('Failed to get network information');
    }
  }

  /**
   * Check if connected to Mumbai testnet
   */
  async isMumbaiNetwork(): Promise<boolean> {
    try {
      const network = await this.getNetwork();
      return network.chainId === BigInt(80001); // Mumbai testnet
    } catch (error) {
      return false;
    }
  }

  /**
   * Switch to Mumbai testnet
   */
  async switchToMumbai(): Promise<void> {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], // Mumbai testnet in hex
        });
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com'],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
  }

  /**
   * Get gas estimate for claiming an NFT
   */
  async estimateGasForClaim(tokenId: number): Promise<bigint> {
    if (!this.contract) {
      throw new Error('Service not initialized');
    }

    try {
      const signerAddress = await this.getSignerAddress();
      return await this.contract.claimNFT.estimateGas(tokenId, { from: signerAddress });
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas for claim transaction');
    }
  }
}

export default NFTService;
