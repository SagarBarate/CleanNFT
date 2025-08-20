import { ethers } from 'ethers';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  external_url?: string;
  animation_url?: string;
}

export interface MintingResult {
  success: boolean;
  tokenId?: number;
  transactionHash?: string;
  tokenURI?: string;
  error?: string;
}

export class NFTService {
  private static instance: NFTService;
  
  private constructor() {}
  
  static getInstance(): NFTService {
    if (!NFTService.instance) {
      NFTService.instance = new NFTService();
    }
    return NFTService.instance;
  }

  /**
   * Create NFT metadata for recycling achievements
   */
  createRecyclingMetadata(
    name: string,
    description: string,
    rarity: 'common' | 'rare' | 'epic' | 'legendary',
    category: string,
    points: number,
    bottlesRecycled: number
  ): NFTMetadata {
    return {
      name,
      description,
      image: this.getDefaultImage(rarity),
      attributes: [
        {
          trait_type: 'Rarity',
          value: rarity.charAt(0).toUpperCase() + rarity.slice(1)
        },
        {
          trait_type: 'Category',
          value: category
        },
        {
          trait_type: 'Points Required',
          value: points.toString()
        },
        {
          trait_type: 'Bottles Recycled',
          value: bottlesRecycled.toString()
        },
        {
          trait_type: 'Minted Date',
          value: new Date().toISOString().split('T')[0]
        }
      ],
      external_url: 'https://recycling-rewards-app.com',
    };
  }

  /**
   * Get default emoji/image based on rarity
   */
  private getDefaultImage(rarity: string): string {
    switch (rarity) {
      case 'common':
        return '🌱';
      case 'rare':
        return '🌿';
      case 'epic':
        return '🌳';
      case 'legendary':
        return '🌍';
      default:
        return '♻️';
    }
  }

  /**
   * Convert metadata to JSON string
   */
  metadataToJSON(metadata: NFTMetadata): string {
    return JSON.stringify(metadata, null, 2);
  }

  /**
   * For now, we'll use a mock IPFS service
   * In production, you'd integrate with Pinata, Infura, or other IPFS services
   */
  async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    // Mock IPFS upload - replace with real IPFS service
    const mockIPFSHash = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`;
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Mock IPFS upload:', {
      metadata,
      ipfsHash: mockIPFSHash
    });
    
    return mockIPFSHash;
  }

  /**
   * Mint NFT using the smart contract
   */
  async mintNFT(
    contract: ethers.Contract,
    signer: ethers.Signer,
    tokenURI: string
  ): Promise<MintingResult> {
    try {
      // Estimate gas
      const gasEstimate = await contract.mintBadge.estimateGas(
        await signer.getAddress(),
        tokenURI
      );

      // Get current gas price
      const gasPrice = await contract.runner?.provider?.getFeeData();
      
      console.log('Gas estimation:', {
        gasLimit: gasEstimate.toString(),
        gasPrice: gasPrice?.gasPrice?.toString()
      });

      // Mint the NFT
      const tx = await contract.mintBadge(
        await signer.getAddress(),
        tokenURI,
        {
          gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer
        }
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const tokenId = await contract.getTotalSupply() - 1;

      return {
        success: true,
        tokenId: tokenId.toNumber(),
        transactionHash: receipt?.hash,
        tokenURI
      };

    } catch (error) {
      console.error('Minting failed:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(
    provider: ethers.Provider,
    txHash: string
  ): Promise<{
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
    blockNumber?: number;
  }> {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return {
          status: 'pending',
          confirmations: 0
        };
      }

      if (receipt.status === 0) {
        return {
          status: 'failed',
          confirmations: receipt.confirmations,
          blockNumber: receipt.blockNumber
        };
      }

      return {
        status: 'confirmed',
        confirmations: receipt.confirmations,
        blockNumber: receipt.blockNumber
      };

    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return {
        status: 'failed',
        confirmations: 0
      };
    }
  }

  /**
   * Format MATIC balance
   */
  formatMATIC(balance: ethers.BigNumberish): string {
    const balanceInEther = ethers.formatEther(balance);
    return parseFloat(balanceInEther).toFixed(4);
  }

  /**
   * Get Mumbai testnet info
   */
  getMumbaiInfo() {
    return {
      name: 'Mumbai Testnet',
      chainId: 80001,
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorer: 'https://mumbai.polygonscan.com',
      faucet: 'https://faucet.polygon.technology/',
      currency: 'MATIC'
    };
  }
}

export default NFTService.getInstance();
