const PinataService = require('../services/pinataService');
const BlockchainService = require('../services/BlockchainService');
const fetch = require('node-fetch');

class NFTController {
  constructor() {
    this.blockchainService = new BlockchainService();
    this.pinataService = new PinataService();
  }

  /**
   * Check and initialize blockchain connection if needed
   */
  async ensureBlockchainInitialized() {
    try {
      return await this.blockchainService.isInitialized() || await this.blockchainService.initializeBlockchain();
    } catch (error) {
      console.error('Failed to initialize blockchain:', error);
      return false;
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
      const contract = await this.blockchainService.getContract();
      const adminWallet = await this.blockchainService.getAdminWallet();
      
      const tx = await contract.mintNFT(
        adminWallet.address,
        metadataResult.ipfsUrl
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return false;
        }
      });

      let tokenId;
      if (event) {
        const parsedLog = contract.interface.parseLog(event);
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
        const contract = await this.blockchainService.getContract();
        const adminWallet = await this.blockchainService.getAdminWallet();
        
        const tx = await contract.batchMintNFTs(
          adminWallet.address,
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
      const contract = await this.blockchainService.getContract();
      const totalMinted = await contract.getTotalMintedNFTs();
      const availableNFTs = [];

      // Check each token to see if it's owned by admin (available for claiming)
      for (let i = 1; i <= totalMinted; i++) {
        try {
          const owner = await contract.ownerOf(i);
          const contractOwner = await contract.owner();
          
          if (owner.toLowerCase() === contractOwner.toLowerCase()) {
            const tokenURI = await contract.tokenURI(i);
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

      const contract = await this.blockchainService.getContract();
      const hasClaimed = await contract.hasUserClaimed(userAddress);
      
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
      const contract = await this.blockchainService.getContract();
      const [totalMinted, maxClaimable, claimed, remaining] = await Promise.all([
        contract.getTotalMintedNFTs(),
        contract.maxClaimableNFTs(),
        contract.claimedNFTs(),
        contract.getRemainingClaimableNFTs()
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
   * Claim an NFT from admin wallet
   */
  async claimNFT(req, res) {
    try {
      const { tokenId, userAddress } = req.body;
      
      if (!tokenId || !userAddress) {
        return res.status(400).json({ 
          success: false, 
          error: 'Token ID and user address are required' 
        });
      }
      
      // Check and initialize blockchain if needed
      const blockchainReady = await this.ensureBlockchainInitialized();
      if (!blockchainReady) {
        return res.status(503).json({
          success: false,
          error: 'Blockchain service not available. Please check configuration.'
        });
      }
      
      // Execute blockchain transaction
      const contract = await this.blockchainService.getContract();
      const tx = await contract.claimNFT(tokenId);
      console.log(`🔄 Claiming NFT ${tokenId} for user ${userAddress}...`);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`✅ NFT ${tokenId} claimed successfully. TX: ${receipt.hash}`);
      
      res.json({ 
        success: true, 
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      });
      
    } catch (error) {
      console.error('❌ NFT claim failed:', error);
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

      const contract = await this.blockchainService.getContract();
      const tokenURI = await contract.tokenURI(tokenId);
      
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
   * Test blockchain service connection
   */
  async testBlockchainService(req, res) {
    try {
      console.log('🧪 Testing Blockchain Service...');
      
      // Test initialization
      const blockchainReady = await this.ensureBlockchainInitialized();
      if (!blockchainReady) {
        return res.status(503).json({
          success: false,
          error: 'Blockchain service failed to initialize'
        });
      }
      
      // Test network info
      const networkInfo = await this.blockchainService.getNetworkInfo();
      
      // Test admin balance
      const adminBalance = await this.blockchainService.getAdminBalance();
      
      // Test contract connection
      const contractTest = await this.blockchainService.testContractConnection();
      
      res.json({
        success: true,
        message: 'Blockchain service test completed',
        blockchainReady,
        networkInfo,
        adminBalance: `${adminBalance} MATIC`,
        contractTest
      });
      
    } catch (error) {
      console.error('❌ Blockchain service test failed:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

      const contract = await this.blockchainService.getContract();
      const tx = await contract.updateTokenURI(tokenId, newTokenURI);
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



