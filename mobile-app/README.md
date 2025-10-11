# Recycling Mobile App

A React Native mobile application that allows users to scan QR codes on recycling bins, track their recycling progress, earn badges, and claim NFT tokens.

## 📱 Features

### Core Features
- **QR Code Scanning**: Scan QR codes on digital bins to authenticate
- **Recycling Dashboard**: View statistics and progress
- **Bottle Dumping**: Record bottle recycling and earn points
- **Badge System**: View and claim environmental badges
- **NFT Tokens**: Claim NFT tokens based on recycling achievements
- **Progress Tracking**: Monitor progress towards next rewards

### Screens
1. **Login Screen**: QR code scanner for bin authentication
2. **Dashboard**: Overview of user stats and quick actions
3. **Badge Screen**: View available badges and claim them
4. **NFT Claim Screen**: Claim NFT tokens when eligible
5. **QR Scanner**: Scan new bins or reconnect

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Install dependencies**
```bash
cd mobile-app
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your API endpoints
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device/simulator**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 App Structure

```
src/
├── screens/
│   ├── LoginScreen.tsx      # QR code scanner
│   ├── DashboardScreen.tsx  # Main dashboard
│   ├── BadgeScreen.tsx      # Badge management
│   ├── NFTClaimScreen.tsx   # NFT claiming
│   └── QRScannerScreen.tsx  # QR scanner
├── components/              # Reusable components
├── services/               # API services
├── utils/                  # Utility functions
└── types/                  # TypeScript types
```

## 🎨 UI Components

### Design System
- **React Native Paper**: Material Design components
- **Custom Theme**: Green color scheme for environmental theme
- **Progress Indicators**: Visual progress bars
- **Badge Icons**: Emoji-based badge system
- **QR Code Integration**: Seamless scanning experience

### Key Components
- **QR Scanner**: Camera-based QR code scanning
- **Progress Cards**: Visual progress tracking
- **Badge Cards**: Badge display and claiming
- **NFT Cards**: NFT token management
- **Statistics Cards**: User statistics display

## 🔧 Configuration

### Environment Variables
```env
API_BASE_URL=http://localhost:3001/api
CONTRACT_ADDRESS=0x...
NETWORK_ID=1
```

### API Integration
The app connects to the backend API for:
- User authentication
- Bin information
- Recycling recording
- Badge and NFT management
- Progress tracking

## 📊 Data Flow

1. **User scans QR code** → Bin authentication
2. **User dumps bottles** → Points calculation
3. **System checks eligibility** → Badge/NFT qualification
4. **User claims rewards** → Blockchain interaction
5. **Progress updates** → Real-time dashboard

## 🎯 Key Features

### QR Code Scanning
- Camera permission handling
- Real-time QR code detection
- Bin data parsing and validation
- Error handling for invalid codes

### Dashboard
- Real-time statistics display
- Progress bars for goals
- Quick action buttons
- Recent activity tracking

### Badge System
- Visual badge display
- Progress towards next badge
- Claim functionality
- Achievement notifications

### NFT Management
- NFT eligibility checking
- Claiming interface
- Blockchain integration
- Token metadata display

## 🔐 Security

- **Input Validation**: Client-side validation
- **Secure Storage**: AsyncStorage for sensitive data
- **API Security**: HTTPS communication
- **QR Code Validation**: Server-side verification

## 📱 Platform Support

- **iOS**: iPhone and iPad
- **Android**: All Android devices
- **Web**: Progressive Web App support

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📦 Build & Deploy

### Development
```bash
npm start
```

### Production Build
```bash
# iOS
expo build:ios

# Android
expo build:android
```

### App Store Deployment
```bash
# Configure app.json
# Build and submit to stores
expo publish
```

## 🔄 State Management

- **AsyncStorage**: Local data persistence
- **React Context**: Global state management
- **API State**: Server state synchronization
- **Offline Support**: Local caching

## 📈 Performance

- **Lazy Loading**: Screen-based code splitting
- **Image Optimization**: Compressed assets
- **Memory Management**: Proper cleanup
- **Network Optimization**: Efficient API calls

## 🐛 Troubleshooting

### Common Issues
1. **QR Scanner not working**: Check camera permissions
2. **API connection failed**: Verify network and API URL
3. **Build errors**: Clear cache and reinstall dependencies

### Debug Commands
```bash
# Clear cache
expo r -c

# Reset Metro bundler
npm start -- --reset-cache

# Check Expo CLI
expo doctor
```

## 📚 Dependencies

### Core Dependencies
- `expo`: React Native framework
- `react-native-paper`: UI components
- `expo-barcode-scanner`: QR code scanning
- `axios`: HTTP client
- `ethers`: Blockchain interaction
- `@react-navigation`: Navigation

### Development Dependencies
- `typescript`: Type checking
- `@types/react`: Type definitions
- `expo-cli`: Development tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
