#!/bin/bash

echo "🔧 Fixing Expo iOS Timeout Issues..."

# Check if we're in the mobile-app directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the mobile-app directory"
    exit 1
fi

echo "📦 Clearing cache and updating dependencies..."

# Clear npm cache
npm cache clean --force

# Clear Expo cache
npx expo r -c

# Remove node_modules and reinstall
echo "🔄 Reinstalling dependencies..."
rm -rf node_modules
rm -rf package-lock.json
npm install

# Update Expo CLI
echo "⬆️ Updating Expo CLI..."
npm install -g @expo/cli@latest

# Check for issues
echo "🔍 Running Expo doctor..."
npx expo doctor

echo "✅ Fixes applied!"
echo ""
echo "🎯 Try these commands:"
echo "1. expo start --tunnel"
echo "2. expo start --lan"
echo "3. expo start --localhost"
echo ""
echo "📱 Make sure to:"
echo "- Update Expo Go app on your iPhone"
echo "- Connect to the same WiFi network"
echo "- Try using mobile hotspot if WiFi fails"






