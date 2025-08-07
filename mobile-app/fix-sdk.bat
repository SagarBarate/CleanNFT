@echo off
echo 🔧 Fixing SDK Version Issue...

REM Navigate to mobile app directory
cd /d "%~dp0"

echo 📦 Installing latest Expo CLI...
call npm install -g @expo/cli@latest

echo 🔄 Updating project dependencies...
call npx expo install --fix

echo 🧹 Clearing cache...
call npx expo r -c

echo ✅ Fix complete!
echo.
echo 🎯 Now try:
echo expo start --tunnel
echo.
pause
