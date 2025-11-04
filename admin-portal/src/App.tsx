import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import Dashboard from './components/Dashboard';
import BinManagement from './components/BinManagement';
import UserManagement from './components/UserManagement';
import NFTManagement from './components/NFTManagement';
import CleanNFTAdminPage from './features/cleannft-admin/pages/CleanNFTAdminPage';
import AdminLanding from './components/AdminLanding';
import Sidebar from './components/Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A86B',
      light: '#A3FFB0',
      dark: '#008a5a',
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/admin-landing';

  return (
    <Box sx={{ display: 'flex' }}>
      {!isLandingPage && <Sidebar />}
      <Box component="main" sx={{ flexGrow: 1, p: isLandingPage ? 0 : 3 }}>
        <Routes>
          <Route path="/" element={<AdminLanding />} />
          <Route path="/admin-landing" element={<AdminLanding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bins" element={<BinManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/nfts" element={<NFTManagement />} />
          <Route path="/admin/nft" element={<CleanNFTAdminPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
