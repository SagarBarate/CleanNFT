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
  ProgressBar,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';

interface NFTClaimScreenProps {
  navigation: any;
}

interface NFTToken {
  id: string;
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
  isEligible: boolean;
  isClaimed: boolean;
  progress: number;
  tokenId?: number;
}

const NFTClaimScreen: React.FC<NFTClaimScreenProps> = ({ navigation }) => {
  const [nftTokens, setNftTokens] = useState<NFTToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    loadNFTTokens();
  }, []);

  const loadNFTTokens = async () => {
    try {
      // Mock NFT data - in a real app, this would come from your backend
      const mockNFTs: NFTToken[] = [
        {
          id: '1',
          name: 'Recycling Pioneer',
          description: 'First NFT for recycling 100 bottles',
          image: '🌱',
          pointsRequired: 2000,
          isEligible: true,
          isClaimed: true,
          progress: 1.0,
          tokenId: 1,
        },
        {
          id: '2',
          name: 'Green Innovator',
          description: 'NFT for recycling 500 bottles',
          image: '🌿',
          pointsRequired: 5000,
          isEligible: false,
          isClaimed: false,
          progress: 0.6,
        },
        {
          id: '3',
          name: 'Sustainability Leader',
          description: 'NFT for recycling 1000 bottles',
          image: '🌳',
          pointsRequired: 10000,
          isEligible: false,
          isClaimed: false,
          progress: 0.3,
        },
        {
          id: '4',
          name: 'Planet Guardian',
          description: 'NFT for recycling 2000 bottles',
          image: '🌍',
          pointsRequired: 20000,
          isEligible: false,
          isClaimed: false,
          progress: 0.15,
        },
      ];

      setNftTokens(mockNFTs);
      setLoading(false);
    } catch (error) {
      console.error('Error loading NFT tokens:', error);
      setLoading(false);
    }
  };

  const handleClaimNFT = async (nft: NFTToken) => {
    Alert.alert(
      'Claim NFT',
      `Are you sure you want to claim the "${nft.name}" NFT? This will mint a new token on the blockchain.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Claim',
          onPress: async () => {
            setClaiming(true);
            try {
              // In a real app, this would interact with your smart contract
              // For now, we'll simulate the minting process
              await simulateNFTMinting(nft);
              
              // Update NFT status
              setNftTokens(prev => 
                prev.map(n => 
                  n.id === nft.id 
                    ? { ...n, isClaimed: true, tokenId: Math.floor(Math.random() * 1000) + 1 }
                    : n
                )
              );
              
              Alert.alert(
                'Success!', 
                `"${nft.name}" NFT has been minted successfully! Token ID: ${Math.floor(Math.random() * 1000) + 1}`
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to mint NFT. Please try again.');
            } finally {
              setClaiming(false);
            }
          },
        },
      ]
    );
  };

  const simulateNFTMinting = async (nft: NFTToken): Promise<void> => {
    // Simulate blockchain interaction delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading NFT tokens...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>NFT Tokens</Title>
          <Paragraph style={styles.subtitle}>
            Claim unique NFT tokens based on your recycling achievements
          </Paragraph>
        </Card.Content>
      </Card>

      {nftTokens.map((nft) => (
        <Card key={nft.id} style={styles.nftCard}>
          <Card.Content>
            <View style={styles.nftHeader}>
              <Avatar.Text 
                size={60} 
                label={nft.image}
                style={[
                  styles.nftIcon,
                  nft.isClaimed ? styles.claimedIcon : 
                  nft.isEligible ? styles.eligibleIcon : styles.lockedIcon
                ]}
              />
              <View style={styles.nftInfo}>
                <Title style={styles.nftTitle}>{nft.name}</Title>
                <Paragraph style={styles.nftDescription}>
                  {nft.description}
                </Paragraph>
                <Text style={styles.pointsText}>
                  {nft.pointsRequired} points required
                </Text>
                {nft.tokenId && (
                  <Text style={styles.tokenIdText}>
                    Token ID: {nft.tokenId}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.nftStatus}>
              {nft.isClaimed ? (
                <Chip 
                  icon="check-circle"
                  style={[styles.statusChip, styles.claimedChip]}
                >
                  Claimed
                </Chip>
              ) : nft.isEligible ? (
                <Chip 
                  icon="star"
                  style={[styles.statusChip, styles.eligibleChip]}
                >
                  Eligible
                </Chip>
              ) : (
                <Chip 
                  icon="lock"
                  style={[styles.statusChip, styles.lockedChip]}
                >
                  {Math.round(nft.progress * 100)}% Complete
                </Chip>
              )}
            </View>

            {!nft.isClaimed && nft.isEligible && (
              <Button
                mode="contained"
                onPress={() => handleClaimNFT(nft)}
                style={styles.claimButton}
                icon="gift"
                loading={claiming}
                disabled={claiming}
              >
                {claiming ? 'Minting...' : 'Claim NFT'}
              </Button>
            )}

            {!nft.isEligible && (
              <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                  Progress to eligibility: {Math.round(nft.progress * 100)}%
                </Text>
                <ProgressBar 
                  progress={nft.progress} 
                  color="#FF9800" 
                  style={styles.progressBar}
                />
              </View>
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
  nftCard: {
    marginBottom: 16,
    elevation: 4,
  },
  nftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nftIcon: {
    marginRight: 16,
  },
  claimedIcon: {
    backgroundColor: '#2196F3',
  },
  eligibleIcon: {
    backgroundColor: '#4CAF50',
  },
  lockedIcon: {
    backgroundColor: '#ccc',
  },
  nftInfo: {
    flex: 1,
  },
  nftTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  nftDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 12,
    color: '#999',
  },
  tokenIdText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
    marginTop: 4,
  },
  nftStatus: {
    marginBottom: 12,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  eligibleChip: {
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
  progressSection: {
    marginTop: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

export default NFTClaimScreen;
