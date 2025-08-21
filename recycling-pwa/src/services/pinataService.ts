import { BLOCKCHAIN_CONFIG } from '../config/blockchain';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
}

export interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

export class PinataService {
  private apiKey: string;
  private secretKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = BLOCKCHAIN_CONFIG.IPFS.PINATA_API_KEY;
    this.secretKey = BLOCKCHAIN_CONFIG.IPFS.PINATA_SECRET_KEY;
    this.apiUrl = BLOCKCHAIN_CONFIG.IPFS.PINATA_API_URL;
  }

  /**
   * Upload NFT metadata to Pinata IPFS
   * @param metadata NFT metadata object
   * @returns IPFS hash and gateway URL
   */
  async uploadMetadata(metadata: NFTMetadata): Promise<{ hash: string; url: string }> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata API keys not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
        body: JSON.stringify({
          pinataMetadata: {
            name: metadata.name,
            keyvalues: {
              type: 'nft-metadata',
              timestamp: new Date().toISOString(),
            },
          },
          pinataContent: metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata upload failed: ${errorData.error || response.statusText}`);
      }

      const data: PinataResponse = await response.json();
      const ipfsUrl = `${BLOCKCHAIN_CONFIG.IPFS.GATEWAY}${data.IpfsHash}`;

      return {
        hash: data.IpfsHash,
        url: ipfsUrl,
      };
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error(`Failed to upload metadata to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload image file to Pinata IPFS
   * @param file Image file (File or Blob)
   * @param fileName Name for the file
   * @returns IPFS hash and gateway URL
   */
  async uploadImage(file: File | Blob, fileName: string): Promise<{ hash: string; url: string }> {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata API keys not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const metadata = {
        name: fileName,
        keyvalues: {
          type: 'nft-image',
          timestamp: new Date().toISOString(),
        },
      };

      formData.append('pinataMetadata', JSON.stringify(metadata));

      const response = await fetch(`${this.apiUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata image upload failed: ${errorData.error || response.statusText}`);
      }

      const data: PinataResponse = await response.json();
      const ipfsUrl = `${BLOCKCHAIN_CONFIG.IPFS.GATEWAY}${data.IpfsHash}`;

      return {
        hash: data.IpfsHash,
        url: ipfsUrl,
      };
    } catch (error) {
      console.error('Error uploading image to Pinata:', error);
      throw new Error(`Failed to upload image to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create NFT metadata with image
   * @param name NFT name
   * @param description NFT description
   * @param imageFile Image file
   * @param attributes Optional attributes
   * @returns Complete metadata object with IPFS URLs
   */
  async createNFTMetadata(
    name: string,
    description: string,
    imageFile: File | Blob,
    attributes?: Array<{ trait_type: string; value: string | number }>
  ): Promise<{ metadata: NFTMetadata; ipfsHash: string; ipfsUrl: string }> {
    try {
      // First upload the image
      const imageResult = await this.uploadImage(imageFile, `${name}-image`);

      // Create metadata object
      const metadata: NFTMetadata = {
        name,
        description,
        image: imageResult.url,
        attributes: attributes || [],
        external_url: BLOCKCHAIN_CONFIG.APP.WEBSITE,
      };

      // Upload metadata to IPFS
      const metadataResult = await this.uploadMetadata(metadata);

      return {
        metadata,
        ipfsHash: metadataResult.hash,
        ipfsUrl: metadataResult.url,
      };
    } catch (error) {
      console.error('Error creating NFT metadata:', error);
      throw new Error(`Failed to create NFT metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get IPFS gateway URL from hash
   * @param hash IPFS hash
   * @returns Gateway URL
   */
  getGatewayUrl(hash: string): string {
    return `${BLOCKCHAIN_CONFIG.IPFS.GATEWAY}${hash}`;
  }

  /**
   * Check if Pinata is configured
   * @returns True if API keys are set
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.secretKey);
  }

  /**
   * Validate IPFS hash format
   * @param hash IPFS hash to validate
   * @returns True if valid
   */
  isValidIPFSHash(hash: string): boolean {
    // Basic IPFS hash validation (Qm... for CIDv0, bafy... for CIDv1)
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || /^bafy[a-z2-7]{55}$/.test(hash);
  }
}

export default PinataService;
