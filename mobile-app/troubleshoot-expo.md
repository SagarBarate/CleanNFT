# Expo iOS Timeout Troubleshooting Guide

## 🚨 Common Solutions

### 1. Clear Cache and Restart
```bash
# Clear Expo cache
expo r -c

# Reset Metro bundler
npm start -- --reset-cache

# Or use Expo CLI
expo start --clear
```

### 2. Try Different Connection Modes
```bash
# Tunnel mode (works through firewalls)
expo start --tunnel

# LAN mode (same network)
expo start --lan

# Local mode (localhost only)
expo start --localhost
```

### 3. Update Dependencies
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Update Expo Go app on your device
# Go to App Store and update Expo Go
```

### 4. Check Network Settings
- Ensure your phone and computer are on the same WiFi
- Try turning off VPN if you're using one
- Check if your network blocks certain ports

### 5. Alternative Development Methods

#### Option A: Use Expo Development Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Create development build
eas build --profile development --platform ios
```

#### Option B: Use React Native CLI
```bash
# Eject from Expo
expo eject

# Install React Native CLI
npm install -g react-native-cli

# Run on iOS
npx react-native run-ios
```

### 6. Debug Network Issues
```bash
# Check if ports are accessible
npx expo doctor

# Test network connectivity
ping <your-computer-ip>
```

### 7. Environment-Specific Solutions

#### For Corporate Networks:
- Use tunnel mode: `expo start --tunnel`
- Ask IT to whitelist Expo ports (19000, 19001, 19002)

#### For Home Networks:
- Restart your router
- Try using mobile hotspot from your phone
- Disable firewall temporarily for testing

#### For University/Public WiFi:
- Tunnel mode usually works best
- Try using your phone's mobile data as hotspot

## 🔍 Advanced Debugging

### Check Expo Logs
```bash
# Enable verbose logging
EXPO_DEBUG=1 expo start

# Check for specific errors
expo doctor
```

### Network Configuration
```bash
# Check your computer's IP
ipconfig # Windows
ifconfig # Mac/Linux

# Make sure port 19000 is open
netstat -an | grep 19000
```

### iOS Simulator Issues
```bash
# Reset iOS Simulator
xcrun simctl erase all

# Update Xcode if needed
xcode-select --install
```

## 📱 Device-Specific Solutions

### iPhone Issues:
1. **Update Expo Go**: Latest version from App Store
2. **Restart iPhone**: Power cycle the device
3. **Check WiFi**: Forget and reconnect to network
4. **Clear Safari Cache**: Settings > Safari > Clear History

### iPad Issues:
1. **Same as iPhone solutions**
2. **Check iPad-specific network settings**
3. **Try both WiFi and cellular if available**

## 🆘 Still Having Issues?

### Contact Support:
- Expo Discord: https://discord.gg/expo
- Expo GitHub Issues: https://github.com/expo/expo/issues
- Stack Overflow: Tag with `expo` and `react-native`

### Alternative Development Setup:
```bash
# Use Expo Development Build (recommended for production)
npm install -g @expo/eas-cli
eas build --profile development --platform ios

# Or use React Native CLI
npx create-expo-app@latest MyApp --template blank-typescript
cd MyApp
npx expo install --fix
```

## 🎯 Quick Fix Checklist

- [ ] Clear Expo cache: `expo r -c`
- [ ] Try tunnel mode: `expo start --tunnel`
- [ ] Update Expo Go app
- [ ] Check WiFi connection
- [ ] Restart development machine
- [ ] Try different network (mobile hotspot)
- [ ] Update Expo CLI: `npm install -g @expo/cli@latest`
