@echo off
setlocal EnableExtensions
title 7inOne - Local Server
cd /d "%~dp0"

echo ==========================================
echo          7inOne - LOCAL SERVER
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js 20 or newer is required. Run SETUP-PC.bat first.
  pause
  exit /b 1
)

if not exist ".env" (
  echo [ERROR] Local .env file is missing.
  echo Restore your private .env file to the project root.
  echo Do NOT upload it to GitHub.
  pause
  exit /b 1
)

if not exist "node_modules\dotenv\package.json" (
  echo [ERROR] Dependencies are not installed.
  echo Please run SETUP-PC.bat first.
  pause
  exit /b 1
)

echo [INFO] Starting 7inOne...
echo [INFO] Local URL: http://localhost:10000
echo [INFO] Keep this window open while using the app.
echo Press CTRL+C to stop the server.
echo.
start "" "http://localhost:10000"
call npm start
echo.
echo [INFO] Local server has stopped.
pause
