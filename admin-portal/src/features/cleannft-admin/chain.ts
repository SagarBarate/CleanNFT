import { ethers } from 'ethers';

// Mumbai testnet configuration
const MUMBAI_CHAIN_ID = '0x13881'; // 80001 in hex
const MUMBAI_RPC_URL = process.env.REACT_APP_MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com';

// Contract ABI for read-only operations
const NFT_ABI = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function paused() view returns (bool)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)'
];

/**
 * Get Mumbai testnet provider
 */
export const getProvider = (): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider(MUMBAI_RPC_URL);
};

/**
 * Get contract instance for read-only operations
 */
export const getContract = (): ethers.Contract => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Contract address not configured');
  }
  
  const provider = getProvider();
  return new ethers.Contract(contractAddress, NFT_ABI, provider);
};

/**
 * Check if the current network is Mumbai testnet
 */
export const isMumbaiNetwork = async (): Promise<boolean> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      return false;
    }
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === MUMBAI_CHAIN_ID;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

/**
 * Switch to Mumbai testnet
 */
export const switchToMumbai = async (): Promise<boolean> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MUMBAI_CHAIN_ID }],
    });
    
    return true;
  } catch (error: any) {
    // If the network is not added, add it
    if (error.code === 4902) {
      try {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask not installed');
        }
        
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: MUMBAI_CHAIN_ID,
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18,
            },
            rpcUrls: [MUMBAI_RPC_URL],
            blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
          }],
        });
        return true;
      } catch (addError) {
        console.error('Error adding Mumbai network:', addError);
        return false;
      }
    }
    
    console.error('Error switching to Mumbai network:', error);
    return false;
  }
};

/**
 * Get connected wallet address
 */
export const getConnectedAddress = async (): Promise<string | null> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      return null;
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting connected address:', error);
    return null;
  }
};

/**
 * Connect wallet
 */
export const connectWallet = async (): Promise<string | null> => {
  try {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
};

/**
 * Get token owner
 */
export const getTokenOwner = async (tokenId: string): Promise<string | null> => {
  try {
    const contract = getContract();
    const owner = await contract.ownerOf(tokenId);
    return owner;
  } catch (error) {
    console.error('Error getting token owner:', error);
    return null;
  }
};

/**
 * Get token URI
 */
export const getTokenURI = async (tokenId: string): Promise<string | null> => {
  try {
    const contract = getContract();
    const uri = await contract.tokenURI(tokenId);
    return uri;
  } catch (error) {
    console.error('Error getting token URI:', error);
    return null;
  }
};

/**
 * Check if contract is paused
 */
export const isContractPaused = async (): Promise<boolean> => {
  try {
    const contract = getContract();
    const paused = await contract.paused();
    return paused;
  } catch (error) {
    console.error('Error checking if contract is paused:', error);
    return false;
  }
};

/**
 * Check approval for all
 */
export const isApprovedForAll = async (owner: string, operator: string): Promise<boolean> => {
  try {
    const contract = getContract();
    const approved = await contract.isApprovedForAll(owner, operator);
    return approved;
  } catch (error) {
    console.error('Error checking approval for all:', error);
    return false;
  }
};

/**
 * Get admin balance
 */
export const getAdminBalance = async (adminAddress: string): Promise<number> => {
  try {
    const contract = getContract();
    const balance = await contract.balanceOf(adminAddress);
    return Number(balance);
  } catch (error) {
    console.error('Error getting admin balance:', error);
    return 0;
  }
};

/**
 * Get total supply
 */
export const getTotalSupply = async (): Promise<number> => {
  try {
    const contract = getContract();
    const supply = await contract.totalSupply();
    return Number(supply);
  } catch (error) {
    console.error('Error getting total supply:', error);
    return 0;
  }
};
