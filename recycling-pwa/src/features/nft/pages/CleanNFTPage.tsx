import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  GetApp as ClaimIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { ClaimableList } from '../components/ClaimableList';
import { OwnedList } from '../components/OwnedList';
import { useWallet } from '../hooks/useWallet';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cleannft-tabpanel-${index}`}
      aria-labelledby={`cleannft-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `cleannft-tab-${index}`,
    'aria-controls': `cleannft-tabpanel-${index}`,
  };
}

export const CleanNFTPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const { isConnected, isMumbai } = useWallet();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClaimSuccess = (_tokenId: string, _transactionHash: string) => {
    // Switch to "My NFTs" tab after successful claim
    setTabValue(1);
    // Trigger refresh of owned NFTs
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" className="cleannft-page">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🌱 CleanNFT
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Claim and manage your recycling achievement NFTs on Polygon Mumbai
        </Typography>
        
        {/* Wallet Connection */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <WalletConnectButton 
            variant="contained" 
            size="large"
            showAddress={true}
            showNetworkStatus={true}
          />
        </Box>

        {/* Network Status */}
        {isConnected && !isMumbai && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please switch to Polygon Mumbai Testnet to use CleanNFT features
          </Alert>
        )}
      </Box>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }} elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="CleanNFT tabs"
            className="cleannft-tabs"
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClaimIcon />
                  Claimable NFTs
                </Box>
              }
              {...a11yProps(0)} 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WalletIcon />
                  My NFTs
                </Box>
              }
              {...a11yProps(1)} 
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <ClaimableList onClaimSuccess={handleClaimSuccess} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <OwnedList key={refreshKey} />
        </TabPanel>
      </Paper>

      {/* Footer Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          CleanNFT is a beta feature. NFTs are minted on Polygon Mumbai testnet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Make sure you have some MATIC for gas fees.
        </Typography>
      </Box>
    </Container>
  );
};
