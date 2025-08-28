import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Avatar,
  Link,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Link as LinkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { cleannftApi, AdminInventoryItem } from '../api';
import { ipfsToHttp } from '../utils/ipfs';
import { getTokenOwner, getTokenURI } from '../chain';

interface InventoryTableProps {
  onRefresh?: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ onRefresh }) => {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [transferDialog, setTransferDialog] = useState<{ open: boolean; tokenId: string; toAddress: string }>({
    open: false,
    tokenId: '',
    toAddress: '',
  });
  const [burnDialog, setBurnDialog] = useState<{ open: boolean; tokenId: string }>({
    open: false,
    tokenId: '',
  });
  
  // Action states
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());

  // Load inventory
  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const items = await cleannftApi.listAdminInventory();
      setInventory(items);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  // Refresh inventory
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadInventory();
      onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  // Load inventory on mount
  useEffect(() => {
    loadInventory();
  }, []);

  // Handle claimable toggle
  const handleClaimableToggle = async (tokenId: string, currentStatus: boolean) => {
    try {
      setActionLoading(prev => new Set(prev).add(tokenId));
      
      const success = await cleannftApi.setClaimable(tokenId, !currentStatus);
      if (success) {
        // Update local state
        setInventory(prev => prev.map(item => 
          item.tokenId === tokenId 
            ? { ...item, status: !currentStatus ? 'claimable' : 'minted' }
            : item
        ));
      }
    } catch (error) {
      console.error('Failed to toggle claimable status:', error);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  // Handle transfer
  const handleTransfer = async () => {
    const { tokenId, toAddress } = transferDialog;
    
    try {
      setActionLoading(prev => new Set(prev).add(tokenId));
      
      const success = await cleannftApi.transfer(tokenId, toAddress);
      if (success) {
        // Remove from inventory
        setInventory(prev => prev.filter(item => item.tokenId !== tokenId));
        setTransferDialog({ open: false, tokenId: '', toAddress: '' });
      }
    } catch (error) {
      console.error('Failed to transfer token:', error);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  // Handle burn
  const handleBurn = async () => {
    const { tokenId } = burnDialog;
    
    try {
      setActionLoading(prev => new Set(prev).add(tokenId));
      
      const success = await cleannftApi.burn(tokenId);
      if (success) {
        // Remove from inventory
        setInventory(prev => prev.filter(item => item.tokenId !== tokenId));
        setBurnDialog({ open: false, tokenId: '' });
      }
    } catch (error) {
      console.error('Failed to burn token:', error);
    } finally {
      setActionLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'minted': return 'default';
      case 'claimable': return 'success';
      case 'claimed': return 'info';
      default: return 'default';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'minted': return 'Minted';
      case 'claimable': return 'Claimable';
      case 'claimed': return 'Claimed';
      default: return status;
    }
  };

  // Get Polygonscan URL
  const getPolygonscanUrl = (tokenId: string) => {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    return `https://mumbai.polygonscan.com/token/${contractAddress}?a=${tokenId}`;
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
          Admin NFT Inventory ({inventory.length} tokens)
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

      {inventory.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No NFTs found in admin inventory
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Token ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.tokenId}>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {item.tokenId}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Avatar
                      src={item.image ? ipfsToHttp(item.image) : undefined}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    >
                      {!item.image && 'NFT'}
                    </Avatar>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {item.name || 'Unnamed NFT'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" noWrap>
                      {item.owner}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={getStatusLabel(item.status)}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {/* View Metadata */}
                      <Tooltip title="View Metadata">
                        <IconButton
                          size="small"
                          onClick={() => window.open(ipfsToHttp(item.tokenUri), '_blank')}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {/* View Image */}
                      {item.image && (
                        <Tooltip title="View Image">
                          <IconButton
                            size="small"
                            onClick={() => item.image && window.open(ipfsToHttp(item.image), '_blank')}
                          >
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {/* Polygonscan */}
                      <Tooltip title="View on Polygonscan">
                        <IconButton
                          size="small"
                          onClick={() => window.open(getPolygonscanUrl(item.tokenId), '_blank')}
                        >
                          <OpenIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {/* Toggle Claimable */}
                      <Tooltip title="Toggle Claimable">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={item.status === 'claimable'}
                              onChange={() => handleClaimableToggle(item.tokenId, item.status === 'claimable')}
                              disabled={actionLoading.has(item.tokenId)}
                              size="small"
                            />
                          }
                          label=""
                        />
                      </Tooltip>
                      
                      {/* Transfer */}
                      <Tooltip title="Transfer Token">
                        <IconButton
                          size="small"
                          onClick={() => setTransferDialog({ open: true, tokenId: item.tokenId, toAddress: '' })}
                          disabled={actionLoading.has(item.tokenId)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {/* Burn */}
                      <Tooltip title="Burn Token">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setBurnDialog({ open: true, tokenId: item.tokenId })}
                          disabled={actionLoading.has(item.tokenId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Transfer Dialog */}
      <Dialog open={transferDialog.open} onClose={() => setTransferDialog({ open: false, tokenId: '', toAddress: '' })}>
        <DialogTitle>Transfer Token {transferDialog.tokenId}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="To Address"
            type="text"
            fullWidth
            variant="outlined"
            value={transferDialog.toAddress}
            onChange={(e) => setTransferDialog(prev => ({ ...prev, toAddress: e.target.value }))}
            placeholder="0x..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog({ open: false, tokenId: '', toAddress: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer}
            variant="contained"
            disabled={!transferDialog.toAddress.trim() || actionLoading.has(transferDialog.tokenId)}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Burn Dialog */}
      <Dialog open={burnDialog.open} onClose={() => setBurnDialog({ open: false, tokenId: '' })}>
        <DialogTitle>Burn Token {burnDialog.tokenId}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to burn this token? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBurnDialog({ open: false, tokenId: '' })}>
            Cancel
          </Button>
          <Button 
            onClick={handleBurn}
            variant="contained"
            color="error"
            disabled={actionLoading.has(burnDialog.tokenId)}
          >
            Burn
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryTable;
