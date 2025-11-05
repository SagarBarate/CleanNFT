import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  Link,
  Avatar,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  QrCodeScanner as ScannerIcon,
  CameraAlt as CameraIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  PhotoCamera as CameraIcon2,
} from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loginWithCredentials } = useAuth();

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

  const handleLoginFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);

    try {
      await loginWithCredentials(loginForm.email, loginForm.password, profileImage);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError(null);
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
              Choose your preferred way to access the recycling rewards system
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Tabs for different login methods */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="QR Code Login" icon={<ScannerIcon />} />
                <Tab label="Email Login" icon={<EmailIcon />} />
              </Tabs>
            </Box>

            {/* QR Code Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Scan the QR code on the digital bin to start recycling and earn points!
                </Typography>

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
              </Box>
            )}

            {/* Email Login Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sign in with your email and password to access your account
                </Typography>

                {/* Profile Image Upload */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={previewImage || undefined}
                      sx={{
                        width: 80,
                        height: 80,
                        fontSize: '1.5rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      <EmailIcon />
                    </Avatar>
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<CameraIcon2 />}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        minWidth: 'auto',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
                </Box>

                <Box component="form" onSubmit={handleEmailLogin}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={loginForm.email}
                        onChange={handleLoginFormChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={loginForm.password}
                        onChange={handleLoginFormChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loginLoading}
                        sx={{ py: 1.5 }}
                      >
                        {loginLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/signup" color="primary">
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>How it works:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                1. Choose your login method (QR or Email)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Connect to the recycling system
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
