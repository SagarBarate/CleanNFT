@echo off
echo 🔄 Updating Expo SDK...

REM Check if we're in the mobile-app directory
if not exist "package.json" (
    echo ❌ Please run this script from the mobile-app directory
    pause
    exit /b 1
)

echo 📦 Updating Expo SDK to latest version...

REM Update Expo SDK
call npx expo install --fix

REM Update Expo CLI to latest
call npm install -g @expo/cli@latest

REM Clear cache
call npx expo r -c

echo ✅ SDK update complete!
echo.
echo 🎯 Now you can run:
echo 1. expo start --tunnel
echo 2. expo start --lan
echo 3. expo start --localhost
echo.
echo 📱 Make sure to:
echo - Update Expo Go app on your iPhone
echo - Connect to the same WiFi network
pause
