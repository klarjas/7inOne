@echo off
setlocal EnableExtensions
title 7inOne - PC Setup
cd /d "%~dp0"

echo ==========================================
echo          7inOne - FULL PC SETUP
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install Node.js 20 LTS or newer from:
  echo https://nodejs.org/
  echo Then close and reopen CMD and run this file again.
  goto :failed
)

for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set NODE_MAJOR=%%V
echo [INFO] Node.js version:
node --version
if %NODE_MAJOR% LSS 20 (
  echo [ERROR] This project requires Node.js 20 or newer.
  echo Install the current Node.js LTS release from https://nodejs.org/
  goto :failed
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Reinstall Node.js LTS.
  goto :failed
)
echo [INFO] npm version:
npm --version

if not exist ".env" (
  echo.
  echo [ERROR] .env was not found in the project root.
  echo Copy your private local .env file into:
  echo %CD%
  echo Do NOT upload .env to GitHub.
  goto :failed
)
echo [OK] Local .env file found. Its contents were not displayed.

if not exist "package-lock.json" (
  echo [ERROR] package-lock.json is missing. Setup stopped to avoid an uncontrolled install.
  goto :failed
)

echo.
echo [SETUP] Installing exact dependencies from package-lock.json...
call npm ci
if errorlevel 1 (
  echo [ERROR] npm ci failed. Check your internet connection and npm error above.
  goto :failed
)

echo.
echo [CHECK] Checking project JavaScript syntax...
call npm run check
if errorlevel 1 (
  echo [ERROR] Project checks failed. Review the output above.
  goto :failed
)

echo.
echo ==========================================
echo [SUCCESS] 7inOne setup completed.
echo Run START-LOCAL.bat to start the local app.
echo Local URL: http://localhost:10000
echo ==========================================
pause
exit /b 0

:failed
echo.
echo [SETUP STOPPED] No project data or .env file was changed.
pause
exit /b 1
