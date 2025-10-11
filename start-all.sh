#!/bin/bash

echo "🚀 Starting CleanNFT Project Services..."
echo

# Kill any existing processes on these ports
echo "🛑 Stopping existing services..."
lsof -ti:3000,3001,5173 | xargs kill -9 2>/dev/null || true
sleep 2

echo "📦 Starting Backend API (port 3001)..."
cd backend-api && npm start &
BACKEND_PID=$!

echo "🏢 Starting Admin Portal (port 3000)..."
cd ../admin-portal && npm start &
ADMIN_PID=$!

echo "🌱 Starting Recycling PWA (port 5173)..."
cd ../recycling-pwa && npm run dev &
PWA_PID=$!

echo
echo "⏳ Waiting for services to start..."
sleep 10

echo
echo "✅ Services Status:"
echo "🔗 Backend API: http://localhost:3001"
echo "🏢 Admin Portal: http://localhost:3000" 
echo "🌱 Recycling PWA: http://localhost:5173"
echo
echo "📋 To stop all services: pkill -f 'npm start' && pkill -f 'npm run dev'"
echo
echo "🎉 All services started! Open the URLs above in your browser."

# Keep script running
wait


