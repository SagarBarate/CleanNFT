import React from 'react';
import {
  Button,
  Chip,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as SwitchIcon,
} from '@mui/icons-material';
import { useWallet } from '../hooks/useWallet';

interface WalletConnectButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  showAddress?: boolean;
  showNetworkStatus?: boolean;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  showAddress = true,
  showNetworkStatus = true,
}) => {
  const {
    address,
    isConnected,
    isMumbai,
    chainId,
    connect,
    disconnect,
    switchToMumbai,
  } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      // You could add a toast notification here
    }
  };

  const handleSwitchToMumbai = async () => {
    try {
      await switchToMumbai();
    } catch (error) {
      console.error('Failed to switch to Mumbai:', error);
      // You could add a toast notification here
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button
        variant={variant}
        size={size}
        startIcon={<WalletIcon />}
        onClick={handleConnect}
        sx={{ minWidth: 140 }}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Wallet Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<WalletIcon />}
          onClick={disconnect}
        >
          {showAddress ? formatAddress(address!) : 'Connected'}
        </Button>
        
        {showNetworkStatus && (
          <Chip
            label={isMumbai ? 'Mumbai' : 'Wrong Network'}
            color={isMumbai ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {/* Network Warning */}
      {!isMumbai && showNetworkStatus && (
        <Alert severity="warning" sx={{ py: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption">
              Switch to Mumbai Testnet
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<SwitchIcon />}
              onClick={handleSwitchToMumbai}
              sx={{ minHeight: 24, fontSize: '0.75rem' }}
            >
              Switch
            </Button>
          </Box>
        </Alert>
      )}

      {/* Network Info */}
      {showNetworkStatus && chainId && (
        <Typography variant="caption" color="text.secondary">
          Chain ID: {chainId}
        </Typography>
      )}
    </Box>
  );
};
