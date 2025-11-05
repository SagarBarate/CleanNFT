# 👥 Users Portal - CleanNFT

A Progressive Web App (PWA) for users to manage recycling activities, earn points, badges, and NFT rewards.

## 🚀 Features

### Core Functionality
- **QR Code Scanning**: Connect to recycling bins via QR codes
- **User Dashboard**: Track recycling progress and statistics
- **Badge System**: Earn environmental achievement badges
- **NFT Rewards**: Claim blockchain-based tokens for milestones
- **CleanNFT (Beta)**: Claim and manage recycling achievement NFTs on Polygon Mumbai
- **Points System**: Gamified recycling with point accumulation

### PWA Features
- **Offline Support**: Works without internet connection
- **Push Notifications**: Get notified about achievements
- **Installable**: Add to home screen like a native app
- **Responsive Design**: Optimized for all device sizes
- **Background Sync**: Queue actions when offline

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Build Tool**: Vite
- **PWA**: Service Worker + Web App Manifest
- **QR Scanning**: HTML5-QRCode
- **Blockchain**: Ethers.js for NFT integration

## 📱 PWA Capabilities

### Service Worker
- Caches app shell and static assets
- Handles offline functionality
- Manages background sync
- Processes push notifications

## 🔧 Troubleshooting

### Common Issues

#### "process is not defined" Error
- **Cause**: Using Node.js environment variables in browser
- **Solution**: Use `VITE_` prefix instead of `REACT_APP_` for environment variables
- **Example**: `VITE_CONTRACT_ADDRESS` instead of `REACT_APP_CONTRACT_ADDRESS`

#### White Screen on Load
- **Cause**: JavaScript errors preventing app initialization
- **Solution**: Check browser console for errors and ensure environment variables are properly set

#### Contract Connection Issues
- **Cause**: Invalid or missing contract address
- **Solution**: Verify your contract address in the `.env` file and ensure it's deployed on the correct network

#### MetaMask Connection Problems
- **Cause**: Wrong network or MetaMask not installed
- **Solution**: Ensure MetaMask is installed and connected to Polygon Amoy or Mumbai testnet

### Web App Manifest
- App icons in multiple sizes
- Splash screen configuration
- Theme colors and display modes
- Installation prompts

### Offline Features
- Cached API responses
- Local data storage
- Background synchronization
- Offline-first architecture

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recycling-pwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```bash
   # Blockchain Configuration
   VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here
   
   # IPFS/Pinata Configuration (optional)
   VITE_PINATA_API_KEY=your_pinata_api_key_here
   VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here
   ```
   
   **Important Notes:**
   - Use `VITE_` prefix for all environment variables (not `REACT_APP_`)
   - If you don't have a deployed contract, the app will use a placeholder address
   - The app will work for basic functionality even without a valid contract address

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
recycling-pwa/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                 # Service worker
│   └── icons/                # App icons
├── src/
│   ├── components/           # Reusable components
│   │   └── Layout.tsx       # Main layout with navigation
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts       # Authentication logic
│   ├── screens/             # Main application screens
│   │   ├── LoginScreen.tsx  # QR login screen
│   │   ├── DashboardScreen.tsx # User dashboard
│   │   ├── QRScannerScreen.tsx # QR scanning
│   │   ├── BadgeScreen.tsx  # Badge management
│   │   └── NFTClaimScreen.tsx # NFT claiming
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BLOCKCHAIN_NETWORK=ethereum
VITE_CONTRACT_ADDRESS=0x...
```

### PWA Configuration
- **Manifest**: Edit `public/manifest.json` for app metadata
- **Service Worker**: Modify `public/sw.js` for caching strategies
- **Icons**: Replace icons in `public/icons/` directory

## 📱 PWA Installation

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Follow the installation prompts

### Mobile
1. Open the app in Chrome/Safari
2. Tap the share button
3. Select "Add to Home Screen"

## 🎯 Key Components

### Authentication System
- QR code-based bin connection
- Local storage for session management
- User statistics tracking

### Dashboard
- Real-time recycling statistics
- Progress tracking for badges/NFTs
- Quick action buttons

### QR Scanner
- Camera-based QR code scanning
- Bin connection management
- Error handling and validation

### Badge System
- Achievement-based badge unlocking
- Progress visualization
- Rarity classification system

### CleanNFT (Beta)
- **Wallet Connection**: Connect MetaMask to Polygon Mumbai testnet
- **Claimable NFTs**: View and claim available recycling achievement NFTs
- **Owned NFTs**: Display your claimed NFTs with metadata and images
- **IPFS Integration**: View NFT images and metadata via IPFS gateway
- **Transaction Tracking**: Link to Polygonscan for claim transactions

#### CleanNFT Environment Variables
Add these to your `.env` file for CleanNFT functionality:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Blockchain Configuration  
VITE_CONTRACT_ADDRESS=0x9732e6BB31742f9FA4fd650cE20aD595983B3651
VITE_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY

# IPFS Configuration
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

#### CleanNFT Usage
1. Navigate to `/nft` route in the PWA
2. Connect your MetaMask wallet (ensure you're on Mumbai testnet)
3. View available NFTs in the "Claimable NFTs" tab
4. Click "Claim" to transfer ownership to your wallet
5. Switch to "My NFTs" tab to view your claimed NFTs
6. Click on images/metadata to view via IPFS gateway
7. Use transaction hash links to verify on Polygonscan

#### Testing CleanNFT
```bash
# Run the test suite
npm test

# Manual testing steps:
# 1. Start backend API (port 3001)
# 2. Start PWA (npm run dev)
# 3. Navigate to /nft
# 4. Connect wallet on Mumbai testnet
# 5. Test claiming and viewing NFTs
```

### NFT Management
- Blockchain integration ready
- Token minting simulation
- Collection management

## 🔒 Security Features

- Input validation and sanitization
- Secure authentication flow
- Protected API endpoints
- CORS configuration

## 📊 Performance Optimizations

- **Code Splitting**: Lazy-loaded routes and components
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Image Optimization**: WebP format and lazy loading
- **Caching Strategies**: Service worker with multiple cache layers

## 🧪 Testing

### Manual Testing
- Test QR code scanning with sample codes
- Verify offline functionality
- Check responsive design on various devices
- Test PWA installation process

### Sample QR Codes
For testing, use these sample QR codes:

```json
{"binId": "test-bin-001", "location": "Test Location"}
{"binId": "demo-bin-002", "location": "Demo Area"}
```

## 🚀 Deployment

### Build Process
1. Run `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Ensure HTTPS is enabled (required for PWA features)

### Hosting Recommendations
- **Vercel**: Excellent PWA support
- **Netlify**: Great PWA features
- **Firebase Hosting**: Google's PWA optimization

### PWA Validation
Use Chrome DevTools to validate PWA features:
- Application tab → Manifest
- Application tab → Service Workers
- Lighthouse audit for PWA score

## 🔄 Migration from React Native

This PWA successfully migrates the following React Native features:

| React Native | PWA Equivalent | Status |
|--------------|----------------|---------|
| React Navigation | React Router | ✅ Complete |
| React Native Paper | Material-UI | ✅ Complete |
| Expo Barcode Scanner | HTML5-QRCode | ✅ Complete |
| AsyncStorage | localStorage/IndexedDB | ✅ Complete |
| React Native Vector Icons | Material Icons | ✅ Complete |
| React Native SVG | Web-compatible | ✅ Complete |

## 🎨 Customization

### Theme Customization
Edit the theme in `src/main.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#4CAF50' },
    secondary: { main: '#FF9800' },
    // ... more colors
  },
  // ... more theme options
});
```

### Component Styling
Use Material-UI's `sx` prop for custom styling:

```typescript
<Card sx={{ 
  borderRadius: 3, 
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
}}>
```

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Social features and leaderboards
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced offline capabilities
- [ ] Push notification system
- [ ] Background sync improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- Vite team for the fast build tool
- PWA community for best practices and guidance

---

**Built with ❤️ for a sustainable future**
