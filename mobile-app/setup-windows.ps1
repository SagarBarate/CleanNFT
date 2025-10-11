Write-Host "🚀 Setting up Mobile App for Windows..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Expo CLI globally
Write-Host "📦 Installing Expo CLI..." -ForegroundColor Yellow
try {
    npm install -g @expo/cli
    Write-Host "✅ Expo CLI installed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Expo CLI installation failed, trying alternative..." -ForegroundColor Yellow
    try {
        npm install -g expo-cli
        Write-Host "✅ Alternative Expo CLI installed" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install Expo CLI" -ForegroundColor Red
    }
}

# Install project dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
}

# Create environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ Created .env file" -ForegroundColor Green
    }
}

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Now you can run:" -ForegroundColor Cyan
Write-Host "1. expo start --tunnel" -ForegroundColor White
Write-Host "2. expo start --lan" -ForegroundColor White
Write-Host "3. expo start --localhost" -ForegroundColor White
Write-Host ""
Write-Host "📱 Make sure to:" -ForegroundColor Cyan
Write-Host "- Install Expo Go app on your iPhone" -ForegroundColor White
Write-Host "- Connect to the same WiFi network" -ForegroundColor White
Write-Host "- Try mobile hotspot if WiFi fails" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"






