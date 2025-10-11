#!/bin/bash

# Start Mobile App with EMFILE fix
# This script handles the "too many open files" error on macOS

echo "Starting CleanNFT Mobile App with EMFILE fix..."

# Kill any existing Expo processes
echo "Stopping existing Expo processes..."
pkill -f "expo start" 2>/dev/null || true
sleep 2

# Apply file limit fixes
echo "Applying file limit fixes..."
sudo sysctl -w kern.maxfiles=65536 2>/dev/null || true
sudo sysctl -w kern.maxfilesperproc=32768 2>/dev/null || true
ulimit -n 65536

# Change to mobile app directory
cd mobile-app

# Clear Metro cache
echo "Clearing Metro cache..."
npx expo start --clear 2>/dev/null || true

# Try different start methods
echo "Attempting to start Expo..."

# Method 1: Try with tunnel mode (uses fewer file watchers)
echo "Trying tunnel mode..."
timeout 30s npx expo start --tunnel --no-dev 2>/dev/null && exit 0

# Method 2: Try with LAN mode
echo "Trying LAN mode..."
timeout 30s npx expo start --lan --no-dev 2>/dev/null && exit 0

# Method 3: Try with localhost only
echo "Trying localhost mode..."
timeout 30s npx expo start --localhost --no-dev 2>/dev/null && exit 0

# Method 4: Try with minimal watching
echo "Trying minimal file watching..."
EXPO_NO_DOTENV=1 EXPO_NO_METRO_LAZY=1 timeout 30s npx expo start --no-dev --minify 2>/dev/null && exit 0

echo "All methods failed. Please check the error messages above."
echo "You may need to restart your terminal or increase file limits further."




