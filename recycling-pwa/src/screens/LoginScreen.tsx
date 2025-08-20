import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  QrCodeScanner as ScannerIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
    setScanning(true);
    
    // Initialize QR scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(
      (decodedText) => {
        handleQRCodeScanned(decodedText);
        scanner.clear();
      },
      (error) => {
        console.error('QR scan error:', error);
      }
    );
  };

  const handleQRCodeScanned = async (data: string) => {
    try {
      // Parse the QR code data (assuming it contains bin ID and location)
      const qrData = JSON.parse(data);
      
      if (!qrData.binId || !qrData.location) {
        throw new Error('Invalid QR code format');
      }

      // Login with the scanned data
      await login(qrData.binId, qrData.location);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('QR code parsing error:', error);
      setError('Invalid QR code format. Please try again.');
      setIsScanning(false);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanning(false);
    // Clear the scanner element
    const scannerElement = document.getElementById('qr-reader');
    if (scannerElement) {
      scannerElement.innerHTML = '';
    }
  };

  const handleManualLogin = () => {
    // For demo purposes, allow manual login
    login('demo-bin-001', 'Demo Location').then(() => {
      navigate('/dashboard');
    });
  };

  if (isScanning) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5" color="primary" gutterBottom>
              Scan QR Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Position the QR code within the frame to connect to the recycling bin
            </Typography>
            
            <Box
              id="qr-reader"
              sx={{
                width: '100%',
                maxWidth: 400,
                margin: '0 auto',
                mb: 3,
              }}
            />
            
            {scanning && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Scanning...</Typography>
              </Box>
            )}
            
            <Button
              variant="outlined"
              onClick={stopScanning}
              startIcon={<CameraIcon />}
              fullWidth
            >
              Cancel Scanning
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              🌱 Recycling Rewards
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Scan the QR code on the digital bin to start recycling and earn points!
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={startScanning}
                  startIcon={<ScannerIcon />}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Scan QR Code
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={handleManualLogin}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  Demo Mode (Skip QR)
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                How it works:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                1. Find a recycling bin with a QR code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Scan the code to connect
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Start recycling and earn rewards!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginScreen;
