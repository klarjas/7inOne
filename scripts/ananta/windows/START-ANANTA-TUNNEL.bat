@echo off
setlocal EnableExtensions
title ANANTA Secure Tunnel

if exist E:\ (
  set "ANANTA_HOME=E:\ANANTA-Local"
) else (
  set "ANANTA_HOME=%USERPROFILE%\ANANTA-Local"
)
if not exist "%ANANTA_HOME%\ananta-api-key.txt" (
  echo ERROR: Start START-ANANTA-LOCAL.bat first.
  pause
  exit /b 1
)

echo Checking local ANANTA model server...
curl.exe -fsS http://127.0.0.1:9931/health >nul 2>&1
if errorlevel 1 (
  echo ERROR: ANANTA model server is not ready.
  echo Start START-ANANTA-LOCAL.bat and wait until model loading completes.
  pause
  exit /b 1
)

where cloudflared >nul 2>&1
if errorlevel 1 (
  echo Installing Cloudflare Tunnel client...
  where winget >nul 2>&1
  if errorlevel 1 (
    echo ERROR: winget is unavailable. Install cloudflared from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
    pause
    exit /b 1
  )
  winget install --id Cloudflare.cloudflared -e --accept-source-agreements --accept-package-agreements
  where cloudflared >nul 2>&1
  if errorlevel 1 (
    echo Close this window and run START-ANANTA-TUNNEL.bat again.
    pause
    exit /b 1
  )
)

echo.
echo ==============================================
echo Secure temporary HTTPS tunnel for ANANTA
echo Copy the trycloudflare.com URL shown below.
echo This URL changes when the tunnel restarts.
echo Keep this window open while using the tunnel.
echo ==============================================
echo.
cloudflared tunnel --url http://127.0.0.1:9931
