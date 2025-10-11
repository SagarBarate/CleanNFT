Write-Host "🚀 Starting All NFT Project Services..." -ForegroundColor Green
Write-Host ""

Write-Host "📋 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "- Node.js installed:" -ForegroundColor White
try {
    $nodeVersion = node --version
    Write-Host "  ✅ $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ first" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "- npm installed:" -ForegroundColor White
try {
    $npmVersion = npm --version
    Write-Host "  ✅ $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm not found" -ForegroundColor Red
    Write-Host "Please install npm first" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🎨 Starting Frontend Services..." -ForegroundColor Yellow
Write-Host ""

# Function to start service in new PowerShell window
function Start-ServiceInNewWindow {
    param(
        [string]$ServiceName,
        [string]$Directory,
        [string]$Command
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Cyan
    $scriptBlock = "cd '$Directory'; $Command"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $scriptBlock
    Start-Sleep -Seconds 3
}

# 1. Recycling PWA
Write-Host "1️⃣ Starting Recycling PWA..." -ForegroundColor Cyan
Start-ServiceInNewWindow "Recycling PWA" "recycling-pwa" "npm run dev"

# 2. Admin Portal
Write-Host "2️⃣ Starting Admin Portal..." -ForegroundColor Cyan
Start-ServiceInNewWindow "Admin Portal" "admin-portal" "npm start"

# 3. Mobile App
Write-Host "3️⃣ Starting Mobile App (Expo)..." -ForegroundColor Cyan
Start-ServiceInNewWindow "Mobile App" "mobile-app" "npm start"

Write-Host ""
Write-Host "⚙️ Starting Backend Services..." -ForegroundColor Yellow
Write-Host ""

# 4. Backend API
Write-Host "4️⃣ Starting Backend API..." -ForegroundColor Cyan
Start-ServiceInNewWindow "Backend API" "backend-api" "npm run dev"

# 5. IoT Simulation
Write-Host "5️⃣ Starting IoT Simulation..." -ForegroundColor Cyan
Start-ServiceInNewWindow "IoT Simulation" "iot-simulation" "npm start"

Write-Host ""
Write-Host "🔗 Smart Contract Services..." -ForegroundColor Yellow
Write-Host ""

# 6. Hardhat Console
Write-Host "6️⃣ Opening Hardhat Console..." -ForegroundColor Cyan
Start-ServiceInNewWindow "Smart Contracts" "contracts" "npx hardhat console --network mumbai"

Write-Host ""
Write-Host "✅ All services are starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Service URLs:" -ForegroundColor Yellow
Write-Host "- Recycling PWA: http://localhost:5173" -ForegroundColor White
Write-Host "- Admin Portal: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "- Mobile App: http://localhost:19000" -ForegroundColor White
Write-Host ""
Write-Host "🔧 To stop all services, close the PowerShell windows" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Note: Each service is running in a separate PowerShell window" -ForegroundColor Yellow
Write-Host "   You can monitor logs and stop individual services as needed" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue..."


