import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ContentCopy,
  CheckCircle,
  Code,
  Settings,
  PlayArrow,
  Web,
} from '@mui/icons-material';

const steps = [
  {
    label: 'Clone the CleanNFT Repository',
    description: 'Get the code from GitHub and open the Admin Portal directory.',
    command: 'git clone https://github.com/your-org/cleannft.git\ncd cleannft/admin-portal',
    icon: <Code />,
  },
  {
    label: 'Install Dependencies',
    description: 'Install all required packages for the Admin Portal.',
    command: 'npm install',
    icon: <Settings />,
  },
  {
    label: 'Set Environment Variables',
    description: 'Configure your environment with the necessary API endpoints.',
    command: 'NEXT_PUBLIC_API_URL=https://api.clean-nft.com',
    icon: <Settings />,
  },
  {
    label: 'Run Locally',
    description: 'Start the development server.',
    command: 'npm run dev',
    icon: <PlayArrow />,
  },
  {
    label: 'Access the Portal',
    description: 'Visit the local URL to start managing CleanNFT installations.',
    command: 'http://localhost:3000/admin',
    icon: <Web />,
  },
];

const InstallSteps: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setOpenSnackbar(true);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 6, px: 3 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: '#0B0F0E',
          textAlign: 'center',
        }}
      >
        How to Install CleanNFT Admin Portal
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#6B7280',
          textAlign: 'center',
          mb: 6,
          fontSize: '1.1rem',
        }}
      >
        Follow these simple steps to get your Admin Portal up and running
      </Typography>

      <Stepper orientation="vertical" sx={{ mt: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label} active={true} completed={false}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: '#00A86B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#0B0F0E', mb: 1 }}
              >
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography
                variant="body1"
                sx={{ color: '#6B7280', mb: 2 }}
              >
                {step.description}
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: '#1A1A1A',
                  color: '#A3FFB0',
                  p: 2,
                  borderRadius: 2,
                  position: 'relative',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    component="pre"
                    sx={{
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowX: 'auto',
                    }}
                  >
                    {step.command}
                  </Box>
                  <Tooltip title={copiedIndex === index ? 'Copied!' : 'Copy'}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(step.command, index)}
                      sx={{
                        color: copiedIndex === index ? '#00A86B' : '#A3FFB0',
                        ml: 2,
                        '&:hover': {
                          bgcolor: 'rgba(163, 255, 176, 0.1)',
                        },
                      }}
                    >
                      {copiedIndex === index ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                        <ContentCopy fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ bgcolor: '#00A86B', color: 'white' }}
        >
          Command copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstallSteps;

