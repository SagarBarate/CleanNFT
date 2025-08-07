import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface QRScannerScreenProps {
  navigation: any;
}

const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setIsScanning(false);
    
    try {
      // Parse the QR code data
      const qrData = JSON.parse(data);
      
      // Store the new bin information
      await AsyncStorage.setItem('binId', qrData.binId);
      await AsyncStorage.setItem('binLocation', qrData.location);
      
      Alert.alert(
        'Bin Connected',
        `Successfully connected to bin at ${qrData.location}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code format');
      setIsScanning(true);
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsScanning(true);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Camera Permission Required</Title>
            <Paragraph style={styles.paragraph}>
              This app needs camera access to scan QR codes. Please enable camera permissions in your device settings.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => navigation.goBack()}>
              Go Back
            </Button>
          </Card.Actions>
        </Card>
      </View>
    );
  }

  if (isScanning) {
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR code within the frame</Text>
          <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
            Cancel
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Scan Complete</Title>
          <Paragraph style={styles.paragraph}>
            QR code has been scanned successfully.
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={resetScanner} style={styles.button}>
            Scan Again
          </Button>
          <Button mode="outlined" onPress={() => navigation.goBack()}>
            Done
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 10,
  },
  paragraph: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default QRScannerScreen;
