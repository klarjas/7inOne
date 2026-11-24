@echo off
setlocal EnableExtensions
title ANANTA Khmer Benchmark

if exist E:\ (
  set "ANANTA_HOME=E:\ANANTA-Local"
) else (
  set "ANANTA_HOME=%USERPROFILE%\ANANTA-Local"
)
if not exist "%ANANTA_HOME%\ananta-api-key.txt" (
  echo ERROR: Local ANANTA API key not found.
  echo Start START-ANANTA-LOCAL.bat first.
  pause
  exit /b 1
)
curl.exe -fsS http://127.0.0.1:9931/health >nul 2>&1
if errorlevel 1 (
  echo ERROR: Local ANANTA server is not ready.
  pause
  exit /b 1
)
set "ANANTA_MODEL_URL=http://127.0.0.1:9931/v1/chat/completions"
set "ANANTA_MODEL_NAME=ananta-gemma4-e2b"
set /p ANANTA_MODEL_API_KEY=<"%ANANTA_HOME%\ananta-api-key.txt"

cd /d "%~dp0\..\..\.."
where py >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python Launcher is not installed.
  pause
  exit /b 1
)
if not exist artifacts\ananta-evaluations mkdir artifacts\ananta-evaluations
py -3.12 scripts\ananta\run_benchmark.py --output artifacts\ananta-evaluations\gemma4-base-local.jsonl
echo.
echo Raw benchmark output saved to artifacts\ananta-evaluations\gemma4-base-local.jsonl
echo Please review the answers before using the model with customers.
pause
