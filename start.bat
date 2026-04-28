@echo off
chcp 65001 >nul
echo =========================================
echo   墨课 - 中国艺术学AI教育平台
echo =========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查 node_modules
if not exist node_modules (
    echo [信息] 首次运行，正在安装依赖...
    call npm install --no-bin-links
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [信息] 正在启动开发服务器...
echo [信息] 请稍后，浏览器访问: http://localhost:3000
echo.
start http://localhost:3000
npm run dev
