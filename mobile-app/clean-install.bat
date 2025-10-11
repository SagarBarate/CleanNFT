@echo off
echo 🧹 Clean Installing Dependencies...

REM Navigate to mobile app directory
cd /d "%~dp0"

echo 🗑️ Removing old dependencies...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

echo 📦 Installing dependencies with compatible versions...
call npm install --legacy-peer-deps

echo ✅ Clean install complete!
echo.
echo 🎯 Now try:
echo expo start --tunnel
echo.
pause






