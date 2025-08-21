const FormData = require('form-data');
const fetch = require('node-fetch');

class PinataService {
  constructor() {
    this.apiKey = process.env.PINATA_API_KEY;
    this.secretKey = process.env.PINATA_SECRET_KEY;
    this.apiUrl = 'https://api.pinata.cloud';
    this.gateway = 'https://ipfs.io/ipfs/';
  }

  /**
   * Upload NFT metadata to Pinata IPFS
   * @param {Object} metadata NFT metadata object
   * @returns {Promise<{hash: string, url: string}>} IPFS hash and gateway URL
   */
  async uploadMetadata(metadata) {
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

      const data = await response.json();
      const ipfsUrl = `${this.gateway}${data.IpfsHash}`;

      return {
        hash: data.IpfsHash,
        url: ipfsUrl,
      };
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
  }

  /**
   * Upload image file to Pinata IPFS
   * @param {Buffer} imageBuffer Image buffer
   * @param {string} fileName Name for the file
   * @returns {Promise<{hash: string, url: string}>} IPFS hash and gateway URL
   */
  async uploadImage(imageBuffer, fileName) {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata API keys not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: fileName,
        contentType: this.getContentType(fileName),
      });

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

      const data = await response.json();
      const ipfsUrl = `${this.gateway}${data.IpfsHash}`;

      return {
        hash: data.IpfsHash,
        url: ipfsUrl,
      };
    } catch (error) {
      console.error('Error uploading image to Pinata:', error);
      throw new Error(`Failed to upload image to IPFS: ${error.message}`);
    }
  }

  /**
   * Create NFT metadata with image
   * @param {string} name NFT name
   * @param {string} description NFT description
   * @param {Buffer} imageBuffer Image buffer
   * @param {Array} attributes Optional attributes
   * @returns {Promise<{metadata: Object, ipfsHash: string, ipfsUrl: string}>} Complete metadata object with IPFS URLs
   */
  async createNFTMetadata(name, description, imageBuffer, attributes = []) {
    try {
      // First upload the image
      const imageResult = await this.uploadImage(imageBuffer, `${name}-image`);

      // Create metadata object
      const metadata = {
        name,
        description,
        image: imageResult.url,
        attributes: attributes || [],
        external_url: process.env.APP_WEBSITE || 'https://recycling-rewards-app.com',
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
      throw new Error(`Failed to create NFT metadata: ${error.message}`);
    }
  }

  /**
   * Get IPFS gateway URL from hash
   * @param {string} hash IPFS hash
   * @returns {string} Gateway URL
   */
  getGatewayUrl(hash) {
    return `${this.gateway}${hash}`;
  }

  /**
   * Check if Pinata is configured
   * @returns {boolean} True if API keys are set
   */
  isConfigured() {
    return !!(this.apiKey && this.secretKey);
  }

  /**
   * Validate IPFS hash format
   * @param {string} hash IPFS hash to validate
   * @returns {boolean} True if valid
   */
  isValidIPFSHash(hash) {
    // Basic IPFS hash validation (Qm... for CIDv0, bafy... for CIDv1)
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || /^bafy[a-z2-7]{55}$/.test(hash);
  }

  /**
   * Get content type based on file extension
   * @param {string} fileName File name
   * @returns {string} MIME type
   */
  getContentType(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Test Pinata connection
   * @returns {Promise<boolean>} True if connection successful
   */
  async testConnection() {
    if (!this.apiKey || !this.secretKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.apiUrl}/data/testAuthentication`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      return false;
    }
  }

  /**
   * Get Pinata account information
   * @returns {Promise<Object>} Account information
   */
  async getAccountInfo() {
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata API keys not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}/data/userPinnedDataTotal`, {
        method: 'GET',
        headers: {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get account information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting account info:', error);
      throw new Error(`Failed to get account information: ${error.message}`);
    }
  }
}

module.exports = PinataService;
