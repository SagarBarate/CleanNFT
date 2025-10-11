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
  Chip,
  Avatar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BadgeScreenProps {
  navigation: any;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsRequired: number;
  isEarned: boolean;
  isClaimed: boolean;
  progress: number;
}

const BadgeScreen: React.FC<BadgeScreenProps> = ({ navigation }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

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
          description: 'Recycle your first 10 bottles',
          icon: '🌱',
          pointsRequired: 500,
          isEarned: true,
          isClaimed: true,
          progress: 1.0,
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
    Alert.alert(
      'Claim Badge',
      `Are you sure you want to claim the "${badge.name}" badge?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Claim',
          onPress: () => {
            // Update badge status
            setBadges(prev => 
              prev.map(b => 
                b.id === badge.id 
                  ? { ...b, isClaimed: true }
                  : b
              )
            );
            Alert.alert('Success', `"${badge.name}" badge claimed successfully!`);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading badges...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>Environmental Badges</Title>
          <Paragraph style={styles.subtitle}>
            Earn badges by recycling bottles and contributing to a sustainable future
          </Paragraph>
        </Card.Content>
      </Card>

      {badges.map((badge) => (
        <Card key={badge.id} style={styles.badgeCard}>
          <Card.Content>
            <View style={styles.badgeHeader}>
              <Avatar.Text 
                size={50} 
                label={badge.icon}
                style={[
                  styles.badgeIcon,
                  badge.isEarned ? styles.earnedIcon : styles.lockedIcon
                ]}
              />
              <View style={styles.badgeInfo}>
                <Title style={styles.badgeTitle}>{badge.name}</Title>
                <Paragraph style={styles.badgeDescription}>
                  {badge.description}
                </Paragraph>
                <Text style={styles.pointsText}>
                  {badge.pointsRequired} points required
                </Text>
              </View>
            </View>

            <View style={styles.badgeStatus}>
              {badge.isEarned ? (
                <Chip 
                  icon={badge.isClaimed ? "check-circle" : "star"}
                  style={[
                    styles.statusChip,
                    badge.isClaimed ? styles.claimedChip : styles.earnedChip
                  ]}
                >
                  {badge.isClaimed ? 'Claimed' : 'Earned'}
                </Chip>
              ) : (
                <Chip 
                  icon="lock"
                  style={[styles.statusChip, styles.lockedChip]}
                >
                  {Math.round(badge.progress * 100)}% Complete
                </Chip>
              )}
            </View>

            {badge.isEarned && !badge.isClaimed && (
              <Button
                mode="contained"
                onPress={() => handleClaimBadge(badge)}
                style={styles.claimButton}
                icon="gift"
              >
                Claim Badge
              </Button>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    color: '#4CAF50',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  badgeCard: {
    marginBottom: 16,
    elevation: 4,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeIcon: {
    marginRight: 16,
  },
  earnedIcon: {
    backgroundColor: '#4CAF50',
  },
  lockedIcon: {
    backgroundColor: '#ccc',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 12,
    color: '#999',
  },
  badgeStatus: {
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  earnedChip: {
    backgroundColor: '#4CAF50',
  },
  claimedChip: {
    backgroundColor: '#2196F3',
  },
  lockedChip: {
    backgroundColor: '#ccc',
  },
  claimButton: {
    backgroundColor: '#FF9800',
  },
});

export default BadgeScreen;
