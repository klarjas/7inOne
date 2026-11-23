@echo off
setlocal EnableExtensions
title 7inOne - System Check
cd /d "%~dp0"

echo ==========================================
echo          7inOne - SYSTEM CHECK
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [MISSING] Node.js
) else (
  for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set NODE_MAJOR=%%V
  echo [FOUND] Node.js:
  node --version
  if %NODE_MAJOR% LSS 20 echo [WARNING] Node.js 20 or newer is required.
)

where npm >nul 2>nul
if errorlevel 1 (echo [MISSING] npm) else (echo [FOUND] npm & npm --version)

where git >nul 2>nul
if errorlevel 1 (echo [MISSING] Git) else (echo [FOUND] Git & git --version)

if exist ".env" (echo [OK] Local .env exists; values hidden.) else (echo [MISSING] Local .env)
if exist "package-lock.json" (echo [OK] package-lock.json exists.) else (echo [MISSING] package-lock.json)
if exist "node_modules\dotenv\package.json" (echo [OK] Dependencies appear installed.) else (echo [MISSING] Dependencies; run SETUP-PC.bat.)

echo.
echo Local URL after server starts: http://localhost:10000
echo This check does not modify project files.
pause
