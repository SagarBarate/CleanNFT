import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  QrCodeScanner as ScannerIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../hooks/useAuth';

const QRScannerScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Start scanning automatically when component mounts
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startScanning();
    }, 100);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      stopScanning();
    };
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    setError(null);
    setSuccess(false);
    setScannedData(null);
    setScanning(true);
    
    // Ensure the DOM element exists before initializing scanner
    const qrReaderElement = document.getElementById('qr-reader');
    if (!qrReaderElement) {
      console.error('QR reader element not found');
      setError('Failed to initialize scanner. Please refresh the page.');
      setScanning(false);
      return;
    }
    
    try {
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
          setError('Failed to initialize camera. Please check permissions.');
          setScanning(false);
        }
      );
      
      // Mark scanner as initialized
      setScannerInitialized(true);
    } catch (error) {
      console.error('Scanner initialization error:', error);
      setError('Failed to initialize scanner. Please try again.');
      setScanning(false);
    }
  };

  const handleQRCodeScanned = async (data: string) => {
    try {
      setScannedData(data);
      setScanning(false);
      
      // Parse the QR code data
      const qrData = JSON.parse(data);
      
      if (!qrData.binId || !qrData.location) {
        throw new Error('Invalid QR code format');
      }

      // Update authentication with new bin
      await login(qrData.binId, qrData.location);
      
      setSuccess(true);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('QR code parsing error:', error);
      setError('Invalid QR code format. Please try again.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanning(false);
    setScannerInitialized(false);
    
    // Clear the scanner element
    const scannerElement = document.getElementById('qr-reader');
    if (scannerElement) {
      try {
        scannerElement.innerHTML = '';
      } catch (error) {
        console.warn('Error clearing scanner element:', error);
      }
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setError(null);
    setSuccess(false);
    startScanning();
  };

  if (success) {
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
              p: 4,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <CheckIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" color="success.main" gutterBottom>
              Bin Connected Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You're now connected to the new recycling bin. Redirecting to dashboard...
            </Typography>
            <CircularProgress size={24} />
          </Paper>
        </Box>
      </Container>
    );
  }

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
              Scan New Bin
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Position the QR code within the frame to connect to a new recycling bin
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetScanner}
                    startIcon={<ScannerIcon />}
                  >
                    Retry
                  </Button>
                </Box>
              </Alert>
            )}
            
            <Box
              id="qr-reader"
              sx={{
                width: '100%',
                maxWidth: 400,
                margin: '0 auto',
                mb: 3,
              }}
            />
            
            {scanning && !scannerInitialized && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Initializing camera...</Typography>
              </Box>
            )}
            
            {scanning && scannerInitialized && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Scanning...</Typography>
              </Box>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  onClick={stopScanning}
                  startIcon={<CameraIcon />}
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  onClick={resetScanner}
                  startIcon={<ScannerIcon />}
                  fullWidth
                >
                  Scan Again
                </Button>
              </Grid>
            </Grid>
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
            <ScannerIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" color="primary" gutterBottom>
              Connect to New Bin
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Scan a QR code from another recycling bin to switch your connection
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetScanner}
                    startIcon={<ScannerIcon />}
                  >
                    Retry
                  </Button>
                </Box>
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={startScanning}
              startIcon={<ScannerIcon />}
              fullWidth
              sx={{ py: 1.5, mb: 2 }}
            >
              Start Scanning
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Back to Dashboard
            </Button>

            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> Connecting to a new bin will update your current session.
                Your progress and points will be maintained.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default QRScannerScreen;
