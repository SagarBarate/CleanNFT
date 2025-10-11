import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { Web3Provider } from './contexts/Web3Context';
import Layout from './components/Layout';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import BadgeScreen from './screens/BadgeScreen';
import NFTClaimScreen from './screens/NFTClaimScreen';
import { CleanNFTPage } from './features/nft/pages/CleanNFTPage';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <div className="loading-spinner">Loading...</div>
      </Box>
    );
  }

  return (
    <Web3Provider>
      <Container maxWidth={false} disableGutters>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupScreen />
            } 
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="scanner" element={<QRScannerScreen />} />
            <Route path="badges" element={<BadgeScreen />} />
            <Route path="nfts" element={<NFTClaimScreen />} />
            <Route path="nft" element={<CleanNFTPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Container>
    </Web3Provider>
  );
}

export default App;
