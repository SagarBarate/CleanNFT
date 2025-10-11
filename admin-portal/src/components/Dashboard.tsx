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
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardStats {
  totalBins: number;
  activeUsers: number;
  totalBottlesRecycled: number;
  totalPointsEarned: number;
  nftTokensMinted: number;
  badgesEarned: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  binId: string;
  timestamp: string;
  points: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBins: 0,
    activeUsers: 0,
    totalBottlesRecycled: 0,
    totalPointsEarned: 0,
    nftTokensMinted: 0,
    badgesEarned: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - in a real app, this would come from your backend
      const mockStats: DashboardStats = {
        totalBins: 25,
        activeUsers: 150,
        totalBottlesRecycled: 2500,
        totalPointsEarned: 125000,
        nftTokensMinted: 45,
        badgesEarned: 320,
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          user: 'John Doe',
          action: 'Recycled bottles',
          binId: 'BIN-001',
          timestamp: '2024-01-15 14:30',
          points: 50,
        },
        {
          id: '2',
          user: 'Jane Smith',
          action: 'Claimed NFT',
          binId: 'BIN-003',
          timestamp: '2024-01-15 14:25',
          points: 0,
        },
        {
          id: '3',
          user: 'Mike Johnson',
          action: 'Earned badge',
          binId: 'BIN-002',
          timestamp: '2024-01-15 14:20',
          points: 100,
        },
        {
          id: '4',
          user: 'Sarah Wilson',
          action: 'Recycled bottles',
          binId: 'BIN-001',
          timestamp: '2024-01-15 14:15',
          points: 75,
        },
        {
          id: '5',
          user: 'Tom Brown',
          action: 'Claimed NFT',
          binId: 'BIN-004',
          timestamp: '2024-01-15 14:10',
          points: 0,
        },
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Bottles Recycled', value: stats.totalBottlesRecycled },
    { name: 'Points Earned', value: stats.totalPointsEarned / 100 },
    { name: 'NFTs Minted', value: stats.nftTokensMinted },
    { name: 'Badges Earned', value: stats.badgesEarned },
  ];

  const COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0'];

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bins
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.totalBins}
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
                {stats.activeUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Bottles Recycled
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.totalBottlesRecycled.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Points
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.totalPointsEarned.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activity Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Bin ID</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.binId}</TableCell>
                    <TableCell>{activity.timestamp}</TableCell>
                    <TableCell>{activity.points}</TableCell>
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

export default Dashboard;
