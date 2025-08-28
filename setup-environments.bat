@echo off
echo 🔧 Setting up all environment files for NFT Project Services...
echo.

echo 📁 Creating environment files from examples...
echo.

echo 1️⃣ Setting up Recycling PWA environment...
if exist "recycling-pwa\env.example" (
    copy "recycling-pwa\env.example" "recycling-pwa\.env"
    echo ✅ Recycling PWA .env created
) else (
    echo ❌ Recycling PWA env.example not found
)

echo.
echo 2️⃣ Setting up Admin Portal environment...
if exist "admin-portal\env.example" (
    copy "admin-portal\env.example" "admin-portal\.env"
    echo ✅ Admin Portal .env created
) else (
    echo ❌ Admin Portal env.example not found
)

echo.
echo 3️⃣ Setting up Mobile App environment...
if exist "mobile-app\env.example" (
    copy "mobile-app\env.example" "mobile-app\.env"
    echo ✅ Mobile App .env created
) else (
    echo ❌ Mobile App env.example not found
)

echo.
echo 4️⃣ Setting up Backend API environment...
if exist "backend-api\env.example" (
    copy "backend-api\env.example" "backend-api\.env"
    echo ✅ Backend API .env created
) else (
    echo ❌ Backend API env.example not found
)

echo.
echo 5️⃣ Setting up IoT Simulation environment...
if exist "iot-simulation\env.example" (
    copy "iot-simulation\env.example" "iot-simulation\.env"
    echo ✅ IoT Simulation .env created
) else (
    echo ❌ IoT Simulation env.example not found
)

echo.
echo 6️⃣ Setting up Smart Contracts environment...
if exist "contracts\env.example" (
    copy "contracts\env.example" "contracts\.env"
    echo ✅ Smart Contracts .env created
) else (
    echo ❌ Smart Contracts env.example not found
)

echo.
echo 7️⃣ Setting up Lambda environment...
if exist "lambda\metadataLambda\env.example" (
    copy "lambda\metadataLambda\env.example" "lambda\metadataLambda\.env"
    echo ✅ Lambda .env created
) else (
    echo ❌ Lambda env.example not found
)

echo.
echo 🔧 Environment files created successfully!
echo.
echo 📝 Next steps:
echo 1. Edit each .env file with your actual configuration values
echo 2. Set up your MongoDB database
echo 3. Configure your blockchain network settings
echo 4. Add your Pinata API keys (optional)
echo 5. Set up your AWS credentials (optional)
echo.
echo 🚀 After configuration, run start-all-services.bat to start all services
echo.
pause


