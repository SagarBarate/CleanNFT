@echo off
echo 🔍 Verifying NFT Project Services Setup...
echo.

echo 📋 Checking Prerequisites...
echo.

echo - Node.js:
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
) else (
    echo ❌ Node.js is not installed
)

echo - npm:
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ npm is installed
) else (
    echo ❌ npm is not installed
)

echo.
echo 📁 Checking Environment Files...
echo.

set ENV_COUNT=0

if exist "recycling-pwa\.env" (
    echo ✅ Recycling PWA .env exists
    set /a ENV_COUNT+=1
) else (
    echo ❌ Recycling PWA .env missing
)

if exist "admin-portal\.env" (
    echo ✅ Admin Portal .env exists
    set /a ENV_COUNT+=1
) else (
    echo ❌ Admin Portal .env missing
)

if exist "mobile-app\.env" (
    echo ✅ Mobile App .env exists
    set /a ENV_COUNT+=1
) else (
    echo ❌ Mobile App .env missing
)

if exist "backend-api\.env" (
    echo ✅ Backend API .env exists
    set /a ENV_COUNT+=1
) else (
    echo ❌ Backend API .env missing
)

if exist "iot-simulation\.env" (
    echo ✅ IoT Simulation .env exists
    set /a ENV_COUNT+=1
) else (
    echo ❌ IoT Simulation .env missing
)

if exist "contracts\.env" (
    echo ✅ Smart Contracts .env exists
    set /a ENV_COUNT+=1
) else (
    echo ❌ Smart Contracts .env missing
)

echo.
echo 📦 Checking Dependencies...
echo.

echo - Recycling PWA:
if exist "recycling-pwa\node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed (run: cd recycling-pwa && npm install)
)

echo - Admin Portal:
if exist "admin-portal\node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed (run: cd admin-portal && npm install)
)

echo - Mobile App:
if exist "mobile-app\node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed (run: cd mobile-app && npm install)
)

echo - Backend API:
if exist "backend-api\node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed (run: cd backend-api && npm install)
)

echo - IoT Simulation:
if exist "iot-simulation\node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed (run: cd iot-simulation && npm install)
)

echo - Smart Contracts:
if exist "contracts\node_modules" (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed (run: cd contracts && npm install)
)

echo.
echo 🔗 Checking Smart Contract Configuration...
echo.

if exist "contracts\.env" (
    echo ✅ Smart contract environment exists
    echo 📝 Remember to:
    echo   - Set your PRIVATE_KEY
    echo   - Configure RPC URLs
    echo   - Deploy contracts to testnet
) else (
    echo ❌ Smart contract environment missing
)

echo.
echo 📊 Setup Summary:
echo - Environment files: %ENV_COUNT%/7
echo - Dependencies: Check individual services above
echo.
echo 🚀 Ready to start services? Run start-all-services.bat
echo.
pause


