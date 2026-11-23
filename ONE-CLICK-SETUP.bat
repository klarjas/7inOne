@echo off
setlocal EnableExtensions
title 7inOne - ONE CLICK PC SETUP
cd /d "%~dp0"

echo ==================================================
echo           7inOne - ONE CLICK PC SETUP
echo ==================================================
echo.
echo This setup checks and installs missing tools.
echo It will NOT modify .env or delete project source files.
echo.

if not exist ".git\\HEAD" (
  echo [ERROR] This folder is not a Git repository.
  echo Open this file from the existing 7inOne project folder.
  goto :failed
)

if not exist ".env" (
  echo [ERROR] Local .env file is missing.
  echo Copy your private .env file into this folder first.
  echo Never upload .env to GitHub.
  goto :failed
)

where winget >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Windows Package Manager (winget) is unavailable.
  echo Update or install App Installer from Microsoft Store, then run this file again.
  goto :failed
)

echo [CHECK] Git...
where git >nul 2>nul
if errorlevel 1 (
  echo [INSTALL] Installing Git for Windows...
  winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements
  if errorlevel 1 goto :install_failed
  if exist "%ProgramFiles%\\Git\\cmd\\git.exe" set "PATH=%ProgramFiles%\\Git\\cmd;%PATH%"
  if exist "%LocalAppData%\\Programs\\Git\\cmd\\git.exe" set "PATH=%LocalAppData%\\Programs\\Git\\cmd;%PATH%"
)
where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git installation completed but Git is not available in this CMD.
  echo Close this window, open it again, and run ONE-CLICK-SETUP.bat.
  goto :failed
)
git --version

echo.
echo [CHECK] Node.js 20 or newer...
set "NODE_MAJOR=0"
where node >nul 2>nul
if errorlevel 1 goto :install_node
for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%V"
if %NODE_MAJOR% LSS 20 goto :install_node
goto :node_ready

:install_node
echo [INSTALL] Installing Node.js LTS...
winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
if errorlevel 1 goto :install_failed
if exist "%ProgramFiles%\\nodejs\\node.exe" set "PATH=%ProgramFiles%\\nodejs;%PATH%"
if exist "%LocalAppData%\\Programs\\nodejs\\node.exe" set "PATH=%LocalAppData%\\Programs\\nodejs;%PATH%"
set "NODE_MAJOR=0"
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was installed but is not available in this CMD.
  echo Close this window, open it again, and run ONE-CLICK-SETUP.bat.
  goto :failed
)
for /f "tokens=1 delims=." %%V in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%V"
if %NODE_MAJOR% LSS 20 (
  echo [ERROR] Node.js 20 or newer is required. Current version:
  node --version
  goto :failed
)

:node_ready
echo [OK] Node.js:
node --version
echo [OK] npm:
call npm --version

echo.
echo [CHECK] Cloudflare Tunnel...
where cloudflared >nul 2>nul
if errorlevel 1 (
  echo [INSTALL] Installing Cloudflare Tunnel for HTTPS testing...
  winget install --id Cloudflare.cloudflared -e --silent --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo [WARNING] Cloudflare Tunnel could not be installed automatically.
    echo You can install it later; local development can continue.
  )
)

echo.
echo [CHECK] Installing project dependencies from package-lock.json...
if not exist "package-lock.json" (
  echo [ERROR] package-lock.json is missing. Setup stopped.
  goto :failed
)
call npm ci
if errorlevel 1 goto :failed

echo.
echo [CHECK] Generating marketplace Tailwind CSS...
call npm run prebuild
if errorlevel 1 goto :failed

echo.
echo [CHECK] Project syntax...
call npm run check
if errorlevel 1 goto :failed

echo.
echo ==================================================
echo [SUCCESS] PC setup completed.
echo Starting GitHub Auto-Sync, Local Server and Tunnel...
echo ==================================================
echo.

start "7inOne GitHub Auto-Sync" cmd /k ""%~dp0START-AUTO-SYNC.bat""
where cloudflared >nul 2>nul
if errorlevel 1 (
  echo [WARNING] Cloudflare Tunnel is not available in this CMD.
  echo Local development will continue. Reopen CMD after installation if needed.
) else (
  start "7inOne Cloudflare Tunnel" cmd /k cloudflared tunnel --url http://localhost:10000
)
call "%~dp0START-LOCAL.bat"
exit /b 0

:install_failed
echo.
echo [ERROR] A required tool could not be installed by winget.
echo Check your internet connection and Windows installation permissions.
goto :failed

:failed
echo.
echo [SETUP STOPPED] Existing source files and .env were not intentionally changed.
pause
exit /b 1
