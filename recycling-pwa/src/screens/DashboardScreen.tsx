import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  EmojiEvents as BadgeIcon,
  Token as NFTIcon,
  QrCodeScanner as ScannerIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import RecycleIcon from '../components/RecycleIcon';

interface UserStats {
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
  progressToNextBadge: number;
  progressToNFT: number;
  level: number;
  nextLevelPoints: number;
}

const DashboardScreen: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 1250,
    bottlesRecycled: 25,
    badgesEarned: 2,
    nftTokens: 1,
    progressToNextBadge: 0.75,
    progressToNFT: 0.6,
    level: 3,
    nextLevelPoints: 2000,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();

  useEffect(() => {
    // Load user stats from backend or local storage
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // In a real app, this would be an API call to your backend
      // For now, we'll use the mock data
      setLoading(false);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setLoading(false);
    }
  };

  const handleDumpBottles = () => {
    const newBottles = userStats.bottlesRecycled + 1;
    const newPoints = userStats.totalPoints + 50;
    const newProgressToBadge = Math.min(1, (newPoints % 1000) / 1000);
    const newProgressToNFT = Math.min(1, (newPoints % 5000) / 5000);

    const updatedStats: UserStats = {
      ...userStats,
      bottlesRecycled: newBottles,
      totalPoints: newPoints,
      progressToNextBadge: newProgressToBadge,
      progressToNFT: newProgressToNFT,
      level: Math.floor(newPoints / 1000) + 1,
    };

    setUserStats(updatedStats);
    
    // Update auth context
    if (user) {
      updateUserStats({
        totalPoints: newPoints,
        bottlesRecycled: newBottles,
      });
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={color} fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const ProgressCard: React.FC<{
    title: string;
    progress: number;
    currentValue: number;
    targetValue: number;
    color: string;
    actionText: string;
    onAction: () => void;
    disabled?: boolean;
  }> = ({ title, progress, currentValue, targetValue, color, actionText, onAction, disabled }) => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress * 100}
            sx={{ height: 8, borderRadius: 4 }}
            color="primary"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {currentValue} / {targetValue}
          </Typography>
          <Chip
            label={progress >= 1 ? 'Complete!' : 'In Progress'}
            color={progress >= 1 ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Button
          variant="contained"
          onClick={onAction}
          disabled={disabled || progress < 1}
          fullWidth
          sx={{ bgcolor: color }}
        >
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom color="primary">
        Welcome back! 🌱
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Connected to bin at {user?.binLocation}
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Points"
            value={userStats.totalPoints}
            icon={<TrendingIcon />}
            color="#4CAF50"
            subtitle={`Level ${userStats.level}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bottles Recycled"
            value={userStats.bottlesRecycled}
            icon={<RecycleIcon size={24} />}
            color="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Badges Earned"
            value={userStats.badgesEarned}
            icon={<BadgeIcon />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="NFT Tokens"
            value={userStats.nftTokens}
            icon={<NFTIcon />}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      {/* Progress Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ProgressCard
            title="Progress to Next Badge"
            progress={userStats.progressToNextBadge}
            currentValue={userStats.totalPoints % 1000}
            targetValue={1000}
            color="#4CAF50"
            actionText="View Badges"
            onAction={() => navigate('/badges')}
            disabled={userStats.progressToNextBadge < 1}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProgressCard
            title="Progress to NFT Token"
            progress={userStats.progressToNFT}
            currentValue={userStats.totalPoints % 5000}
            targetValue={5000}
            color="#FF9800"
            actionText="Claim NFT"
            onAction={() => navigate('/nfts')}
            disabled={userStats.progressToNFT < 1}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Quick Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                onClick={handleDumpBottles}
                startIcon={<AddIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                Dump Bottles (+50 pts)
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => navigate('/scanner')}
                startIcon={<ScannerIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                Scan New Bin
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => navigate('/badges')}
                startIcon={<BadgeIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                View Badges
              </Button>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => navigate('/nfts')}
                startIcon={<NFTIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                Claim NFTs
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Recent Activity
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 32, height: 32 }}>
                              <RecycleIcon size={20} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">
                Recycled 1 bottle
              </Typography>
              <Typography variant="caption" color="text.secondary">
                +50 points • Just now
              </Typography>
            </Box>
            <Chip label="+50" color="success" size="small" />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 32, height: 32 }}>
              <BadgeIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">
                Earned "Green Guardian" badge
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2 hours ago
              </Typography>
            </Box>
            <Chip label="Badge" color="warning" size="small" />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 32, height: 32 }}>
              <NFTIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2">
                Claimed "Recycling Pioneer" NFT
              </Typography>
              <Typography variant="caption" color="text.secondary">
                1 day ago
              </Typography>
            </Box>
            <Chip label="NFT" color="info" size="small" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardScreen;
