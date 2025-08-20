import React from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as SwitchIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';

const WalletConnect: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    account,
    chainId,
    error,
    connectWallet,
    disconnectWallet,
    switchToMumbai,
    clearError,
  } = useWeb3();

  const isAmoyNetwork = chainId === '80002';
  const isMumbaiNetwork = chainId === '80001';
  const isCorrectNetwork = isConnected && (isAmoyNetwork || isMumbaiNetwork);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  const handleSwitchToMumbai = async () => {
    try {
      await switchToMumbai();
    } catch (err) {
      console.error('Network switch failed:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case '1':
        return 'Ethereum Mainnet';
      case '137':
        return 'Polygon Mainnet';
      case '80001':
        return 'Mumbai Testnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  if (isConnecting) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <Typography variant="body2">Connecting...</Typography>
      </Box>
    );
  }

  if (isConnected) {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        {/* Network Status */}
        <Chip
          icon={isCorrectNetwork ? <ConnectedIcon /> : <ErrorIcon />}
          label={getNetworkName(chainId || '')}
          color={isCorrectNetwork ? 'success' : 'error'}
          variant="outlined"
          size="small"
        />

        {/* Account Info */}
        <Chip
          icon={<WalletIcon />}
          label={formatAddress(account || '')}
          color="primary"
          variant="outlined"
          size="small"
        />

        {/* Switch Network Button */}
        {!isCorrectNetwork && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwitchIcon />}
            onClick={handleSwitchToMumbai}
            color="warning"
          >
            Switch to Amoy
          </Button>
        )}

        {/* Disconnect Button */}
        <Button
          variant="outlined"
          size="small"
          onClick={disconnectWallet}
          color="secondary"
        >
          Disconnect
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<WalletIcon />}
        onClick={handleConnect}
        color="primary"
        size="medium"
      >
        Connect Wallet
      </Button>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 1 }}
          onClose={clearError}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default WalletConnect;
