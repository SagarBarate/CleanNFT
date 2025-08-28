import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  isMumbaiNetwork,
  switchToMumbai,
  connectWallet,
  getConnectedAddress,
} from '../chain';

// Types
interface AdminState {
  address: string | null;
  isAdmin: boolean;
  ensureMumbai: boolean;
  connected: boolean;
  loading: boolean;
  error: string | null;
}

interface AdminContextType extends AdminState {
  refreshConnection: () => Promise<void>;
  connect: () => Promise<void>;
}

// Context
const AdminContext = createContext<AdminContextType | null>(null);

// Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

// Provider component
export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AdminState>({
    address: null,
    isAdmin: false,
    ensureMumbai: false,
    connected: false,
    loading: true,
    error: null,
  });

  const adminAddress = process.env.REACT_APP_ADMIN_PUBLIC_ADDRESS;

  const checkConnection = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Check if wallet is connected
      const address = await getConnectedAddress();
      if (!address) {
        setState(prev => ({
          ...prev,
          address: null,
          isAdmin: false,
          ensureMumbai: false,
          connected: false,
          loading: false,
        }));
        return;
      }

      // Check if on Mumbai network
      const onMumbai = await isMumbaiNetwork();
      if (!onMumbai) {
        setState(prev => ({
          ...prev,
          address,
          isAdmin: false,
          ensureMumbai: false,
          connected: true,
          loading: false,
          error: 'Please switch to Mumbai testnet',
        }));
        return;
      }

      // Check if address is admin
      const isAdmin = adminAddress && 
        address.toLowerCase() === adminAddress.toLowerCase();

      setState(prev => ({
        ...prev,
        address,
        isAdmin: Boolean(isAdmin),
        ensureMumbai: true,
        connected: true,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  };

  const connect = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Connect wallet
      const address = await connectWallet();
      if (!address) {
        throw new Error('Failed to connect wallet');
      }

      // Check network
      const onMumbai = await isMumbaiNetwork();
      if (!onMumbai) {
        // Try to switch to Mumbai
        const switched = await switchToMumbai();
        if (!switched) {
          throw new Error('Please switch to Mumbai testnet manually');
        }
      }

      // Re-check connection
      await checkConnection();
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
    }
  };

  const refreshConnection = async () => {
    await checkConnection();
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setState(prev => ({
            ...prev,
            address: null,
            isAdmin: false,
            ensureMumbai: false,
            connected: false,
          }));
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Initial connection check
  useEffect(() => {
    checkConnection();
  }, []);

  const contextValue: AdminContextType = {
    ...state,
    refreshConnection,
    connect,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Gate component
export const AdminGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isAdmin, ensureMumbai, connected, loading, error, connect } = useAdmin();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!connected) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <WalletIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Connect Your Wallet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Connect your MetaMask wallet to access CleanNFT Admin features
        </Typography>
        <Button
          variant="contained"
          startIcon={<WalletIcon />}
          onClick={connect}
          size="large"
        >
          Connect Wallet
        </Button>
      </Paper>
    );
  }

  if (!ensureMumbai) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Switch to Mumbai Testnet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please switch your wallet to Mumbai testnet to continue
        </Typography>
        <Button
          variant="contained"
          color="warning"
          onClick={connect}
          size="large"
        >
          Switch Network
        </Button>
      </Paper>
    );
  }

  if (!isAdmin) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Not Authorized
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Connected address: {address}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Only authorized admin addresses can access this section
        </Typography>
        <Chip
          label="Unauthorized"
          color="error"
          variant="outlined"
        />
      </Paper>
    );
  }

  return (
    <Box>
      <Alert severity="success" sx={{ mb: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckIcon />
          <Typography variant="body2">
            Connected as Admin: {address}
          </Typography>
        </Box>
      </Alert>
      {children}
    </Box>
  );
};

export default AdminGate;
