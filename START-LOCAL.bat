@echo off
setlocal EnableExtensions
title 7inOne - One Click Start
cd /d "%~dp0"

echo ==================================================
echo             7inOne - ONE CLICK START
echo ==================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js 20 or newer is required. Run ONE-CLICK-SETUP.bat first.
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

echo [1/4] Building marketplace CSS...
call npm run prebuild
if errorlevel 1 (
  echo [ERROR] CSS build failed. Nothing was started.
  pause
  exit /b 1
)

echo.
echo [2/4] Checking project JavaScript...
call npm run check
if errorlevel 1 (
  echo [ERROR] Project checks failed. Nothing was started.
  pause
  exit /b 1
)

echo.
echo [3/4] Starting GitHub Auto-Sync...
if exist "START-AUTO-SYNC.bat" if exist "scripts\AUTO-SYNC.ps1" (
  start "7inOne GitHub Auto-Sync" /D "%~dp0" cmd /k "START-AUTO-SYNC.bat"
  echo [OK] GitHub Auto-Sync started in a separate window.
) else (
  echo [WARNING] Auto-Sync files are missing. GitHub Auto-Sync was not started.
)

echo.
echo [4/4] Starting Local Server...
start "7inOne Local Server" /D "%~dp0" cmd /k "npm start"
echo [OK] Local Server window opened.
echo [INFO] Local URL: http://localhost:10000/marketplace/index.html#home

echo.
echo Waiting for the local server...
timeout /t 5 /nobreak >nul

echo.
echo Starting Cloudflare Tunnel...
where cloudflared >nul 2>nul
if errorlevel 1 (
  echo [WARNING] cloudflared was not found.
  echo Local app is running, but no Public URL is available.
  echo Run ONE-CLICK-SETUP.bat or install Cloudflare Tunnel, then try again.
) else (
  start "7inOne Public URL - Cloudflare" /D "%~dp0" cmd /k "cloudflared tunnel --url http://localhost:10000"
  echo [OK] Cloudflare Tunnel started in a separate window.
  echo [INFO] Find the https://...trycloudflare.com URL in that window.
  echo [INFO] Your app link is: https://YOUR-TUNNEL.trycloudflare.com/marketplace/index.html#home
)

echo.
echo Opening 7inOne in your browser...
start "" "http://localhost:10000/marketplace/index.html#home"

echo.
echo ==================================================
echo [SUCCESS] 7inOne startup commands have been launched.
echo Keep the Local Server, Cloudflare Tunnel and Auto-Sync
echo windows open while you use the app.
echo ==================================================
echo.
pause
