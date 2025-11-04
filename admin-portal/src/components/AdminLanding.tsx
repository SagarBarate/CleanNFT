import React, { useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  Storage,
  Token as TokenIcon,
  Analytics,
  RocketLaunch,
  Email,
  Chat,
} from '@mui/icons-material';
import AdminDemoPreview from './admin/AdminDemoPreview';

const AdminLanding: React.FC = () => {
  const demoSectionRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      title: 'Device Management',
      description:
        'Add and configure IoT recycling stations. Monitor device status, connectivity, and performance in real-time.',
      icon: <Storage sx={{ fontSize: 48 }} />,
      color: '#00A86B',
    },
    {
      title: 'NFT Oversight',
      description:
        'View all minted NFTs and rewards. Track recycling activities, verify transactions, and manage the reward ecosystem.',
      icon: <TokenIcon sx={{ fontSize: 48 }} />,
      color: '#10B981',
    },
    {
      title: 'Analytics Dashboard',
      description:
        'Monitor sustainability performance with comprehensive analytics. Track metrics, generate reports, and gain insights.',
      icon: <Analytics sx={{ fontSize: 48 }} />,
      color: '#A3FFB0',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0B0F0E 0%, #1a3a2e 50%, #0B0F0E 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 168, 107, 0.1) 0%, transparent 70%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: 900,
              mx: 'auto',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
              }}
            >
              Deploy. Manage. Monitor.
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: 700,
                lineHeight: 1.6,
              }}
            >
              CleanNFT Admin Portal empowers organizations to monitor NFT-based
              recycling activity, manage IoT stations, and control real-time
              sustainability operations.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={scrollToDemo}
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
                Try Demo
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="#demo"
                sx={{
                  borderColor: '#00A86B',
                  color: '#00A86B',
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#A3FFB0',
                    color: '#A3FFB0',
                    borderWidth: 2,
                    bgcolor: 'rgba(163, 255, 176, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Try Admin Portal Demo →
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* About / Overview Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#0B0F0E',
            }}
          >
            The Backbone of CleanNFT Ecosystem
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6B7280',
              fontSize: '1.1rem',
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            The Admin Portal is the backbone of the CleanNFT ecosystem — a
            platform for organizations to install, configure, and monitor
            recycling devices connected to blockchain.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  p: 3,
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 168, 107, 0.15)',
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      bgcolor: `${feature.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: '#0B0F0E',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6B7280',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Admin Portal Demo Section */}
      <Box
        ref={demoSectionRef}
        id="demo"
        sx={{
          background: 'linear-gradient(135deg, #0B0F0E 0%, #1a3a2e 50%, #0B0F0E 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <AdminDemoPreview />
      </Box>

      {/* Contact / Support Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Paper
          elevation={3}
          sx={{
            bgcolor: '#00A86B',
            color: 'white',
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <RocketLaunch sx={{ fontSize: 64, mb: 3, opacity: 0.9 }} />
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Need Help?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              mb: 4,
              opacity: 0.95,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Want to deploy CleanNFT in your organization? Get in touch with our
            support team for assistance with installation, configuration, and
            custom deployments.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<Email />}
              href="mailto:support@clean-nft.com"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2,
                },
              }}
            >
              Email Support
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Chat />}
              sx={{
                bgcolor: 'white',
                color: '#00A86B',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Chat with Us
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#0B0F0E',
          color: 'white',
          py: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} CleanNFT Admin Portal. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLanding;

