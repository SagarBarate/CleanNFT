// Types for NFT data
export interface ClaimableNFT {
  tokenId: string;
  tokenURI: string;
  name?: string;
  image?: string;
  metadataUri?: string;
}

export interface ClaimResponse {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  error?: string;
}

export interface AvailableNFTsResponse {
  success: boolean;
  availableNFTs: ClaimableNFT[];
  totalAvailable: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Get list of claimable NFTs from backend
 */
export async function listClaimable(): Promise<ClaimableNFT[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/available`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AvailableNFTsResponse = await response.json();
    
          if (!data.success) {
        throw new Error('Failed to fetch claimable NFTs');
      }
    
    // Fetch metadata for each NFT to get name and image
    const nftsWithMetadata = await Promise.all(
      data.availableNFTs.map(async (nft) => {
        try {
          const metadataResponse = await fetch(`${API_BASE_URL}/api/nfts/metadata/${nft.tokenId}`);
          if (metadataResponse.ok) {
            const metadataData = await metadataResponse.json();
            if (metadataData.success) {
              return {
                ...nft,
                name: metadataData.metadata.name,
                image: metadataData.metadata.image,
                metadataUri: nft.tokenURI
              };
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch metadata for token ${nft.tokenId}:`, error);
        }
        
        // Return basic info if metadata fetch fails
        return {
          ...nft,
          name: `NFT #${nft.tokenId}`,
          image: '',
          metadataUri: nft.tokenURI
        };
      })
    );
    
    return nftsWithMetadata;
  } catch (error) {
    console.error('Error fetching claimable NFTs:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch claimable NFTs');
  }
}

/**
 * Claim an NFT by token ID
 */
export async function claim(
  tokenId: string, 
  userAddress: string
): Promise<ClaimResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId,
        userAddress
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data: ClaimResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Claim failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error claiming NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to claim NFT'
    };
  }
}

/**
 * Get NFT metadata by token ID
 */
export async function getNFTMetadata(tokenId: string): Promise<NFTMetadata | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/metadata/${tokenId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch NFT metadata');
    }
    
    return data.metadata;
  } catch (error) {
    console.error(`Error fetching metadata for token ${tokenId}:`, error);
    return null;
  }
}

/**
 * Check if user has already claimed an NFT
 */
export async function checkUserClaimStatus(userAddress: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/nfts/claim-status/${userAddress}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to check claim status');
    }
    
    return data.hasClaimed;
  } catch (error) {
    console.error('Error checking user claim status:', error);
    return false;
  }
}
