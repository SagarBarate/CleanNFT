#!/bin/bash

echo "🚀 Starting All NFT Project Services..."
echo

echo "📋 Prerequisites Check:"
echo "- Node.js installed:"
node --version
echo "- npm installed:"
npm --version
echo

echo "🎨 Starting Frontend Services..."
echo

echo "1️⃣ Starting Recycling PWA..."
cd recycling-pwa && npm run dev &
PWA_PID=$!
sleep 3

echo "2️⃣ Starting Admin Portal..."
cd ../admin-portal && npm start &
ADMIN_PID=$!
sleep 3

echo "3️⃣ Starting Mobile App (Expo)..."
cd ../mobile-app && npm start &
MOBILE_PID=$!
sleep 3

echo
echo "⚙️ Starting Backend Services..."
echo

echo "4️⃣ Starting Backend API..."
cd ../backend-api && npm run dev &
BACKEND_PID=$!
sleep 3

echo "5️⃣ Starting IoT Simulation..."
cd ../iot-simulation && npm start &
IOT_PID=$!
sleep 3

echo
echo "🔗 Smart Contract Services..."
echo

echo "6️⃣ Opening Hardhat Console..."
cd ../contracts && npx hardhat console --network mumbai &
HARDHAT_PID=$!
sleep 3

echo
echo "✅ All services are starting up!"
echo
echo "📱 Service URLs:"
echo "- Recycling PWA: http://localhost:5173"
echo "- Admin Portal: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- Mobile App: http://localhost:19000"
echo
echo "🔧 To stop all services, press Ctrl+C"
echo

# Function to cleanup processes on exit
cleanup() {
    echo
    echo "🛑 Stopping all services..."
    kill $PWA_PID 2>/dev/null
    kill $ADMIN_PID 2>/dev/null
    kill $MOBILE_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $IOT_PID 2>/dev/null
    kill $HARDHAT_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user input
echo "Press Ctrl+C to stop all services..."
wait


