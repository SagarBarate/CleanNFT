@echo off
echo 🚀 Setting up Mobile App for Windows...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install Expo CLI globally
echo 📦 Installing Expo CLI...
call npm install -g @expo/cli

REM Check if Expo CLI installation was successful
expo --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Expo CLI installation failed, trying alternative...
    call npm install -g expo-cli
)

REM Install project dependencies
echo 📦 Installing project dependencies...
call npm install

REM Create environment file if it doesn't exist
if not exist ".env" (
    if exist "env.example" (
        copy "env.example" ".env"
        echo ✅ Created .env file
    )
)

echo ✅ Setup complete!
echo.
echo 🎯 Now you can run:
echo 1. expo start --tunnel
echo 2. expo start --lan
echo 3. expo start --localhost
echo.
echo 📱 Make sure to:
echo - Install Expo Go app on your iPhone
echo - Connect to the same WiFi network
echo - Try mobile hotspot if WiFi fails
pause
