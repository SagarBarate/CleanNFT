const { ethers } = require('ethers');
const PinataService = require('../services/pinataService');

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

class NFTController {
  constructor() {
    this.provider = null;
    this.adminWallet = null;
    this.contract = null;
    this.pinataService = new PinataService();
    // Don't initialize blockchain immediately - wait for first use
  }

  /**
   * Check and initialize blockchain connection if needed
   */
  async ensureBlockchainInitialized() {
    if (this.contract && this.adminWallet) {
      return true; // Already initialized
    }
    
    try {
      await this.initializeBlockchain();
      return this.contract && this.adminWallet;
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      return false;
    }
  }

  /**
   * Initialize blockchain connection
   */
  async initializeBlockchain() {
    try {
      // Check if required environment variables are set
      const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;
      const contractAddress = process.env.CONTRACT_ADDRESS;
      
      if (!adminPrivateKey || !contractAddress) {
        console.log('Blockchain initialization skipped - missing environment variables');
        console.log('ADMIN_PRIVATE_KEY:', adminPrivateKey ? 'Set' : 'Missing');
        console.log('CONTRACT_ADDRESS:', contractAddress ? 'Set' : 'Missing');
        return;
      }
      
      // Initialize provider for Mumbai testnet
      this.provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com');
      
      this.adminWallet = new ethers.Wallet(adminPrivateKey, this.provider);
      
      this.contract = new ethers.Contract(contractAddress, RECYCLING_NFT_ABI, this.adminWallet);
      
      console.log('Blockchain initialized successfully');
      console.log('Admin wallet address:', this.adminWallet.address);
      console.log('Contract address:', contractAddress);
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      console.log('Blockchain features will be disabled');
    }
  }

  /**
   * Mint a single NFT to admin wallet
   */
  async mintNFT(req, res) {
    try {
      // Check and initialize blockchain if needed
      const blockchainReady = await this.ensureBlockchainInitialized();
      if (!blockchainReady) {
        return res.status(503).json({
          success: false,
          error: 'Blockchain service not available. Please check configuration.'
        });
      }
      
      const { name, description, imageFile, attributes } = req.body;
      
      if (!name || !description || !imageFile) {
        return res.status(400).json({
          success: false,
          error: 'Name, description, and image are required'
        });
      }

      // Upload image and metadata to Pinata
      const metadataResult = await this.pinataService.createNFTMetadata(
        name,
        description,
        imageFile,
        attributes
      );

      // Mint NFT to admin wallet
      const tx = await this.contract.mintNFT(
        this.adminWallet.address,
        metadataResult.ipfsUrl
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const event = receipt.logs.find(log => {
        try {
          return this.contract.interface.parseLog(log);
        } catch {
          return false;
        }
      });

      let tokenId;
      if (event) {
        const parsedLog = this.contract.interface.parseLog(event);
        tokenId = parsedLog.args.tokenId.toString();
      }

      res.json({
        success: true,
        tokenId,
        transactionHash: tx.hash,
        ipfsUrl: metadataResult.ipfsUrl,
        metadata: metadataResult.metadata
      });

    } catch (error) {
      console.error('Error minting NFT:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Batch mint multiple NFTs to admin wallet
   */
  async batchMintNFTs(req, res) {
    try {
      const { nfts } = req.body; // Array of { name, description, imageFile, attributes }
      
      if (!Array.isArray(nfts) || nfts.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'NFTs array is required and must not be empty'
        });
      }

      const results = [];
      const tokenURIs = [];

      // Process each NFT
      for (const nft of nfts) {
        try {
          const metadataResult = await this.pinataService.createNFTMetadata(
            nft.name,
            nft.description,
            nft.imageFile,
            nft.attributes
          );
          
          tokenURIs.push(metadataResult.ipfsUrl);
          results.push({
            name: nft.name,
            ipfsUrl: metadataResult.ipfsUrl,
            metadata: metadataResult.metadata
          });
        } catch (error) {
          console.error(`Error processing NFT ${nft.name}:`, error);
          results.push({
            name: nft.name,
            error: error.message
          });
        }
      }

      // Batch mint all successful NFTs
      if (tokenURIs.length > 0) {
        const tx = await this.contract.batchMintNFTs(
          this.adminWallet.address,
          tokenURIs
        );

        const receipt = await tx.wait();
        
        res.json({
          success: true,
          transactionHash: tx.hash,
          results,
          totalMinted: tokenURIs.length
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'No NFTs were successfully processed'
        });
      }

    } catch (error) {
      console.error('Error batch minting NFTs:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get available NFTs for claiming
   */
  async getAvailableNFTs(req, res) {
    try {
      const totalMinted = await this.contract.getTotalMintedNFTs();
      const availableNFTs = [];

      // Check each token to see if it's owned by admin (available for claiming)
      for (let i = 1; i <= totalMinted; i++) {
        try {
          const owner = await this.contract.ownerOf(i);
          const contractOwner = await this.contract.owner();
          
          if (owner.toLowerCase() === contractOwner.toLowerCase()) {
            const tokenURI = await this.contract.tokenURI(i);
            availableNFTs.push({
              tokenId: i.toString(),
              tokenURI
            });
          }
        } catch (error) {
          // Skip tokens that don't exist or have errors
          continue;
        }
      }

      res.json({
        success: true,
        availableNFTs,
        totalAvailable: availableNFTs.length
      });

    } catch (error) {
      console.error('Error getting available NFTs:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Check if a user has already claimed an NFT
   */
  async checkUserClaimStatus(req, res) {
    try {
      const { userAddress } = req.params;
      
      if (!userAddress) {
        return res.status(400).json({
          success: false,
          error: 'User address is required'
        });
      }

      const hasClaimed = await this.contract.hasUserClaimed(userAddress);
      
      res.json({
        success: true,
        userAddress,
        hasClaimed
      });

    } catch (error) {
      console.error('Error checking user claim status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get contract statistics
   */
  async getContractStats(req, res) {
    try {
      const [totalMinted, maxClaimable, claimed, remaining] = await Promise.all([
        this.contract.getTotalMintedNFTs(),
        this.contract.maxClaimableNFTs(),
        this.contract.claimedNFTs(),
        this.contract.getRemainingClaimableNFTs()
      ]);

      res.json({
        success: true,
        stats: {
          totalMinted: totalMinted.toString(),
          maxClaimable: maxClaimable.toString(),
          claimed: claimed.toString(),
          remaining: remaining.toString()
        }
      });

    } catch (error) {
      console.error('Error getting contract stats:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get NFT metadata by token ID
   */
  async getNFTMetadata(req, res) {
    try {
      const { tokenId } = req.params;
      
      if (!tokenId) {
        return res.status(400).json({
          success: false,
          error: 'Token ID is required'
        });
      }

      const tokenURI = await this.contract.tokenURI(tokenId);
      
      // Fetch metadata from IPFS
      const response = await fetch(tokenURI);
      if (!response.ok) {
        throw new Error('Failed to fetch metadata from IPFS');
      }
      
      const metadata = await response.json();

      res.json({
        success: true,
        tokenId,
        tokenURI,
        metadata
      });

    } catch (error) {
      console.error('Error getting NFT metadata:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Emergency function to update token URI (admin only)
   */
  async updateTokenURI(req, res) {
    try {
      const { tokenId, newTokenURI } = req.body;
      
      if (!tokenId || !newTokenURI) {
        return res.status(400).json({
          success: false,
          error: 'Token ID and new token URI are required'
        });
      }

      const tx = await this.contract.updateTokenURI(tokenId, newTokenURI);
      const receipt = await tx.wait();

      res.json({
        success: true,
        tokenId,
        newTokenURI,
        transactionHash: tx.hash
      });

    } catch (error) {
      console.error('Error updating token URI:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new NFTController();



