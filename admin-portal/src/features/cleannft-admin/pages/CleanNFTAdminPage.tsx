import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory as InventoryIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { AdminGate, AdminProvider } from '../components/AdminGate';
import MintForm from '../components/MintForm';
import InventoryTable from '../components/InventoryTable';
import AuthorityPanel from '../components/AuthorityPanel';

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
      id={`cleannft-admin-tabpanel-${index}`}
      aria-labelledby={`cleannft-admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `cleannft-admin-tab-${index}`,
    'aria-controls': `cleannft-admin-tabpanel-${index}`,
  };
}

const CleanNFTAdminPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMintSuccess = () => {
    // Switch to inventory tab to show newly minted tokens
    setTabValue(1);
  };

  const handleInventoryRefresh = () => {
    // This will be called when inventory is refreshed
    // Could trigger other updates if needed
  };

  const handleAuthorityStateChange = () => {
    // This will be called when contract state changes
    // Could trigger other updates if needed
  };

  return (
    <AdminProvider>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            CleanNFT Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage NFT minting, inventory, and contract controls
          </Typography>
        </Box>

        <AdminGate>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="CleanNFT Admin tabs"
                variant="fullWidth"
              >
                <Tab
                  icon={<AddIcon />}
                  label="Mint NFTs"
                  {...a11yProps(0)}
                />
                <Tab
                  icon={<InventoryIcon />}
                  label="Inventory"
                  {...a11yProps(1)}
                />
                <Tab
                  icon={<SecurityIcon />}
                  label="Authority"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <MintForm onMintSuccess={handleMintSuccess} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <InventoryTable onRefresh={handleInventoryRefresh} />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <AuthorityPanel onStateChange={handleAuthorityStateChange} />
            </TabPanel>
          </Paper>
        </AdminGate>
      </Container>
    </AdminProvider>
  );
};

export default CleanNFTAdminPage;
