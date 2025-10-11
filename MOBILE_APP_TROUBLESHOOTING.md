# Mobile App EMFILE Error Troubleshooting Guide

## Problem
Getting "EMFILE: too many open files" error when starting the mobile app with Expo.

## Solutions Applied

### 1. System File Limits
```bash
# Apply file limit fixes
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=32768
ulimit -n 65536
```

### 2. Metro Configuration
Created `metro.config.js` with aggressive file watching reduction:
- Limited source extensions to essential types only
- Disabled file watching for large directories
- Reduced workers to 1
- Added ignore patterns for node_modules, .git, etc.

### 3. Package.json Scripts
Added safe startup scripts:
- `npm start` - Uses optimized settings
- `npm run start-dev` - Original development mode
- `npm run start-safe` - Most conservative settings

### 4. Watchman Configuration
Created `.watchmanconfig` to ignore unnecessary directories.

## Alternative Startup Methods

### Method 1: Safe Mode (Recommended)
```bash
cd mobile-app
npm run start-safe
```

### Method 2: Tunnel Mode
```bash
cd mobile-app
npx expo start --tunnel
```

### Method 3: Offline Mode
```bash
cd mobile-app
npx expo start --offline --no-dev
```

### Method 4: LAN Mode
```bash
cd mobile-app
npx expo start --lan --no-dev
```

## Permanent Fix (Optional)

Add to `/etc/sysctl.conf`:
```
kern.maxfiles=65536
kern.maxfilesperproc=32768
```

## If All Else Fails

1. **Restart your terminal** completely
2. **Restart your computer** to reset all file descriptors
3. **Use Expo Go app** directly with the QR code instead of development server
4. **Build for production** instead of development mode

## Environment Variables Used

- `EXPO_NO_DOTENV=1` - Disables .env file watching
- `EXPO_NO_METRO_LAZY=1` - Disables lazy loading
- `METRO_MAX_WORKERS=1` - Limits Metro workers

## Files Modified

- `metro.config.js` - Metro bundler configuration
- `package.json` - Added safe startup scripts
- `.watchmanconfig` - Watchman ignore patterns
- `fix-file-limits.sh` - System limit fix script
- `start-mobile-app.sh` - Comprehensive startup script




