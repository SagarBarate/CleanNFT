import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { cleannftApi, ContractState } from '../api';
import { isContractPaused, isApprovedForAll } from '../chain';

interface AuthorityPanelProps {
  onStateChange?: () => void;
}

const AuthorityPanel: React.FC<AuthorityPanelProps> = ({ onStateChange }) => {
  const [_contractState, setContractState] = useState<ContractState>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [operatorAddress, setOperatorAddress] = useState('');
  const [paused, setPaused] = useState(false);
  const [operatorApproved, setOperatorApproved] = useState(false);
  
  // Action states
  const [pauseLoading, setPauseLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);

  // Load contract state
  const loadContractState = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get state from API first
      const apiState = await cleannftApi.getContractState();
      
      // Fallback to blockchain reads
      const blockchainPaused = await isContractPaused();
      const blockchainApproved = operatorAddress ? 
        await isApprovedForAll(process.env.REACT_APP_ADMIN_PUBLIC_ADDRESS || '', operatorAddress) : 
        false;
      
      const state: ContractState = {
        paused: apiState.paused ?? blockchainPaused,
        operatorApproved: apiState.operatorApproved ?? blockchainApproved,
      };
      
      setContractState(state);
      setPaused(state.paused ?? false);
      setOperatorApproved(state.operatorApproved ?? false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load contract state');
    } finally {
      setLoading(false);
    }
  };

  // Refresh state
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadContractState();
      onStateChange?.();
    } finally {
      setRefreshing(false);
    }
  };

  // Load state on mount
  useEffect(() => {
    loadContractState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update operator address from env
  useEffect(() => {
    const envOperator = process.env.REACT_APP_OPERATOR_ADDRESS;
    if (envOperator) {
      setOperatorAddress(envOperator);
    }
  }, []);

  // Handle pause/unpause
  const handlePauseToggle = async () => {
    try {
      setPauseLoading(true);
      
      const success = await cleannftApi.setPaused(!paused);
      if (success) {
        setPaused(!paused);
        setContractState(prev => ({ ...prev, paused: !paused }));
        onStateChange?.();
      }
    } catch (error) {
      console.error('Failed to toggle pause state:', error);
    } finally {
      setPauseLoading(false);
    }
  };

  // Handle approval toggle
  const handleApprovalToggle = async () => {
    if (!operatorAddress.trim()) {
      setError('Please enter an operator address');
      return;
    }

    try {
      setApprovalLoading(true);
      
      const success = await cleannftApi.setApprovalForAll(operatorAddress, !operatorApproved);
      if (success) {
        setOperatorApproved(!operatorApproved);
        setContractState(prev => ({ ...prev, operatorApproved: !operatorApproved }));
        onStateChange?.();
      }
    } catch (error) {
      console.error('Failed to toggle approval:', error);
    } finally {
      setApprovalLoading(false);
    }
  };

  // Validate Ethereum address
  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Contract Authority Controls
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Pause Control */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                {paused ? <PauseIcon color="warning" /> : <PlayIcon color="success" />}
                <Typography variant="h6">
                  Contract Pause Control
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Pause or unpause the contract to control NFT operations
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={paused}
                      onChange={handlePauseToggle}
                      disabled={pauseLoading}
                    />
                  }
                  label={paused ? 'Paused' : 'Active'}
                />
                
                <Chip
                  label={paused ? 'PAUSED' : 'ACTIVE'}
                  color={paused ? 'warning' : 'success'}
                  variant="outlined"
                />
              </Box>
            </CardContent>
            
            <CardActions>
              <Button
                variant={paused ? 'outlined' : 'contained'}
                color={paused ? 'warning' : 'success'}
                onClick={handlePauseToggle}
                disabled={pauseLoading}
                startIcon={pauseLoading ? <CircularProgress size={20} /> : undefined}
                fullWidth
              >
                {pauseLoading ? 'Processing...' : (paused ? 'Unpause Contract' : 'Pause Contract')}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Approval Control */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SecurityIcon color="primary" />
                <Typography variant="h6">
                  Operator Approval
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Grant or revoke approval for an operator to manage all admin tokens
              </Typography>
              
              <TextField
                fullWidth
                label="Operator Address"
                value={operatorAddress}
                onChange={(e) => setOperatorAddress(e.target.value)}
                placeholder="0x..."
                margin="dense"
                error={operatorAddress.trim() !== '' && !isValidAddress(operatorAddress)}
                helperText={operatorAddress.trim() !== '' && !isValidAddress(operatorAddress) ? 'Invalid Ethereum address' : ''}
              />
              
              <Box display="flex" alignItems="center" gap={2} mt={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={operatorApproved}
                      onChange={handleApprovalToggle}
                      disabled={approvalLoading || operatorAddress.trim() === '' || !isValidAddress(operatorAddress)}
                    />
                  }
                  label={operatorApproved ? 'Approved' : 'Not Approved'}
                />
                
                <Chip
                  label={operatorApproved ? 'APPROVED' : 'NOT APPROVED'}
                  color={operatorApproved ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
            </CardContent>
            
            <CardActions>
              <Button
                variant={operatorApproved ? 'outlined' : 'contained'}
                color={operatorApproved ? 'warning' : 'success'}
                onClick={handleApprovalToggle}
                disabled={approvalLoading || operatorAddress.trim() === '' || !isValidAddress(operatorAddress)}
                startIcon={approvalLoading ? <CircularProgress size={20} /> : undefined}
                fullWidth
              >
                {approvalLoading ? 'Processing...' : 
                  (operatorApproved ? 'Revoke Approval' : 'Grant Approval')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Current Status Summary */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Contract Status
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Contract State:
              </Typography>
              <Chip
                icon={paused ? <PauseIcon /> : <PlayIcon />}
                label={paused ? 'Paused' : 'Active'}
                color={paused ? 'warning' : 'success'}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" color="text.secondary">
                Operator Approval:
              </Typography>
              <Chip
                icon={operatorApproved ? <CheckIcon /> : <ErrorIcon />}
                label={operatorApproved ? 'Approved' : 'Not Approved'}
                color={operatorApproved ? 'success' : 'default'}
              />
            </Box>
          </Grid>
        </Grid>
        
        {operatorAddress && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Current Operator: <code>{operatorAddress}</code>
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Information */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> These controls require admin privileges. Changes are processed through the backend API 
          and may take a few moments to reflect on the blockchain.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AuthorityPanel;
