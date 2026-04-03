@echo off

REM 启动脚本 - Windows版本
REM 功能：安装依赖并启动开发服务器

echo ===================================
echo 🌸 洛芙的项目启动脚本 🌸
echo ===================================
echo.

REM 检查是否安装了npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到npm，请先安装Node.js
    echo 下载地址：https://nodejs.org/en/download/
    pause
    exit /b 1
)

echo 📦 正在安装依赖...
npm install

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo 🚀 启动开发服务器...
npm run dev

pause