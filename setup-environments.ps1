Write-Host "🔧 Setting up all environment files for NFT Project Services..." -ForegroundColor Green
Write-Host ""

Write-Host "📁 Creating environment files from examples..." -ForegroundColor Yellow
Write-Host ""

$envCount = 0

# 1. Recycling PWA
Write-Host "1️⃣ Setting up Recycling PWA environment..." -ForegroundColor Cyan
if (Test-Path "recycling-pwa\env.example") {
    Copy-Item "recycling-pwa\env.example" "recycling-pwa\.env" -Force
    Write-Host "✅ Recycling PWA .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ Recycling PWA env.example not found" -ForegroundColor Red
}

# 2. Admin Portal
Write-Host "2️⃣ Setting up Admin Portal environment..." -ForegroundColor Cyan
if (Test-Path "admin-portal\env.example") {
    Copy-Item "admin-portal\env.example" "admin-portal\.env" -Force
    Write-Host "✅ Admin Portal .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ Admin Portal env.example not found" -ForegroundColor Red
}

# 3. Mobile App
Write-Host "3️⃣ Setting up Mobile App environment..." -ForegroundColor Cyan
if (Test-Path "mobile-app\env.example") {
    Copy-Item "mobile-app\env.example" "mobile-app\.env" -Force
    Write-Host "✅ Mobile App .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ Mobile App env.example not found" -ForegroundColor Red
}

# 4. Backend API
Write-Host "4️⃣ Setting up Backend API environment..." -ForegroundColor Cyan
if (Test-Path "backend-api\env.example") {
    Copy-Item "backend-api\env.example" "backend-api\.env" -Force
    Write-Host "✅ Backend API .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ Backend API env.example not found" -ForegroundColor Red
}

# 5. IoT Simulation
Write-Host "5️⃣ Setting up IoT Simulation environment..." -ForegroundColor Cyan
if (Test-Path "iot-simulation\env.example") {
    Copy-Item "iot-simulation\env.example" "iot-simulation\.env" -Force
    Write-Host "✅ IoT Simulation .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ IoT Simulation env.example not found" -ForegroundColor Red
}

# 6. Smart Contracts
Write-Host "6️⃣ Setting up Smart Contracts environment..." -ForegroundColor Cyan
if (Test-Path "contracts\env.example") {
    Copy-Item "contracts\env.example" "contracts\.env" -Force
    Write-Host "✅ Smart Contracts .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ Smart Contracts env.example not found" -ForegroundColor Red
}

# 7. Lambda
Write-Host "7️⃣ Setting up Lambda environment..." -ForegroundColor Cyan
if (Test-Path "lambda\metadataLambda\env.example") {
    Copy-Item "lambda\metadataLambda\env.example" "lambda\metadataLambda\.env" -Force
    Write-Host "✅ Lambda .env created" -ForegroundColor Green
    $envCount++
} else {
    Write-Host "❌ Lambda env.example not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Environment files created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary: $envCount out of 7 environment files created" -ForegroundColor Yellow
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit each .env file with your actual configuration values" -ForegroundColor White
Write-Host "2. Set up your MongoDB database" -ForegroundColor White
Write-Host "3. Configure your blockchain network settings" -ForegroundColor White
Write-Host "4. Add your Pinata API keys (optional)" -ForegroundColor White
Write-Host "5. Set up your AWS credentials (optional)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 After configuration, you can start services manually:" -ForegroundColor Green
Write-Host "   - Backend API: cd backend-api && npm run dev" -ForegroundColor White
Write-Host "   - Recycling PWA: cd recycling-pwa && npm run dev" -ForegroundColor White
Write-Host "   - Admin Portal: cd admin-portal && npm start" -ForegroundColor White
Write-Host "   - Mobile App: cd mobile-app && npm start" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue..."


