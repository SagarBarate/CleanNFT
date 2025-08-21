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
  TextField,
  Button,
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
  phone?: string;
  profileImage?: string;
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
  progressToNextBadge: number;
  progressToNFT: number;
  lastActivity: string;
  status: 'active' | 'inactive';
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
          phone: '+1234567890',
          profileImage: undefined,
          totalPoints: 1250,
          bottlesRecycled: 25,
          badgesEarned: 2,
          nftTokens: 1,
          progressToNextBadge: 0.75,
          progressToNFT: 0.6,
          lastActivity: '2024-01-15 14:30',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
          lastLogin: '2024-01-15T14:30:00.000Z',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567891',
          profileImage: undefined,
          totalPoints: 890,
          bottlesRecycled: 18,
          badgesEarned: 1,
          nftTokens: 0,
          progressToNextBadge: 0.45,
          progressToNFT: 0.3,
          lastActivity: '2024-01-15 13:45',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-02T00:00:00.000Z',
          lastLogin: '2024-01-15T13:45:00.000Z',
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+1234567892',
          profileImage: undefined,
          totalPoints: 2100,
          bottlesRecycled: 42,
          badgesEarned: 3,
          nftTokens: 2,
          progressToNextBadge: 0.9,
          progressToNFT: 0.8,
          lastActivity: '2024-01-15 14:20',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-02T00:00:00.000Z',
          lastLogin: '2024-01-15T14:20:00.000Z',
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+1234567893',
          profileImage: undefined,
          totalPoints: 450,
          bottlesRecycled: 9,
          badgesEarned: 0,
          nftTokens: 0,
          progressToNextBadge: 0.2,
          progressToNFT: 0.15,
          lastActivity: '2024-01-15 12:15',
          status: 'inactive',
          role: 'user',
          createdAt: '2024-01-04T00:00:00.000Z',
          lastLogin: '2024-01-15T12:15:00.000Z',
        },
        {
          id: '5',
          name: 'Tom Brown',
          email: 'tom.brown@example.com',
          phone: '+1234567894',
          profileImage: undefined,
          totalPoints: 3200,
          bottlesRecycled: 64,
          badgesEarned: 4,
          nftTokens: 2,
          progressToNextBadge: 1.0,
          progressToNFT: 0.95,
          lastActivity: '2024-01-15T14:10:00.000Z',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-05T00:00:00.000Z',
          lastLogin: '2024-01-15T14:10:00.000Z',
        },
        {
          id: '6',
          name: 'Emma Davis',
          email: 'emma.davis@example.com',
          phone: '+1234567895',
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          totalPoints: 750,
          bottlesRecycled: 15,
          badgesEarned: 1,
          nftTokens: 0,
          progressToNextBadge: 0.3,
          progressToNFT: 0.2,
          lastActivity: '2024-01-15T15:30:00.000Z',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-15T10:00:00.000Z',
          lastLogin: '2024-01-15T15:30:00.000Z',
        },
        {
          id: '7',
          name: 'Alex Chen',
          email: 'alex.chen@example.com',
          phone: '+1234567896',
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          totalPoints: 1800,
          bottlesRecycled: 36,
          badgesEarned: 2,
          nftTokens: 1,
          progressToNextBadge: 0.6,
          progressToNFT: 0.4,
          lastActivity: '2024-01-15T16:15:00.000Z',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-15T11:30:00.000Z',
          lastLogin: '2024-01-15T16:15:00.000Z',
        },
        {
          id: '8',
          name: 'Maria Garcia',
          email: 'maria.garcia@example.com',
          phone: '+1234567897',
          profileImage: undefined,
          totalPoints: 300,
          bottlesRecycled: 6,
          badgesEarned: 0,
          nftTokens: 0,
          progressToNextBadge: 0.1,
          progressToNFT: 0.05,
          lastActivity: '2024-01-15T17:00:00.000Z',
          status: 'active',
          role: 'user',
          createdAt: '2024-01-15T14:00:00.000Z',
          lastLogin: '2024-01-15T17:00:00.000Z',
        },
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
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
  
  // For filtered results
  const filteredTotalUsers = filteredUsers.length;
  const filteredActiveUsers = filteredUsers.filter(user => user.status === 'active').length;

  return (
    <Box sx={{ mt: 8 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitor and manage all registered users in the recycling rewards system
        </Typography>
      </Box>

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

      {/* Onboarding Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Users Today
              </Typography>
              <Typography variant="h4" color="success.main">
                {filteredUsers.filter(user => {
                  const today = new Date();
                  const userCreated = new Date(user.createdAt);
                  return userCreated.toDateString() === today.toDateString();
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                New Users This Week
              </Typography>
              <Typography variant="h4" color="info.main">
                {filteredUsers.filter(user => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  const userCreated = new Date(user.createdAt);
                  return userCreated >= weekAgo;
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Users with Profile Images
              </Typography>
              <Typography variant="h4" color="warning.main">
                {filteredUsers.filter(user => user.profileImage).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Points per User
              </Typography>
              <Typography variant="h4" color="primary.main">
                {filteredUsers.length > 0 
                  ? Math.round(filteredUsers.reduce((sum, user) => sum + user.totalPoints, 0) / filteredUsers.length)
                  : 0
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recently Onboarded Users */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recently Onboarded Users
          </Typography>
          <Grid container spacing={2}>
            {filteredUsers
              .filter(user => user.role === 'user')
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 4)
              .map((user) => (
                <Grid item xs={12} sm={6} md={3} key={user.id}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        elevation: 3,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Avatar
                      src={user.profileImage || undefined}
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: 'primary.main',
                        border: '2px solid',
                        borderColor: 'primary.light',
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="subtitle1" gutterBottom>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      {user.email}
                    </Typography>
                    {user.phone && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        📱 {user.phone}
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary" display="block">
                      📅 Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      🏆 {user.badgesEarned} badges • {user.totalPoints} points
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                      <Chip
                        label={user.role}
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6">
                User Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search users..."
                  variant="outlined"
                  sx={{ minWidth: 200 }}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const term = e.target.value;
                    setSearchTerm(term);
                    
                    if (term.trim() === '') {
                      setFilteredUsers(users);
                    } else {
                      const filtered = users.filter(user => 
                        user.name.toLowerCase().includes(term.toLowerCase()) ||
                        user.email.toLowerCase().includes(term.toLowerCase()) ||
                        (user.phone && user.phone.includes(term))
                      );
                      setFilteredUsers(filtered);
                    }
                  }}
                />
                {searchTerm && (
                  <Button
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      setFilteredUsers(users);
                    }}
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Export users functionality
                    console.log('Export users clicked');
                  }}
                >
                  Export
                </Button>
              </Box>
            </Box>

          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Bottles</TableCell>
                  <TableCell>Badges</TableCell>
                  <TableCell>NFTs</TableCell>
                  <TableCell>Badge Progress</TableCell>
                  <TableCell>NFT Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={user.profileImage || undefined}
                          sx={{ mr: 2 }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {user.phone && (
                          <Typography variant="caption" display="block">
                            📱 {user.phone}
                          </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary">
                          Role: {user.role}
                        </Typography>
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
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
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
