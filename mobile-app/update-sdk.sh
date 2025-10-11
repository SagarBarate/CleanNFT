#!/bin/bash

echo "🔄 Updating Expo SDK..."

# Check if we're in the mobile-app directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the mobile-app directory"
    exit 1
fi

echo "📦 Updating Expo SDK to latest version..."

# Update Expo SDK
npx expo install --fix

# Update Expo CLI to latest
npm install -g @expo/cli@latest

# Clear cache
npx expo r -c

echo "✅ SDK update complete!"
echo ""
echo "🎯 Now you can run:"
echo "1. expo start --tunnel"
echo "2. expo start --lan"
echo "3. expo start --localhost"
echo ""
echo "📱 Make sure to:"
echo "- Update Expo Go app on your iPhone"
echo "- Connect to the same WiFi network"






