import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Types
export interface MintItem {
  tokenUri: string;
  name?: string;
  image?: string;
}

export interface MintResult {
  tokenId: string;
  txHash: string;
  tokenUri: string;
  success: boolean;
  error?: string;
}

export interface AdminInventoryItem {
  tokenId: string;
  tokenUri: string;
  owner: string;
  status: 'minted' | 'claimable' | 'claimed';
  txHash?: string;
  name?: string;
  image?: string;
}

export interface ContractState {
  paused?: boolean;
  operatorApproved?: boolean;
}

// API client
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.error || 'API request failed');
  }
  throw new Error(error.message || 'Network error');
};

// API functions
export const cleannftApi = {
  /**
   * Mint NFTs to admin wallet
   */
  async mint(tokens: MintItem[]): Promise<MintResult[]> {
    try {
      // For now, we'll use the existing batch-mint endpoint
      // We'll need to adapt this based on the actual backend implementation
      const response = await api.post('/nfts/batch-mint', {
        items: tokens.map(token => ({ tokenUri: token.tokenUri }))
      });
      
      return response.data.results || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  },

  /**
   * Get admin inventory
   */
  async listAdminInventory(): Promise<AdminInventoryItem[]> {
    try {
      // This endpoint might not exist yet - we'll need to implement it
      // For now, return empty array
      const response = await api.get('/nfts/admin/inventory');
      return response.data || [];
    } catch (error) {
      // If endpoint doesn't exist, return empty array
      console.warn('Admin inventory endpoint not available:', error);
      return [];
    }
  },

  /**
   * Set token claimable status
   */
  async setClaimable(tokenId: string, claimable: boolean): Promise<boolean> {
    try {
      const response = await api.post('/nfts/claimable', {
        tokenId,
        claimable
      });
      return response.data.success;
    } catch (error) {
      handleError(error);
      return false;
    }
  },

  /**
   * Transfer token to address
   */
  async transfer(tokenId: string, toAddress: string): Promise<boolean> {
    try {
      const response = await api.post('/nfts/transfer', {
        tokenId,
        toAddress
      });
      return response.data.success;
    } catch (error) {
      handleError(error);
      return false;
    }
  },

  /**
   * Burn token
   */
  async burn(tokenId: string): Promise<boolean> {
    try {
      const response = await api.post('/nfts/burn', {
        tokenId
      });
      return response.data.success;
    } catch (error) {
      handleError(error);
      return false;
    }
  },

  /**
   * Set approval for all
   */
  async setApprovalForAll(operator: string, approved: boolean): Promise<boolean> {
    try {
      const response = await api.post('/nfts/approval', {
        operator,
        approved
      });
      return response.data.success;
    } catch (error) {
      handleError(error);
      return false;
    }
  },

  /**
   * Get contract state
   */
  async getContractState(): Promise<ContractState> {
    try {
      const response = await api.get('/nfts/contract/state');
      return response.data || {};
    } catch (error) {
      // If endpoint doesn't exist, return empty object
      console.warn('Contract state endpoint not available:', error);
      return {};
    }
  },

  /**
   * Pause/unpause contract
   */
  async setPaused(paused: boolean): Promise<boolean> {
    try {
      const response = await api.post('/nfts/contract/pause', {
        paused
      });
      return response.data.success;
    } catch (error) {
      handleError(error);
      return false;
    }
  }
};
