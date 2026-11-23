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

for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set NODE_MAJOR=%%V
if %NODE_MAJOR% LSS 20 (
  echo [ERROR] Node.js 20 or newer is required.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Reinstall Node.js.
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
  echo Run ONE-CLICK-SETUP.bat or SETUP-PC.bat once first.
  pause
  exit /b 1
)

echo [1/3] Building marketplace CSS automatically...
call npm run prebuild
if errorlevel 1 (
  echo [ERROR] CSS build failed. Server was not started.
  pause
  exit /b 1
)

echo.
echo [2/3] Checking project JavaScript...
call npm run check
if errorlevel 1 (
  echo [ERROR] Project checks failed. Server was not started.
  pause
  exit /b 1
)

echo.
echo [3/3] Starting 7inOne...
echo [INFO] Local URL: http://localhost:10000
echo [INFO] Keep this window open while using the app.
echo Press CTRL+C to stop the server.
echo.
start "" "http://localhost:10000"
call npm start
echo.
echo [INFO] Local server has stopped.
pause
