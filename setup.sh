#!/bin/bash

echo "🚀 Setting up Recycling NFT System..."

# Create environment files
echo "📝 Creating environment files..."

# Backend API
if [ ! -f "backend-api/.env" ]; then
    cp backend-api/env.example backend-api/.env
    echo "✅ Created backend-api/.env"
else
    echo "⚠️  backend-api/.env already exists"
fi

# Mobile App
if [ ! -f "mobile-app/.env" ]; then
    cp mobile-app/env.example mobile-app/.env
    echo "✅ Created mobile-app/.env"
else
    echo "⚠️  mobile-app/.env already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Backend API
echo "Installing backend API dependencies..."
cd backend-api
npm install
cd ..

# Admin Portal
echo "Installing admin portal dependencies..."
cd admin-portal
npm install
cd ..

# Mobile App
echo "Installing mobile app dependencies..."
cd mobile-app
npm install
cd ..

# Smart Contract
echo "Installing smart contract dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure environment files (.env) with your settings"
echo "2. Deploy smart contract: npx hardhat deploy"
echo "3. Start backend API: cd backend-api && npm run dev"
echo "4. Start admin portal: cd admin-portal && npm start"
echo "5. Start mobile app: cd mobile-app && npm start"
echo ""
echo "📚 Check README.md for detailed documentation"






