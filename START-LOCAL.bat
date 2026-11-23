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

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git was not found. Install Git for Windows, then try again.
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

echo [0/6] Checking for GitHub updates...
if not exist "scripts\UPDATE-FROM-GITHUB.ps1" (
  echo [ERROR] Safe update script is missing. Startup stopped.
  pause
  exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\UPDATE-FROM-GITHUB.ps1"
if errorlevel 1 (
  echo [ERROR] GitHub update was blocked to protect local changes.
  echo Resolve the reported issue before starting 7inOne.
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
echo [3/4] Building Next.js production app...
call npm run build
if errorlevel 1 (
  echo [ERROR] Next.js production build failed. Server was not started.
  pause
  exit /b 1
)

echo.
echo [4/4] Starting all 7inOne services in this same window...
if not exist "scripts\ONE-WINDOW-CONTROLLER.ps1" (
  echo [ERROR] One-window controller is missing.
  pause
  exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ONE-WINDOW-CONTROLLER.ps1"

echo.
echo [INFO] 7inOne control center has stopped.
pause
