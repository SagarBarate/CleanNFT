@echo off
echo 🚀 Starting All NFT Project Services...
echo.

echo 📋 Prerequisites Check:
echo - Node.js installed: 
node --version
echo - npm installed:
npm --version
echo.

echo 🎨 Starting Frontend Services...
echo.

echo 1️⃣ Starting Recycling PWA...
start "Recycling PWA" cmd /k "cd recycling-pwa && npm run dev"
timeout /t 3 /nobreak >nul

echo 2️⃣ Starting Admin Portal...
start "Admin Portal" cmd /k "cd admin-portal && npm start"
timeout /t 3 /nobreak >nul

echo 3️⃣ Starting Mobile App (Expo)...
start "Mobile App" cmd /k "cd mobile-app && npm start"
timeout /t 3 /nobreak >nul

echo.
echo ⚙️ Starting Backend Services...
echo.

echo 4️⃣ Starting Backend API...
start "Backend API" cmd /k "cd backend-api && npm run dev"
timeout /t 3 /nobreak >nul

echo 5️⃣ Starting IoT Simulation...
start "IoT Simulation" cmd /k "cd iot-simulation && npm start"
timeout /t 3 /nobreak >nul

echo.
echo 🔗 Smart Contract Services...
echo.

echo 6️⃣ Opening Hardhat Console...
start "Smart Contracts" cmd /k "cd contracts && npx hardhat console --network mumbai"
timeout /t 3 /nobreak >nul

echo.
echo ✅ All services are starting up!
echo.
echo 📱 Service URLs:
echo - Recycling PWA: http://localhost:5173
echo - Admin Portal: http://localhost:3000
echo - Backend API: http://localhost:3001
echo - Mobile App: http://localhost:19000
echo.
echo 🔧 To stop all services, close the command windows
echo.
pause


