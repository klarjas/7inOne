@echo off
setlocal EnableExtensions
title ANANTA Own Model - Local Server

if exist E:\ (
  set "ANANTA_HOME=E:\ANANTA-Local"
) else (
  set "ANANTA_HOME=%USERPROFILE%\ANANTA-Local"
)
if not exist "%ANANTA_HOME%" mkdir "%ANANTA_HOME%"
if not exist "%ANANTA_HOME%\models" mkdir "%ANANTA_HOME%\models"

echo.
echo ==============================================
echo       ANANTA - GEMMA 4 E2B LOCAL MODEL
echo ==============================================
echo Model cache: %ANANTA_HOME%\models
echo This is a free local CPU-first model server.
echo First startup downloads about 2.8 GB.
echo Keep this window open while ANANTA is running.
echo.

where llama >nul 2>&1
if errorlevel 1 (
  echo [1/3] Installing llama.cpp with Windows Package Manager...
  where winget >nul 2>&1
  if errorlevel 1 (
    echo ERROR: winget is not available on this Windows installation.
    echo Install llama.cpp from https://github.com/ggml-org/llama.cpp/releases
    pause
    exit /b 1
  )
  winget install llama.cpp --accept-source-agreements --accept-package-agreements
  where llama >nul 2>&1
  if errorlevel 1 (
    echo.
    echo Installation finished, but this window cannot find the new llama command.
    echo Close this window and run START-ANANTA-LOCAL.bat again.
    pause
    exit /b 1
  )
)

if not exist "%ANANTA_HOME%\ananta-api-key.txt" (
  echo [2/3] Creating a private API key on this computer...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$rng=New-Object System.Security.Cryptography.RNGCryptoServiceProvider; $b=New-Object byte[] 48; $rng.GetBytes($b); [Convert]::ToBase64String($b) | Set-Content -NoNewline -Encoding ASCII '%ANANTA_HOME%\ananta-api-key.txt'; $rng.Dispose()"
  if errorlevel 1 (
    echo ERROR: Could not create local API key.
    pause
    exit /b 1
  )
)

set "LLAMA_CACHE=%ANANTA_HOME%\models"
echo.
echo [3/3] Starting Gemma 4 E2B Q4 model...
echo Local API: http://127.0.0.1:9931/v1/chat/completions
echo API key file: %ANANTA_HOME%\ananta-api-key.txt
echo Do not share the API key publicly.
echo.

llama serve -hf ggml-org/gemma-4-E2B-it-GGUF:Q4_0 --alias ananta-gemma4-e2b --host 127.0.0.1 --port 9931 --api-key-file "%ANANTA_HOME%\ananta-api-key.txt" --no-webui -c 4096 -t 6 -np 1

echo.
echo ANANTA model server stopped.
pause
