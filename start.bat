@echo off
chcp 65001 >nul

echo =========================================
echo   MoKe - Chinese Art AI Education
echo =========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found.
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo [INFO] First run, installing dependencies...
    call npm install --no-bin-links
    if errorlevel 1 (
        echo [ERROR] Install failed
        pause
        exit /b 1
    )
)

echo [INFO] Starting Vite dev server...
echo [INFO] Please wait, browser will open: http://localhost:5173
echo.
echo To preview production build:
echo   npm run build ^&^& npm run preview
echo.

start http://localhost:5173
npm run dev
