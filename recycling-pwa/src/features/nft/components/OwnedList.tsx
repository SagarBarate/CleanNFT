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
  Chip,
} from '@mui/material';
import {
  OpenInNew as OpenIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { useWallet } from '../hooks/useWallet';
import { getOwnedTokens, getTokenURI } from '../chain';
import { getNFTMetadata } from '../api';
import { ipfsToHttp } from '../utils/ipfs';
import { NFTMetadata } from '../api';

interface OwnedNFT {
  tokenId: string;
  metadata: NFTMetadata | null;
  tokenURI: string;
}

export const OwnedList: React.FC = () => {
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected, isMumbai } = useWallet();

  // Fetch owned NFTs
  const fetchOwnedNFTs = async () => {
    if (!address || !isMumbai) return;

    try {
      setLoading(true);
      setError(null);

      // Get token IDs owned by the user
      const tokenIds = await getOwnedTokens(address);
      
      // Fetch metadata for each token
      const nftsWithMetadata = await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const tokenURI = await getTokenURI(tokenId);
            const metadata = await getNFTMetadata(tokenId);
            
            return {
              tokenId,
              metadata,
              tokenURI,
            };
          } catch (err) {
            console.warn(`Failed to fetch metadata for token ${tokenId}:`, err);
            return {
              tokenId,
              metadata: null,
              tokenURI: '',
            };
          }
        })
      );

      setOwnedNFTs(nftsWithMetadata);
    } catch (err) {
      console.error('Failed to fetch owned NFTs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch owned NFTs');
    } finally {
      setLoading(false);
    }
  };

  // Open metadata in new tab
  const handleOpenMetadata = (tokenURI: string) => {
    const httpUrl = ipfsToHttp(tokenURI);
    window.open(httpUrl, '_blank');
  };

  // Open image in new tab
  const handleOpenImage = (imageUrl: string) => {
    const httpUrl = ipfsToHttp(imageUrl);
    window.open(httpUrl, '_blank');
  };

  // Refresh owned NFTs
  const handleRefresh = () => {
    fetchOwnedNFTs();
  };

  // Fetch NFTs when wallet connects or changes
  useEffect(() => {
    if (isConnected && isMumbai) {
      fetchOwnedNFTs();
    } else {
      setOwnedNFTs([]);
    }
  }, [isConnected, isMumbai, address]);

  if (!isConnected) {
    return (
      <Alert severity="info" icon={<WalletIcon />}>
        Please connect your wallet to view your owned NFTs
      </Alert>
    );
  }

  if (!isMumbai) {
    return (
      <Alert severity="warning">
        Please switch to Mumbai Testnet to view your owned NFTs
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
          onClick={handleRefresh}
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  if (ownedNFTs.length === 0) {
    return (
      <Alert severity="info">
        You don't own any NFTs yet. Claim one from the available NFTs!
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          My NFTs ({ownedNFTs.length})
        </Typography>
        
        <Button
          size="small"
          onClick={handleRefresh}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {ownedNFTs.map((nft) => (
          <Grid item xs={12} sm={6} md={4} key={nft.tokenId}>
            <Card className="cleannft-owned-card">
              <CardMedia
                component="img"
                height="200"
                image={
                  nft.metadata?.image 
                    ? ipfsToHttp(nft.metadata.image) 
                    : '/placeholder-nft.svg'
                }
                alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                sx={{ objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-nft.svg';
                }}
              />
              
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {nft.metadata?.name || `NFT #${nft.tokenId}`}
                </Typography>
                
                {nft.metadata?.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {nft.metadata.description}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Token ID: {nft.tokenId}
                </Typography>

                {/* Attributes */}
                {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      Attributes:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                        <Chip
                          key={index}
                          label={`${attr.trait_type}: ${attr.value}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {nft.metadata.attributes.length > 3 && (
                        <Chip
                          label={`+${nft.metadata.attributes.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {nft.metadata?.image && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenIcon />}
                      onClick={() => handleOpenImage(nft.metadata!.image)}
                      sx={{ flex: 1 }}
                    >
                      View Image
                    </Button>
                  )}
                  
                  {nft.tokenURI && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenIcon />}
                      onClick={() => handleOpenMetadata(nft.tokenURI)}
                      sx={{ flex: 1 }}
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
    </>
  );
};
