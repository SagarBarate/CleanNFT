import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  EmojiEvents as BadgeIcon,
  Token as NFTIcon,
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
  progressToNextBadge: number;
  progressToNFT: number;
  lastActivity: string;
  status: 'active' | 'inactive';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Mock data - in a real app, this would come from your backend
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          totalPoints: 1250,
          bottlesRecycled: 25,
          badgesEarned: 2,
          nftTokens: 1,
          progressToNextBadge: 0.75,
          progressToNFT: 0.6,
          lastActivity: '2024-01-15 14:30',
          status: 'active',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          totalPoints: 890,
          bottlesRecycled: 18,
          badgesEarned: 1,
          nftTokens: 0,
          progressToNextBadge: 0.45,
          progressToNFT: 0.3,
          lastActivity: '2024-01-15 13:45',
          status: 'active',
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          totalPoints: 2100,
          bottlesRecycled: 42,
          badgesEarned: 3,
          nftTokens: 2,
          progressToNextBadge: 0.9,
          progressToNFT: 0.8,
          lastActivity: '2024-01-15 14:20',
          status: 'active',
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          totalPoints: 450,
          bottlesRecycled: 9,
          badgesEarned: 0,
          nftTokens: 0,
          progressToNextBadge: 0.2,
          progressToNFT: 0.15,
          lastActivity: '2024-01-15 12:15',
          status: 'inactive',
        },
        {
          id: '5',
          name: 'Tom Brown',
          email: 'tom.brown@example.com',
          totalPoints: 3200,
          bottlesRecycled: 64,
          badgesEarned: 4,
          nftTokens: 3,
          progressToNextBadge: 1.0,
          progressToNFT: 0.95,
          lastActivity: '2024-01-15 14:10',
          status: 'active',
        },
      ];

      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 0.8) return '#4CAF50';
    if (progress >= 0.5) return '#FF9800';
    return '#F44336';
  };

  if (loading) {
    return <Typography>Loading users...</Typography>;
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const totalBottles = users.reduce((sum, user) => sum + user.bottlesRecycled, 0);
  const totalPoints = users.reduce((sum, user) => sum + user.totalPoints, 0);
  const totalBadges = users.reduce((sum, user) => sum + user.badgesEarned, 0);
  const totalNFTs = users.reduce((sum, user) => sum + user.nftTokens, 0);

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" color="primary">
                {totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4" color="primary">
                {activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Badges
              </Typography>
              <Typography variant="h4" color="primary">
                {totalBadges}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total NFTs
              </Typography>
              <Typography variant="h4" color="primary">
                {totalNFTs}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Bottles</TableCell>
                  <TableCell>Badges</TableCell>
                  <TableCell>NFTs</TableCell>
                  <TableCell>Badge Progress</TableCell>
                  <TableCell>NFT Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Activity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.totalPoints.toLocaleString()}</TableCell>
                    <TableCell>{user.bottlesRecycled}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BadgeIcon sx={{ mr: 1, color: '#FF9800' }} />
                        {user.badgesEarned}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NFTIcon sx={{ mr: 1, color: '#2196F3' }} />
                        {user.nftTokens}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={user.progressToNextBadge * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(user.progressToNextBadge),
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="caption">
                          {Math.round(user.progressToNextBadge * 100)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={user.progressToNFT * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(user.progressToNFT),
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="caption">
                          {Math.round(user.progressToNFT * 100)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.lastActivity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserManagement;
