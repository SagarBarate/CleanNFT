import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Contract ABI - this should match your deployed contract
const CONTRACT_ABI = [
  "function mintBadge(address to, string memory tokenURI) public",
  "function getTotalSupply() public view returns (uint256)",
  "function getNextTokenId() public view returns (uint256)",
  "function mintToSelf(string memory tokenURI) public",
  "function owner() public view returns (address)"
];

// Polygon Amoy testnet configuration
const AMOY_CONFIG = {
  chainId: '0x13882', // 80002 in hex
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-amoy.g.alchemy.com/v2/BAXA8y1jcCe3ghxQhOyUg'],
  blockExplorerUrls: ['https://www.oklink.com/amoy'],
};

interface Web3ContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  chainId: string | null;
  
  // Contract state
  contract: ethers.Contract | null;
  contractAddress: string | null;
  
  // Functions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToMumbai: () => Promise<void>;
  mintNFT: (tokenURI: string) => Promise<ethers.ContractTransactionResponse>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
  contractAddress?: string;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ 
  children, 
  contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x9732e6BB31742f9FA4fd650cE20aD595983B3651' 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Get the provider
  const getProvider = () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    return new ethers.BrowserProvider(window.ethereum);
  };

  // Initialize contract
  const initializeContract = async (provider: ethers.BrowserProvider) => {
    if (!contractAddress) {
      throw new Error('Contract address not provided');
    }
    
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
    setContract(contract);
    return contract;
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = getProvider();
      
      // Request accounts
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      
      if (!account) {
        throw new Error('No accounts found');
      }

      // Get network details
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();

      // Ensure account is a valid string
      if (typeof account === 'string' && account.length > 0) {
        setAccount(account);
        setChainId(chainId);
        setIsConnected(true);
      } else {
        throw new Error('Invalid account received from wallet');
      }

      // Initialize contract if we have a valid address
      if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
        try {
          await initializeContract(provider);
        } catch (err) {
          console.warn('Failed to initialize contract:', err);
          // Contract initialization failure shouldn't prevent wallet connection
        }
      }

      // Check if we're on Amoy testnet (or Mumbai for compatibility)
      if (chainId !== '80002' && chainId !== '80001') {
        setError('Please switch to Polygon Amoy or Mumbai Testnet to use this app');
      }

    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setContract(null);
    setError(null);
  };

  // Switch to Amoy testnet
  const switchToAmoy = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [AMOY_CONFIG],
      });
    } catch (err) {
      console.error('Failed to switch to Amoy:', err);
      setError('Failed to switch to Amoy Testnet');
    }
  };

  // Mint NFT
  const mintNFT = async (tokenURI: string): Promise<ethers.ContractTransactionResponse> => {
    if (!contract) {
      throw new Error('Contract not initialized. Please ensure you have a valid contract address.');
    }

    if (!account) {
      throw new Error('Wallet not connected. Please connect your wallet first.');
    }

    try {
      const tx = await contract.mintBadge(account, tokenURI);
      return tx;
    } catch (err) {
      console.error('Failed to mint NFT:', err);
      if (err instanceof Error && err.message.includes('insufficient funds')) {
        throw new Error('Insufficient funds for gas fees. Please ensure you have enough MATIC in your wallet.');
      }
      throw err;
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const newAccount = accounts[0];
        if (typeof newAccount === 'string' && newAccount.length > 0) {
          setAccount(newAccount);
        } else {
          console.warn('Invalid account received in accountsChanged event');
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
      window.location.reload(); // Reload page when chain changes
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const provider = getProvider();
        const accounts: string[] = await provider.listAccounts();
        
        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          const network = await provider.getNetwork();
          const chainId = network.chainId.toString();

          // Ensure account is valid before setting state
          if (typeof account === 'string' && account.length > 0) {
            setAccount(account);
            setChainId(chainId);
            setIsConnected(true);
          }

          if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
            try {
              await initializeContract(provider);
            } catch (err) {
              console.warn('Failed to initialize contract:', err);
              // Don't set error here as it's not critical for basic functionality
            }
          }
        }
      } catch (err) {
        console.error('Failed to check connection:', err);
      }
    };

    checkConnection();
  }, [contractAddress]);

  const value: Web3ContextType = {
    isConnected,
    isConnecting,
    account,
    chainId,
    contract,
    contractAddress,
    connectWallet,
    disconnectWallet,
    switchToMumbai: switchToAmoy, // Alias for compatibility
    mintNFT,
    error,
    clearError,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
