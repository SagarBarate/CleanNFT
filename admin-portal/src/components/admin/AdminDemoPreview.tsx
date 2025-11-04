import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Card,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Recycling as RecycleIcon,
  People as PeopleIcon,
  Token as TokenIcon,
  TrendingUp,
  Storage,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDemoPreview: React.FC = () => {
  const navigate = useNavigate();
  const demoUrl = process.env.REACT_APP_ADMIN_DEMO_URL;

  const handleTryDemo = () => {
    // Navigate to the actual admin portal
    if (demoUrl) {
      window.location.href = demoUrl;
    } else {
      // Navigate to the dashboard
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 6, px: 3 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: 'white',
          textAlign: 'center',
        }}
      >
        Admin Portal Demo
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          mb: 6,
          fontSize: '1.1rem',
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        Experience the full Admin Portal interface. Manage devices, monitor NFTs, and track sustainability metrics in real-time.
      </Typography>

      {/* Mockup Preview */}
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
          mb: 4,
        }}
      >
        {/* Browser Window Frame */}
        <Box
          sx={{
            bgcolor: '#2d2d2d',
            py: 1,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#ff5f57',
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#ffbd2e',
            }}
          />
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: '#28ca42',
            }}
          />
        </Box>

        {/* Admin Portal Preview Content */}
        <Box sx={{ p: 3, bgcolor: '#f5f5f5' }}>
          {/* Top Navbar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              pb: 2,
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0B0F0E' }}>
              CleanNFT Admin Portal
            </Typography>
            <Avatar
              sx={{
                bgcolor: '#00A86B',
                width: 40,
                height: 40,
              }}
            >
              A
            </Avatar>
          </Box>

          {/* Sidebar + Main Content Layout */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Sidebar Preview */}
            <Paper
              elevation={2}
              sx={{
                width: 200,
                p: 2,
                bgcolor: 'white',
                borderRadius: 2,
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: '#00A86B',
                    color: 'white',
                  }}
                >
                  <DashboardIcon fontSize="small" />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Dashboard
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { icon: <RecycleIcon />, label: 'Bin Management' },
                  { icon: <PeopleIcon />, label: 'Users' },
                  { icon: <TokenIcon />, label: 'NFTs' },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 1,
                      color: '#6B7280',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Main Dashboard Preview */}
            <Box sx={{ flex: 1 }}>
              <Grid container spacing={2}>
                {[
                  {
                    title: 'Total Devices',
                    value: '24',
                    icon: <Storage />,
                    color: '#00A86B',
                  },
                  {
                    title: 'Active Users',
                    value: '1,234',
                    icon: <PeopleIcon />,
                    color: '#4CAF50',
                  },
                  {
                    title: 'NFTs Minted',
                    value: '5,678',
                    icon: <TokenIcon />,
                    color: '#A3FFB0',
                  },
                  {
                    title: 'Growth Rate',
                    value: '+12%',
                    icon: <TrendingUp />,
                    color: '#10B981',
                  },
                ].map((stat, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Card
                      sx={{
                        bgcolor: 'white',
                        borderRadius: 2,
                        p: 2,
                        height: '100%',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: '#6B7280', mb: 0.5 }}
                          >
                            {stat.title}
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: '#0B0F0E' }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            bgcolor: `${stat.color}20`,
                            borderRadius: 2,
                            p: 1.5,
                            color: stat.color,
                          }}
                        >
                          {stat.icon}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Chart Preview Placeholder */}
              <Paper
                elevation={2}
                sx={{
                  mt: 2,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 2,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #e0e0e0',
                }}
              >
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Analytics Chart Preview
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* CTA Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleTryDemo}
          sx={{
            bgcolor: '#00A86B',
            color: 'white',
            px: 5,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: 3,
            textTransform: 'none',
            boxShadow: '0 4px 20px rgba(0, 168, 107, 0.4)',
            '&:hover': {
              bgcolor: '#008a5a',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(0, 168, 107, 0.5)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Open Full Admin Portal Demo →
        </Button>
      </Box>
    </Box>
  );
};

export default AdminDemoPreview;

