import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Container,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  EmojiEvents as BadgeIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Star as StarIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  isEarned: boolean;
  isClaimed: boolean;
  progress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
}

const BadgeScreen: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    try {
      // Mock badge data - in a real app, this would come from your backend
      const mockBadges: Badge[] = [
        {
          id: '1',
          name: 'Recycling Rookie',
          description: 'Recycle your first 10 bottles and earn 500 points',
          icon: '🌱',
          pointsRequired: 500,
          isEarned: true,
          isClaimed: true,
          progress: 1.0,
          rarity: 'common',
          category: 'Beginner',
        },
        {
          id: '2',
          name: 'Green Guardian',
          description: 'Recycle 50 bottles and earn 1000 points',
          icon: '🌿',
          pointsRequired: 1000,
          isEarned: true,
          isClaimed: true,
          progress: 1.0,
          rarity: 'common',
          category: 'Intermediate',
        },
        {
          id: '3',
          name: 'Eco Warrior',
          description: 'Recycle 100 bottles and earn 2000 points',
          icon: '🌳',
          pointsRequired: 2000,
          isEarned: false,
          isClaimed: false,
          progress: 0.75,
          rarity: 'rare',
          category: 'Advanced',
        },
        {
          id: '4',
          name: 'Sustainability Champion',
          description: 'Recycle 200 bottles and earn 5000 points',
          icon: '🏆',
          pointsRequired: 5000,
          isEarned: false,
          isClaimed: false,
          progress: 0.25,
          rarity: 'epic',
          category: 'Expert',
        },
        {
          id: '5',
          name: 'Planet Protector',
          description: 'Recycle 500 bottles and earn 10000 points',
          icon: '🌍',
          pointsRequired: 10000,
          isEarned: false,
          isClaimed: false,
          progress: 0.125,
          rarity: 'legendary',
          category: 'Master',
        },
        {
          id: '6',
          name: 'Weekly Recycler',
          description: 'Recycle bottles for 7 consecutive days',
          icon: '📅',
          pointsRequired: 1000,
          isEarned: false,
          isClaimed: false,
          progress: 0.6,
          rarity: 'rare',
          category: 'Streak',
        },
        {
          id: '7',
          name: 'Community Leader',
          description: 'Help 10 other users recycle their first bottle',
          icon: '👥',
          pointsRequired: 3000,
          isEarned: false,
          isClaimed: false,
          progress: 0.3,
          rarity: 'epic',
          category: 'Social',
        },
        {
          id: '8',
          name: 'Innovation Pioneer',
          description: 'Suggest and implement a new recycling feature',
          icon: '💡',
          pointsRequired: 8000,
          isEarned: false,
          isClaimed: false,
          progress: 0.0,
          rarity: 'legendary',
          category: 'Innovation',
        },
      ];

      setBadges(mockBadges);
      setLoading(false);
    } catch (error) {
      console.error('Error loading badges:', error);
      setLoading(false);
    }
  };

  const handleClaimBadge = (badge: Badge) => {
    // Update badge status
    setBadges(prev => 
      prev.map(b => 
        b.id === badge.id 
          ? { ...b, isClaimed: true }
          : b
      )
    );
    
    setSnackbar({
      open: true,
      message: `"${badge.name}" badge claimed successfully!`,
      severity: 'success',
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      default: return '#666';
    }
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              fontSize: '2rem',
              bgcolor: badge.isEarned ? getRarityColor(badge.rarity) : '#ccc',
              mr: 2,
            }}
          >
            {badge.icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {badge.name}
            </Typography>
            <Chip
              label={getRarityLabel(badge.rarity)}
              size="small"
              sx={{
                bgcolor: getRarityColor(badge.rarity),
                color: 'white',
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {badge.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(badge.progress * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={badge.progress * 100}
            sx={{ height: 6, borderRadius: 3 }}
            color="primary"
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            {badge.pointsRequired} points required
          </Typography>
          <Chip
            icon={badge.isClaimed ? <CheckIcon /> : badge.isEarned ? <StarIcon /> : <LockIcon />}
            label={badge.isClaimed ? 'Claimed' : badge.isEarned ? 'Earned' : 'Locked'}
            color={badge.isClaimed ? 'success' : badge.isEarned ? 'warning' : 'default'}
            size="small"
          />
        </Box>

        {badge.isEarned && !badge.isClaimed && (
          <Button
            variant="contained"
            onClick={() => handleClaimBadge(badge)}
            startIcon={<StarIcon />}
            fullWidth
            sx={{ bgcolor: getRarityColor(badge.rarity) }}
          >
            Claim Badge
          </Button>
        )}

        {!badge.isEarned && (
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Keep recycling to unlock this badge!
          </Typography>
        )}
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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h4" gutterBottom color="primary">
          🌟 Environmental Badges
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Earn badges by recycling bottles and contributing to a sustainable future
        </Typography>
      </Box>

      {/* Badge Categories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Badge Categories
        </Typography>
        <Grid container spacing={2}>
          {['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Streak', 'Social', 'Innovation'].map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                variant="outlined"
                color="primary"
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Badges Grid */}
      <Grid container spacing={3}>
        {badges.map((badge) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={badge.id}>
            <BadgeCard badge={badge} />
          </Grid>
        ))}
      </Grid>

      {/* Achievement Summary */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            Achievement Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {badges.filter(b => b.isEarned).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Badges Earned
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {badges.filter(b => b.isClaimed).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Badges Claimed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {badges.filter(b => b.isEarned && !b.isClaimed).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ready to Claim
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="text.secondary">
                  {badges.filter(b => !b.isEarned).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Still Locked
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BadgeScreen;
