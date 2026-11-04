@echo off
title PROJECT FOREVER Server
cd /d "%~dp0"
echo ===================================================
echo   PROJECT FOREVER - Songs Until We Meet
echo   Server running on http://localhost:5500
echo   Keep this window open while viewing the site!
echo ===================================================
echo.
start http://localhost:5500
python -m http.server 5500
if %ERRORLEVEL% NEQ 0 (
  echo Python server failed, trying Node.js...
  npx -y serve -p 5500 .
)
pause
