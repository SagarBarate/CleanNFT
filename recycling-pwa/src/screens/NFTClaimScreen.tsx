import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Container,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Star as StarIcon,
  ArrowBack as BackIcon,
  AutoAwesome as MintIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';
import { NFTMetadata } from '../services/pinataService';

interface NFTToken {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
  isEligible: boolean;
  isClaimed: boolean;
  progress: number;
  tokenId?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  blockchain: string;
  contractAddress?: string;
}

const NFTClaimScreen: React.FC = () => {
  const [nftTokens, setNftTokens] = useState<NFTToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [mintDialog, setMintDialog] = useState<{
    open: boolean;
    nft: NFTToken | null;
  }>({
    open: false,
    nft: null,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const navigate = useNavigate();
  
  // Web3 context
  const { isConnected, chainId, contract: _contract, contractAddress } = useWeb3();

  useEffect(() => {
    loadNFTTokens();
  }, []);

  const loadNFTTokens = async () => {
    try {
      // Mock NFT data - in a real app, this would come from your backend
      const mockNFTs: NFTToken[] = [
        {
          id: '1',
          name: 'Recycling Pioneer',
          description: 'First NFT for recycling 100 bottles and earning 2000 points',
          image: '🌱',
          pointsRequired: 2000,
          isEligible: true,
          isClaimed: true,
          progress: 1.0,
          tokenId: 1,
          rarity: 'common',
          category: 'Achievement',
          blockchain: 'Ethereum',
          contractAddress: '0x1234567890123456789012345678901234567890',
        },
        {
          id: '2',
          name: 'Green Innovator',
          description: 'NFT for recycling 500 bottles and earning 5000 points',
          image: '🌿',
          pointsRequired: 5000,
          isEligible: false,
          isClaimed: false,
          progress: 0.6,
          rarity: 'rare',
          category: 'Achievement',
          blockchain: 'Ethereum',
        },
        {
          id: '3',
          name: 'Sustainability Leader',
          description: 'NFT for recycling 1000 bottles and earning 10000 points',
          image: '🌳',
          pointsRequired: 10000,
          isEligible: false,
          isClaimed: false,
          progress: 0.3,
          rarity: 'epic',
          category: 'Achievement',
          blockchain: 'Ethereum',
        },
        {
          id: '4',
          name: 'Planet Guardian',
          description: 'NFT for recycling 2000 bottles and earning 20000 points',
          image: '🌍',
          pointsRequired: 20000,
          isEligible: false,
          isClaimed: false,
          progress: 0.15,
          rarity: 'legendary',
          category: 'Achievement',
          blockchain: 'Ethereum',
        },
        {
          id: '5',
          name: 'Weekly Champion',
          description: 'NFT for maintaining a 7-day recycling streak',
          image: '📅',
          pointsRequired: 3000,
          isEligible: false,
          isClaimed: false,
          progress: 0.8,
          rarity: 'rare',
          category: 'Streak',
          blockchain: 'Polygon',
        },
        {
          id: '6',
          name: 'Community Hero',
          description: 'NFT for helping 20 users start recycling',
          image: '👥',
          pointsRequired: 8000,
          isEligible: false,
          isClaimed: false,
          progress: 0.2,
          rarity: 'epic',
          category: 'Social',
          blockchain: 'Ethereum',
        },
        {
          id: '7',
          name: 'Innovation Master',
          description: 'NFT for contributing to app development',
          image: '💡',
          pointsRequired: 15000,
          isEligible: false,
          isClaimed: false,
          progress: 0.0,
          rarity: 'legendary',
          category: 'Innovation',
          blockchain: 'Ethereum',
        },
        {
          id: '8',
          name: 'Carbon Neutral',
          description: 'NFT for offsetting 1 ton of CO2 through recycling',
          image: '🌱',
          pointsRequired: 25000,
          isEligible: false,
          isClaimed: false,
          progress: 0.05,
          rarity: 'legendary',
          category: 'Environmental',
          blockchain: 'Polygon',
        },
      ];

      setNftTokens(mockNFTs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading NFT tokens:', error);
      setLoading(false);
    }
  };

  const handleClaimNFT = (nft: NFTToken) => {
    setMintDialog({
      open: true,
      nft,
    });
  };

  const handleMintNFT = async () => {
    if (!mintDialog.nft) return;

    const nft = mintDialog.nft;
    setClaiming(nft.id);
    setMintDialog({ open: false, nft: null });

    try {
      // Check if wallet is connected
      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      // Check if we're on Amoy testnet (or Mumbai for compatibility)
      if (chainId !== '80002' && chainId !== '80001') {
        throw new Error('Please switch to Polygon Amoy or Mumbai Testnet');
      }

      // Create NFT metadata
      const metadata: NFTMetadata = {
        name: nft.name,
        description: nft.description,
        image: '',
        attributes: [
          { trait_type: 'Rarity', value: nft.rarity },
          { trait_type: 'Category', value: nft.category || 'recycling' },
          { trait_type: 'Points Required', value: nft.pointsRequired },
          { trait_type: 'Progress', value: Math.round(nft.progress * 100) },
        ],
      };

      // TODO: Upload metadata to IPFS using PinataService
      // const pinataService = new PinataService();
      // const ipfsResult = await pinataService.uploadMetadata(metadata);
      // const tokenURI = `ipfs://${ipfsResult.hash}`;
      const tokenURI = `ipfs://placeholder-${Date.now()}`;
      
      // Log metadata for debugging (will be used when IPFS upload is implemented)
      console.log('NFT Metadata:', metadata);
      console.log('Token URI:', tokenURI);

      // TODO: Mint NFT on blockchain using contract
      // const tx = await contract!.mintNFT(account, tokenURI);
      // const receipt = await tx.wait();
      const result = { tokenId: 0, transactionHash: '0x', success: false };

      // TODO: Implement actual NFT minting
      console.warn('NFT minting not fully implemented yet');
      
      if (result.tokenId) {
        // Update NFT status
        setNftTokens(prev => 
          prev.map(n => 
            n.id === nft.id 
              ? { 
                  ...n, 
                  isClaimed: true, 
                  tokenId: result.tokenId,
                  contractAddress: contractAddress || undefined
                }
              : n
          )
        );
        
        setSnackbar({
          open: true,
          message: `"${nft.name}" NFT minted successfully! Token ID: ${result.tokenId}`,
          severity: 'success',
        });
      } else {
        throw new Error('Minting failed - tokenId is 0');
      }
    } catch (error) {
      console.error('Minting error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to mint NFT. Please try again.',
        severity: 'error',
      });
    } finally {
      setClaiming(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Copied to clipboard!',
      severity: 'info',
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#666';
    }
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  const NFTTokenCard: React.FC<{ nft: NFTToken }> = ({ nft }) => (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              fontSize: '2.5rem',
              bgcolor: nft.isClaimed ? getRarityColor(nft.rarity) : 
                       nft.isEligible ? '#4CAF50' : '#ccc',
              mr: 2,
            }}
          >
            {nft.image}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {nft.name}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={getRarityLabel(nft.rarity)}
                size="small"
                sx={{
                  bgcolor: getRarityColor(nft.rarity),
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
              <Chip
                label={nft.blockchain}
                variant="outlined"
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {nft.description}
        </Typography>

        {nft.tokenId && (
          <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Token ID: {nft.tokenId}
            </Typography>
            {nft.contractAddress && (
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Contract: {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(nft.contractAddress!)}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(nft.progress * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={nft.progress * 100}
            sx={{ height: 6, borderRadius: 3 }}
            color="primary"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {nft.pointsRequired} points required
          </Typography>
          <Chip
            icon={nft.isClaimed ? <CheckIcon /> : nft.isEligible ? <StarIcon /> : <LockIcon />}
            label={nft.isClaimed ? 'Claimed' : nft.isEligible ? 'Eligible' : 'Locked'}
            color={nft.isClaimed ? 'success' : nft.isEligible ? 'warning' : 'default'}
            size="small"
          />
        </Box>

        {!nft.isClaimed && nft.isEligible && (
          <Button
            variant="contained"
            onClick={() => handleClaimNFT(nft)}
            startIcon={claiming === nft.id ? <CircularProgress size={16} /> : <MintIcon />}
            fullWidth
            disabled={claiming === nft.id}
            sx={{ bgcolor: getRarityColor(nft.rarity) }}
          >
            {claiming === nft.id ? 'Minting...' : 'Mint NFT'}
          </Button>
        )}

        {!nft.isEligible && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Keep recycling to unlock this NFT!
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h4" gutterBottom color="primary">
          🎨 NFT Tokens
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Claim unique NFT tokens based on your recycling achievements
        </Typography>
        
        {/* Wallet Connection Status */}
        {!isConnected ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            🔗 Connect your MetaMask wallet to mint NFTs on the Polygon Amoy testnet
          </Alert>
        ) : chainId !== '80002' && chainId !== '80001' ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            ⚠️ Please switch to Polygon Amoy or Mumbai Testnet to mint NFTs
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mt: 2 }}>
            ✅ Connected to Polygon Testnet - Ready to mint NFTs!
          </Alert>
        )}
      </Box>

      {/* NFT Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          NFT Categories
        </Typography>
        <Grid container spacing={2}>
          {['Achievement', 'Streak', 'Social', 'Innovation', 'Environmental'].map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                variant="outlined"
                color="primary"
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* NFTs Grid */}
      <Grid container spacing={3}>
        {nftTokens.map((nft) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={nft.id}>
            <NFTTokenCard nft={nft} />
          </Grid>
        ))}
      </Grid>

      {/* NFT Summary */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            NFT Collection Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {nftTokens.filter(n => n.isEligible).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Eligible to Mint
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {nftTokens.filter(n => n.isClaimed).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  NFTs Claimed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {nftTokens.filter(n => n.isEligible && !n.isClaimed).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready to Mint
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="text.secondary">
                  {nftTokens.filter(n => !n.isEligible).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Still Locked
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mint Dialog */}
      <Dialog
        open={mintDialog.open}
        onClose={() => setMintDialog({ open: false, nft: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Mint NFT: {mintDialog.nft?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to mint the "{mintDialog.nft?.name}" NFT? 
            This will create a new token on the {mintDialog.nft?.blockchain} blockchain.
          </Typography>
          
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Requirements:</strong> {mintDialog.nft?.pointsRequired} points
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Rarity:</strong> {mintDialog.nft?.rarity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Category:</strong> {mintDialog.nft?.category}
            </Typography>
          </Box>

          <Alert severity="info">
            Minting an NFT requires a small gas fee on the blockchain. 
            Make sure you have sufficient funds in your wallet.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMintDialog({ open: false, nft: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleMintNFT}
            variant="contained"
            startIcon={<MintIcon />}
          >
            Mint NFT
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NFTClaimScreen;
