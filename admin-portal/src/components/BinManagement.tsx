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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { Add as AddIcon, QrCode as QrCodeIcon } from '@mui/icons-material';
import QRCode from 'react-qr-code';

interface Bin {
  id: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  bottlesRecycled: number;
  totalPoints: number;
  lastActivity: string;
  qrCodeData: string;
}

const BinManagement: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [newBin, setNewBin] = useState({
    location: '',
    status: 'active' as const,
  });

  useEffect(() => {
    loadBins();
  }, []);

  const loadBins = async () => {
    try {
      // Mock data - in a real app, this would come from your backend
      const mockBins: Bin[] = [
        {
          id: 'BIN-001',
          location: 'Central Park - Main Entrance Athlone',
          status: 'active',
          bottlesRecycled: 150,
          totalPoints: 7500,
          lastActivity: '2024-01-15 14:30',
          qrCodeData: JSON.stringify({
            binId: 'BIN-001',
            location: 'Central Park - Main Entrance',
            type: 'recycling_bin',
          }),
        },
        {
          id: 'BIN-002',
          location: 'Shopping Mall - Food Court',
          status: 'active',
          bottlesRecycled: 89,
          totalPoints: 4450,
          lastActivity: '2024-01-15 13:45',
          qrCodeData: JSON.stringify({
            binId: 'BIN-002',
            location: 'Shopping Mall - Food Court',
            type: 'recycling_bin',
          }),
        },
        {
          id: 'BIN-003',
          location: 'University Campus - Library',
          status: 'maintenance',
          bottlesRecycled: 67,
          totalPoints: 3350,
          lastActivity: '2024-01-15 12:20',
          qrCodeData: JSON.stringify({
            binId: 'BIN-003',
            location: 'University Campus - Library',
            type: 'recycling_bin',
          }),
        },
        {
          id: 'BIN-004',
          location: 'Office Building - Lobby',
          status: 'active',
          bottlesRecycled: 234,
          totalPoints: 11700,
          lastActivity: '2024-01-15 14:15',
          qrCodeData: JSON.stringify({
            binId: 'BIN-004',
            location: 'Office Building - Lobby',
            type: 'recycling_bin',
          }),
        },
        {
          id: 'BIN-005',
          location: 'Train Station - Platform 1',
          status: 'inactive',
          bottlesRecycled: 45,
          totalPoints: 2250,
          lastActivity: '2024-01-14 18:30',
          qrCodeData: JSON.stringify({
            binId: 'BIN-005',
            location: 'Train Station - Platform 1',
            type: 'recycling_bin',
          }),
        },
      ];

      setBins(mockBins);
      setLoading(false);
    } catch (error) {
      console.error('Error loading bins:', error);
      setLoading(false);
    }
  };

  const handleAddBin = () => {
    const binId = `BIN-${String(bins.length + 1).padStart(3, '0')}`;
    const qrCodeData = JSON.stringify({
      binId,
      location: newBin.location,
      type: 'recycling_bin',
    });

    const newBinData: Bin = {
      id: binId,
      location: newBin.location,
      status: newBin.status,
      bottlesRecycled: 0,
      totalPoints: 0,
      lastActivity: new Date().toISOString().replace('T', ' ').substring(0, 16),
      qrCodeData,
    };

    setBins([...bins, newBinData]);
    setNewBin({ location: '', status: 'active' });
    setOpenDialog(false);
  };

  const handleShowQRCode = (bin: Bin) => {
    setSelectedBin(bin);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading bins...</Typography>;
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Bin Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Bin
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bins
              </Typography>
              <Typography variant="h4" color="primary">
                {bins.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Bins
              </Typography>
              <Typography variant="h4" color="primary">
                {bins.filter(bin => bin.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bottles
              </Typography>
              <Typography variant="h4" color="primary">
                {bins.reduce((sum, bin) => sum + bin.bottlesRecycled, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Points
              </Typography>
              <Typography variant="h4" color="primary">
                {bins.reduce((sum, bin) => sum + bin.totalPoints, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bins Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bin Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bin ID</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Bottles Recycled</TableCell>
                  <TableCell>Total Points</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bins.map((bin) => (
                  <TableRow key={bin.id}>
                    <TableCell>{bin.id}</TableCell>
                    <TableCell>{bin.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={bin.status}
                        color={getStatusColor(bin.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{bin.bottlesRecycled.toLocaleString()}</TableCell>
                    <TableCell>{bin.totalPoints.toLocaleString()}</TableCell>
                    <TableCell>{bin.lastActivity}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<QrCodeIcon />}
                        onClick={() => handleShowQRCode(bin)}
                      >
                        Show QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Bin Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Bin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={newBin.location}
            onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddBin} variant="contained" disabled={!newBin.location}>
            Add Bin
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog
        open={!!selectedBin}
        onClose={() => setSelectedBin(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          QR Code for {selectedBin?.id} - {selectedBin?.location}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            {selectedBin && (
              <QRCode
                value={selectedBin.qrCodeData}
                size={256}
                level="H"
              />
            )}
          </Box>
          <Typography variant="body2" color="textSecondary" align="center">
            Scan this QR code with the mobile app to connect to this bin
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBin(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BinManagement;
