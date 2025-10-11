import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Token as NFTIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface NFTToken {
  id: string;
  name: string;
  description: string;
  image: string;
  tokenId: number;
  owner: string;
  mintedAt: string;
  pointsRequired: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  status: 'minted' | 'claimed' | 'available';
}

const NFTManagement: React.FC = () => {
  const [nftTokens, setNftTokens] = useState<NFTToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTToken | null>(null);
  const [newNFT, setNewNFT] = useState({
    name: '',
    description: '',
    pointsRequired: 0,
    rarity: 'common' as const,
  });

  useEffect(() => {
    loadNFTTokens();
  }, []);

  const loadNFTTokens = async () => {
    try {
      // Mock data - in a real app, this would come from your backend
      const mockNFTs: NFTToken[] = [
        {
          id: '1',
          name: 'Recycling Pioneer',
          description: 'First NFT for recycling 100 bottles',
          image: '🌱',
          tokenId: 1,
          owner: 'John Doe',
          mintedAt: '2024-01-10 10:30',
          pointsRequired: 2000,
          rarity: 'common',
          status: 'minted',
        },
        {
          id: '2',
          name: 'Green Innovator',
          description: 'NFT for recycling 500 bottles',
          image: '🌿',
          tokenId: 2,
          owner: 'Mike Johnson',
          mintedAt: '2024-01-12 14:20',
          pointsRequired: 5000,
          rarity: 'rare',
          status: 'minted',
        },
        {
          id: '3',
          name: 'Sustainability Leader',
          description: 'NFT for recycling 1000 bottles',
          image: '🌳',
          tokenId: 3,
          owner: 'Tom Brown',
          mintedAt: '2024-01-14 16:45',
          pointsRequired: 10000,
          rarity: 'epic',
          status: 'minted',
        },
        {
          id: '4',
          name: 'Planet Guardian',
          description: 'NFT for recycling 2000 bottles',
          image: '🌍',
          tokenId: 4,
          owner: 'Available',
          mintedAt: 'Not minted',
          pointsRequired: 20000,
          rarity: 'legendary',
          status: 'available',
        },
        {
          id: '5',
          name: 'Eco Warrior',
          description: 'NFT for recycling 3000 bottles',
          image: '🏆',
          tokenId: 5,
          owner: 'Available',
          mintedAt: 'Not minted',
          pointsRequired: 30000,
          rarity: 'legendary',
          status: 'available',
        },
      ];

      setNftTokens(mockNFTs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading NFT tokens:', error);
      setLoading(false);
    }
  };

  const handleAddNFT = () => {
    const nftId = String(nftTokens.length + 1);
    const newNFTData: NFTToken = {
      id: nftId,
      name: newNFT.name,
      description: newNFT.description,
      image: '🌱',
      tokenId: nftTokens.length + 1,
      owner: 'Available',
      mintedAt: 'Not minted',
      pointsRequired: newNFT.pointsRequired,
      rarity: newNFT.rarity,
      status: 'available',
    };

    setNftTokens([...nftTokens, newNFTData]);
    setNewNFT({ name: '', description: '', pointsRequired: 0, rarity: 'common' });
    setOpenDialog(false);
  };

  const handleViewNFT = (nft: NFTToken) => {
    setSelectedNFT(nft);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'default';
      case 'rare':
        return 'primary';
      case 'epic':
        return 'secondary';
      case 'legendary':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'minted':
        return 'success';
      case 'claimed':
        return 'info';
      case 'available':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading NFT tokens...</Typography>;
  }

  const totalNFTs = nftTokens.length;
  const mintedNFTs = nftTokens.filter(nft => nft.status === 'minted').length;
  const availableNFTs = nftTokens.filter(nft => nft.status === 'available').length;
  const totalPointsRequired = nftTokens.reduce((sum, nft) => sum + nft.pointsRequired, 0);

  const rarityData = [
    { name: 'Common', value: nftTokens.filter(nft => nft.rarity === 'common').length },
    { name: 'Rare', value: nftTokens.filter(nft => nft.rarity === 'rare').length },
    { name: 'Epic', value: nftTokens.filter(nft => nft.rarity === 'epic').length },
    { name: 'Legendary', value: nftTokens.filter(nft => nft.rarity === 'legendary').length },
  ];

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">NFT Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New NFT
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total NFTs
              </Typography>
              <Typography variant="h4" color="primary">
                {totalNFTs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Minted NFTs
              </Typography>
              <Typography variant="h4" color="primary">
                {mintedNFTs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available NFTs
              </Typography>
              <Typography variant="h4" color="primary">
                {availableNFTs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Points Required
              </Typography>
              <Typography variant="h4" color="primary">
                {totalPointsRequired.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                NFT Rarity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rarityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* NFTs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            NFT Token Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NFT</TableCell>
                  <TableCell>Token ID</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Points Required</TableCell>
                  <TableCell>Rarity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Minted At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nftTokens.map((nft) => (
                  <TableRow key={nft.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          <NFTIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{nft.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {nft.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>#{nft.tokenId}</TableCell>
                    <TableCell>{nft.owner}</TableCell>
                    <TableCell>{nft.pointsRequired.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={nft.rarity}
                        color={getRarityColor(nft.rarity) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={nft.status}
                        color={getStatusColor(nft.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{nft.mintedAt}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewNFT(nft)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add NFT Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New NFT Token</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="NFT Name"
            fullWidth
            variant="outlined"
            value={newNFT.name}
            onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newNFT.description}
            onChange={(e) => setNewNFT({ ...newNFT, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Points Required"
            type="number"
            fullWidth
            variant="outlined"
            value={newNFT.pointsRequired}
            onChange={(e) => setNewNFT({ ...newNFT, pointsRequired: parseInt(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Rarity"
            fullWidth
            variant="outlined"
            value={newNFT.rarity}
            onChange={(e) => setNewNFT({ ...newNFT, rarity: e.target.value as any })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddNFT} variant="contained" disabled={!newNFT.name}>
            Add NFT
          </Button>
        </DialogActions>
      </Dialog>

      {/* View NFT Dialog */}
      <Dialog
        open={!!selectedNFT}
        onClose={() => setSelectedNFT(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          NFT Details - {selectedNFT?.name}
        </DialogTitle>
        <DialogContent>
          {selectedNFT && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, width: 60, height: 60, bgcolor: 'primary.main' }}>
                  <NFTIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedNFT.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Token ID: #{selectedNFT.tokenId}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNFT.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Owner</Typography>
                  <Typography variant="body2">{selectedNFT.owner}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Points Required</Typography>
                  <Typography variant="body2">{selectedNFT.pointsRequired.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Rarity</Typography>
                  <Chip
                    label={selectedNFT.rarity}
                    color={getRarityColor(selectedNFT.rarity) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={selectedNFT.status}
                    color={getStatusColor(selectedNFT.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Minted At</Typography>
                  <Typography variant="body2">{selectedNFT.mintedAt}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNFT(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NFTManagement;
