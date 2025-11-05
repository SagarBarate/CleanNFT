import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { isMumbaiNetwork, getMumbaiConfig } from '../chain';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: string | null;
  isMumbai: boolean;
}

interface UseWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  ensureMumbai: () => Promise<boolean>;
  switchToMumbai: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    isMumbai: false,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  }, []);

  // Get the provider
  const getProvider = useCallback(() => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }
    return new ethers.BrowserProvider(window.ethereum);
  }, [isMetaMaskInstalled]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

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
      const isMumbai = isMumbaiNetwork(chainId);

                setState({
            address: account as string,
            isConnected: true,
            chainId,
            isMumbai,
          });

      // If not on Mumbai, prompt to switch
      if (!isMumbai) {
        console.warn('Please switch to Polygon Mumbai Testnet to use this app');
      }

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [isMetaMaskInstalled, getProvider]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      chainId: null,
      isMumbai: false,
    });
  }, []);

  // Switch to Mumbai testnet
  const switchToMumbai = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const mumbaiConfig = getMumbaiConfig();
      
      // Try to switch to Mumbai
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: mumbaiConfig.chainId }],
      });
    } catch (switchError: any) {
      // If Mumbai is not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getMumbaiConfig()],
          });
        } catch (addError) {
          console.error('Failed to add Mumbai network:', addError);
          throw new Error('Failed to add Mumbai Testnet to MetaMask');
        }
      } else {
        throw switchError;
      }
    }
  }, [isMetaMaskInstalled]);

  // Ensure wallet is connected to Mumbai
  const ensureMumbai = useCallback(async (): Promise<boolean> => {
    if (!state.isConnected) {
      await connect();
    }
    
    if (!state.isMumbai) {
      await switchToMumbai();
      return false; // Will be updated by the chainChanged event
    }
    
    return true;
  }, [state.isConnected, state.isMumbai, connect, switchToMumbai]);

  // Listen for wallet events
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState(prev => ({
          ...prev,
          address: accounts[0],
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      const isMumbai = isMumbaiNetwork(chainId);
      setState(prev => ({
        ...prev,
        chainId,
        isMumbai,
      }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect, isMetaMaskInstalled]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const provider = getProvider();
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const account = accounts[0];
          const network = await provider.getNetwork();
          const chainId = network.chainId.toString();
          const isMumbai = isMumbaiNetwork(chainId);

          setState({
            address: typeof account === 'string' ? account : String(account),
            isConnected: true,
            chainId,
            isMumbai,
          });
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    };

    checkConnection();
  }, [getProvider, isMetaMaskInstalled]);

  return {
    ...state,
    connect,
    disconnect,
    ensureMumbai,
    switchToMumbai,
  };
}
