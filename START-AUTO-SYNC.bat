
@echo off
title 7inOne - GitHub Auto Sync
cd /d "%~dp0"

echo =====================================
echo       7inOne GITHUB AUTO SYNC
echo =====================================
echo.
echo Repository: %CD%
echo Branch: main
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\AUTO-SYNC.ps1"

echo.
echo Auto Sync stopped.
pause
