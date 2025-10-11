import { ethers } from 'ethers';

// Contract ABI for reading operations only
const CONTRACT_ABI = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function getTotalMintedNFTs() public view returns (uint256)"
];

// Mumbai testnet configuration
const MUMBAI_CONFIG = {
  chainId: '0x13881', // 80001 in hex
  chainName: 'Polygon Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: [import.meta.env.VITE_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
};

let provider: ethers.JsonRpcProvider | null = null;
let contract: ethers.Contract | null = null;

/**
 * Get the Mumbai provider
 */
export function getProvider(): ethers.JsonRpcProvider {
  if (!provider) {
    const rpcUrl = import.meta.env.VITE_MUMBAI_RPC_URL;
    if (!rpcUrl) {
      throw new Error('VITE_MUMBAI_RPC_URL environment variable is required');
    }
    provider = new ethers.JsonRpcProvider(rpcUrl);
  }
  return provider;
}

/**
 * Get the contract instance for reading
 */
export function getContract(): ethers.Contract {
  if (!contract) {
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    if (!contractAddress) {
      throw new Error('VITE_CONTRACT_ADDRESS environment variable is required');
    }
    contract = new ethers.Contract(contractAddress, CONTRACT_ABI, getProvider());
  }
  return contract;
}

/**
 * Get all tokens owned by an address
 */
export async function getOwnedTokens(address: string): Promise<string[]> {
  try {
    const contract = getContract();
    const balance = await contract.balanceOf(address);
    const tokenIds: string[] = [];
    
    // Iterate through all tokens owned by the address
    for (let i = 0; i < balance; i++) {
      try {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        tokenIds.push(tokenId.toString());
      } catch (error) {
        console.warn(`Failed to get token at index ${i}:`, error);
        continue;
      }
    }
    
    return tokenIds;
  } catch (error) {
    console.error('Error getting owned tokens:', error);
    throw new Error('Failed to get owned tokens');
  }
}

/**
 * Get token URI for a specific token ID
 */
export async function getTokenURI(tokenId: string): Promise<string> {
  try {
    const contract = getContract();
    const tokenURI = await contract.tokenURI(tokenId);
    return tokenURI;
  } catch (error) {
    console.error(`Error getting token URI for ${tokenId}:`, error);
    throw new Error(`Failed to get token URI for token ${tokenId}`);
  }
}

/**
 * Get owner of a specific token
 */
export async function getTokenOwner(tokenId: string): Promise<string> {
  try {
    const contract = getContract();
    const owner = await contract.ownerOf(tokenId);
    return owner;
  } catch (error) {
    console.error(`Error getting owner for token ${tokenId}:`, error);
    throw new Error(`Failed to get owner for token ${tokenId}`);
  }
}

/**
 * Get total minted NFTs
 */
export async function getTotalMintedNFTs(): Promise<number> {
  try {
    const contract = getContract();
    const total = await contract.getTotalMintedNFTs();
    return Number(total);
  } catch (error) {
    console.error('Error getting total minted NFTs:', error);
    throw new Error('Failed to get total minted NFTs');
  }
}

/**
 * Check if wallet is connected to Mumbai testnet
 */
export function isMumbaiNetwork(chainId: string): boolean {
  return chainId === '0x13881' || chainId === '80001';
}

/**
 * Get Mumbai network configuration for wallet switching
 */
export function getMumbaiConfig() {
  return MUMBAI_CONFIG;
}





