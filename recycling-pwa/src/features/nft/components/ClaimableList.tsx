import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  GetApp as ClaimIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';
import { ClaimableNFT, claim } from '../api';
import { useWallet } from '../hooks/useWallet';
import { ipfsToHttp } from '../utils/ipfs';

interface ClaimableListProps {
  onClaimSuccess?: (tokenId: string, transactionHash: string) => void;
}

export const ClaimableList: React.FC<ClaimableListProps> = ({
  onClaimSuccess,
}) => {
  const [claimableNFTs, setClaimableNFTs] = useState<ClaimableNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
    transactionHash?: string;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { address, isConnected, ensureMumbai } = useWallet();

  // Fetch claimable NFTs
  const fetchClaimableNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Import dynamically to avoid circular dependencies
      const { listClaimable } = await import('../api');
      const nfts = await listClaimable();
      setClaimableNFTs(nfts);
    } catch (err) {
      console.error('Failed to fetch claimable NFTs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch claimable NFTs');
    } finally {
      setLoading(false);
    }
  };

  // Handle NFT claim
  const handleClaim = async (tokenId: string) => {
    if (!address) {
      setSnackbar({
        open: true,
        message: 'Please connect your wallet first',
        severity: 'error',
      });
      return;
    }

    try {
      // Ensure wallet is connected to Mumbai
      const isMumbai = await ensureMumbai();
      if (!isMumbai) {
        setSnackbar({
          open: true,
          message: 'Please switch to Mumbai Testnet',
          severity: 'error',
        });
        return;
      }

      setClaiming(prev => new Set(prev).add(tokenId));

      const result = await claim(tokenId, address);
      
      if (result.success && result.transactionHash) {
        setSnackbar({
          open: true,
          message: 'NFT claimed successfully!',
          severity: 'success',
          transactionHash: result.transactionHash,
        });

        // Remove from claimable list
        setClaimableNFTs(prev => prev.filter(nft => nft.tokenId !== tokenId));
        
        // Notify parent component
        onClaimSuccess?.(tokenId, result.transactionHash);
      } else {
        throw new Error(result.error || 'Claim failed');
      }
    } catch (err) {
      console.error('Failed to claim NFT:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to claim NFT',
        severity: 'error',
      });
    } finally {
      setClaiming(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  // Open metadata in new tab
  const handleOpenMetadata = (metadataUri: string) => {
    const httpUrl = ipfsToHttp(metadataUri);
    window.open(httpUrl, '_blank');
  };

  // Open transaction on Polygonscan
  const handleOpenTransaction = (transactionHash: string) => {
    const explorerUrl = `https://mumbai.polygonscan.com/tx/${transactionHash}`;
    window.open(explorerUrl, '_blank');
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch NFTs on mount and when wallet connects
  useEffect(() => {
    if (isConnected) {
      fetchClaimableNFTs();
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <Alert severity="info">
        Please connect your wallet to view claimable NFTs
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button
          size="small"
          onClick={fetchClaimableNFTs}
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (claimableNFTs.length === 0) {
    return (
      <Alert severity="info">
        No NFTs are currently available for claiming
      </Alert>
    );
  }

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Available NFTs ({claimableNFTs.length})
      </Typography>
      
      <Grid container spacing={2}>
        {claimableNFTs.map((nft) => (
          <Grid item xs={12} sm={6} md={4} key={nft.tokenId}>
            <Card className="cleannft-claimable-card">
              <CardMedia
                component="img"
                height="200"
                image={nft.image ? ipfsToHttp(nft.image) : '/placeholder-nft.svg'}
                alt={nft.name || `NFT #${nft.tokenId}`}
                sx={{ objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-nft.svg';
                }}
              />
              
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {nft.name || `NFT #${nft.tokenId}`}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Token ID: {nft.tokenId}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ClaimIcon />}
                    onClick={() => handleClaim(nft.tokenId)}
                    disabled={claiming.has(nft.tokenId)}
                    sx={{ flex: 1 }}
                  >
                    {claiming.has(nft.tokenId) ? (
                      <CircularProgress size={16} />
                    ) : (
                      'Claim'
                    )}
                  </Button>
                  
                  {nft.metadataUri && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenIcon />}
                      onClick={() => handleOpenMetadata(nft.metadataUri!)}
                    >
                      Metadata
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          action={
            snackbar.transactionHash ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => handleOpenTransaction(snackbar.transactionHash!)}
              >
                View TX
              </Button>
            ) : undefined
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
