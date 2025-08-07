@echo off
echo 🚀 Setting up Recycling NFT System...

REM Create environment files
echo 📝 Creating environment files...

REM Backend API
if not exist "backend-api\.env" (
    copy "backend-api\env.example" "backend-api\.env"
    echo ✅ Created backend-api\.env
) else (
    echo ⚠️  backend-api\.env already exists
)

REM Mobile App
if not exist "mobile-app\.env" (
    copy "mobile-app\env.example" "mobile-app\.env"
    echo ✅ Created mobile-app\.env
) else (
    echo ⚠️  mobile-app\.env already exists
)

REM Install dependencies
echo 📦 Installing dependencies...

REM Backend API
echo Installing backend API dependencies...
cd backend-api
call npm install
cd ..

REM Admin Portal
echo Installing admin portal dependencies...
cd admin-portal
call npm install
cd ..

REM Mobile App
echo Installing mobile app dependencies...
cd mobile-app
call npm install
cd ..

REM Smart Contract
echo Installing smart contract dependencies...
call npm install

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Configure environment files (.env) with your settings
echo 2. Deploy smart contract: npx hardhat deploy
echo 3. Start backend API: cd backend-api ^&^& npm run dev
echo 4. Start admin portal: cd admin-portal ^&^& npm start
echo 5. Start mobile app: cd mobile-app ^&^& npm start
echo.
echo 📚 Check README.md for detailed documentation
pause
