# Recycling Admin Portal

A React-based admin portal for managing the recycling NFT system. Administrators can manage bins, track users, monitor NFT tokens, and generate QR codes.

## 🖥️ Features

### Management Features
- **Dashboard**: Overview statistics and recent activity
- **Bin Management**: Add, edit, and manage recycling bins with QR codes
- **User Management**: Track user progress towards badges and NFTs
- **NFT Management**: Manage NFT tokens and minting

### Key Components
- **Real-time Statistics**: Charts and graphs showing system activity
- **QR Code Generation**: Generate QR codes for new bins
- **User Progress Tracking**: Monitor user progress towards rewards
- **NFT Token Management**: Add new NFT types and track minting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running

### Installation

1. **Install dependencies**
```bash
cd admin-portal
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

4. **Build for production**
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx           # Main dashboard
│   ├── BinManagement.tsx       # Bin management
│   ├── UserManagement.tsx      # User tracking
│   ├── NFTManagement.tsx       # NFT management
│   └── Sidebar.tsx            # Navigation sidebar
├── services/                   # API services
├── utils/                      # Utility functions
├── types/                      # TypeScript types
└── App.tsx                     # Main app component
```

## 🎨 UI Components

### Design System
- **Material-UI**: Professional component library
- **Custom Theme**: Green color scheme for environmental theme
- **Responsive Design**: Works on desktop and tablet
- **Charts**: Recharts for data visualization
- **QR Code Integration**: React QR code generation

### Key Components
- **Dashboard Cards**: Statistics overview
- **Data Tables**: User and bin management
- **Charts**: Activity visualization
- **QR Code Generator**: Dynamic QR code creation
- **Form Dialogs**: Add/edit functionality

## 📊 Dashboard Features

### Statistics Overview
- Total bins and active bins
- Total bottles recycled
- Total points earned
- User activity metrics
- NFT minting statistics

### Charts and Graphs
- **Bar Charts**: Activity overview
- **Pie Charts**: Distribution analysis
- **Progress Indicators**: User progress tracking
- **Real-time Updates**: Live data monitoring

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_NETWORK_ID=1
```

### API Integration
The portal connects to the backend API for:
- Bin management operations
- User statistics and progress
- NFT token management
- QR code generation
- Real-time data updates

## 📈 Data Management

### Bin Management
- **Create Bins**: Add new recycling bins
- **Edit Bins**: Update bin information
- **Delete Bins**: Remove inactive bins
- **QR Codes**: Generate QR codes for bins
- **Statistics**: View bin performance

### User Management
- **User List**: View all users
- **Progress Tracking**: Monitor badge and NFT progress
- **Statistics**: User recycling statistics
- **Activity History**: Recent user activity

### NFT Management
- **NFT List**: View all NFT tokens
- **Add NFTs**: Create new NFT types
- **Minting History**: Track NFT minting
- **Rarity Management**: Manage NFT rarity levels

## 🎯 Key Features

### QR Code Generation
- Dynamic QR code creation
- Bin-specific QR codes
- Downloadable QR images
- QR code validation

### Real-time Monitoring
- Live dashboard updates
- User activity tracking
- Bin performance monitoring
- NFT minting alerts

### Data Visualization
- Interactive charts
- Progress indicators
- Statistics cards
- Activity timelines

## 🔐 Security

- **Authentication**: Admin login system
- **Authorization**: Role-based access control
- **Input Validation**: Form validation
- **API Security**: Secure API communication

## 📱 Responsive Design

- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout
- **Mobile**: Basic functionality
- **Cross-browser**: Modern browser support

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📦 Build & Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to hosting service
# (Netlify, Vercel, AWS, etc.)
```

## 🔄 State Management

- **React Hooks**: Local component state
- **Context API**: Global state management
- **API State**: Server state synchronization
- **Real-time Updates**: WebSocket integration

## 📈 Performance

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed assets
- **Bundle Optimization**: Tree shaking
- **Caching**: API response caching

## 🐛 Troubleshooting

### Common Issues
1. **API connection failed**: Check API URL and network
2. **QR codes not generating**: Verify QR library installation
3. **Charts not rendering**: Check chart library dependencies

### Debug Commands
```bash
# Clear cache
npm run clean

# Reset dependencies
rm -rf node_modules && npm install

# Check for updates
npm outdated
```

## 📚 Dependencies

### Core Dependencies
- `react`: UI framework
- `react-dom`: DOM rendering
- `@mui/material`: UI components
- `@mui/icons-material`: Icons
- `recharts`: Chart library
- `react-qr-code`: QR code generation
- `axios`: HTTP client

### Development Dependencies
- `typescript`: Type checking
- `@types/react`: Type definitions
- `react-scripts`: Development tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
