@echo off
chcp 65001 > nul
title 农业数据分析平台

rem 设置Node.js路径
set "NODE_PATH=C:\Program Files\nodejs"
set "PATH=%NODE_PATH%;%PATH%"

echo [信息] 正在启动农业数据分析平台...
echo [信息] 当前目录: %CD%
echo.

rem 检查Node.js
echo [检查] Node.js 安装状态...
node --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到Node.js，请安装Node.js后重试
    start https://nodejs.org/zh-cn/download/
    pause
    exit /b 1
)

rem 检查package.json
if not exist package.json (
    echo [信息] 未找到package.json，正在初始化项目...
    call npm init -y
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 项目初始化失败
        pause
        exit /b 1
    )
)

rem 检查并安装依赖
if not exist node_modules (
    echo [信息] 正在安装项目依赖...
    call npm install react react-dom react-scripts @heroicons/react recharts tailwindcss @headlessui/react postcss autoprefixer --save
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [信息] 正在启动开发服务器...
echo [信息] 如果浏览器没有自动打开，请访问: http://localhost:3000
echo.

call npm start

if %ERRORLEVEL% NEQ 0 (
    echo [错误] 服务器启动失败
    echo [信息] 请检查是否有其他程序占用了3000端口
    pause
    exit /b 1
)

pause 