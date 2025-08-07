import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface DashboardScreenProps {
  navigation: any;
}

interface UserStats {
  totalPoints: number;
  bottlesRecycled: number;
  badgesEarned: number;
  nftTokens: number;
  progressToNextBadge: number;
  progressToNFT: number;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    bottlesRecycled: 0,
    badgesEarned: 0,
    nftTokens: 0,
    progressToNextBadge: 0,
    progressToNFT: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const binId = await AsyncStorage.getItem('binId');
      if (!binId) {
        Alert.alert('Error', 'Please login first');
        navigation.navigate('Login');
        return;
      }

      // In a real app, this would be an API call to your backend
      // For now, we'll simulate the data
      const mockStats: UserStats = {
        totalPoints: 1250,
        bottlesRecycled: 25,
        badgesEarned: 2,
        nftTokens: 1,
        progressToNextBadge: 0.75, // 75% to next badge
        progressToNFT: 0.6, // 60% to next NFT
      };

      setUserStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user stats:', error);
      setLoading(false);
    }
  };

  const handleDumpBottles = () => {
    Alert.alert(
      'Dump Bottles',
      'Place your bottles in the bin and press confirm',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Simulate bottle dumping
            setUserStats(prev => ({
              ...prev,
              bottlesRecycled: prev.bottlesRecycled + 1,
              totalPoints: prev.totalPoints + 50,
            }));
            Alert.alert('Success', 'Bottles dumped successfully! +50 points');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Your Recycling Stats</Title>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.bottlesRecycled}</Text>
              <Text style={styles.statLabel}>Bottles Recycled</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.badgesEarned}</Text>
              <Text style={styles.statLabel}>Badges Earned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.nftTokens}</Text>
              <Text style={styles.statLabel}>NFT Tokens</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Progress to Next Badge</Title>
          <ProgressBar 
            progress={userStats.progressToNextBadge} 
            color="#4CAF50" 
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round(userStats.progressToNextBadge * 100)}% Complete
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Badge')}
            style={styles.button}
            disabled={userStats.progressToNextBadge < 1}
          >
            View Badges
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Progress to NFT Token</Title>
          <ProgressBar 
            progress={userStats.progressToNFT} 
            color="#FF9800" 
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round(userStats.progressToNFT * 100)}% Complete
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NFTClaim')}
            style={styles.button}
            disabled={userStats.progressToNFT < 1}
          >
            Claim NFT
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Quick Actions</Title>
          <Button
            mode="contained"
            onPress={handleDumpBottles}
            style={styles.button}
            icon="recycle"
          >
            Dump Bottles
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('QRScanner')}
            style={styles.button}
            icon="qrcode-scan"
          >
            Scan New Bin
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    color: '#4CAF50',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
  },
});

export default DashboardScreen;
