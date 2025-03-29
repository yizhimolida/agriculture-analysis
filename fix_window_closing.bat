@echo off
chcp 65001 > nul
title 解决窗口关闭问题工具
color 1F
cls
echo ===== 窗口关闭问题修复工具 =====
echo.
echo 此工具将解决PowerShell脚本在停止Nginx时窗口意外关闭的问题。
echo.
echo 正在检查Nginx进程...

:: 检查Nginx进程是否在运行
set NGINX_RUNNING=0
tasklist /fi "imagename eq nginx.exe" | find "nginx.exe" > nul
if %errorlevel% equ 0 set NGINX_RUNNING=1

if %NGINX_RUNNING% equ 1 (
    echo.
    echo 发现Nginx正在运行。此工具会：
    echo 1. 安全地停止所有Nginx进程
    echo 2. 释放必要的端口
    echo 3. 确保命令窗口不会关闭
    echo.
    
    choice /C YN /M "是否继续操作？(Y=是，N=否)"
    if %errorlevel% equ 2 goto :EOF
    
    echo.
    echo 正在停止Nginx进程...
    echo.
    
    :: 使用更安全的方式停止Nginx
    if exist "C:\nginx\nginx.exe" (
        cd /d C:\nginx
        start /wait cmd /c "nginx.exe -s quit & echo 已尝试优雅停止Nginx & timeout /t 2"
    )
    
    :: 强制结束进程
    taskkill /f /im nginx.exe 2>nul
    
    echo.
    echo Nginx进程已停止。
    
    :: 检查端口
    echo.
    echo 检查端口占用情况...
    setlocal enabledelayedexpansion
    
    for %%p in (80 8080 7777) do (
        netstat -ano | find ":%%p " > nul
        if !errorlevel! equ 0 (
            echo 端口%%p被占用，尝试释放...
            for /f "tokens=5" %%i in ('netstat -ano ^| find ":%%p "') do (
                set PID=%%i
                echo 尝试终止进程PID: !PID!
                taskkill /f /pid !PID! 2>nul
            )
        ) else (
            echo 端口%%p已释放。
        )
    )
    
    echo.
    echo 所有操作已完成。
    
) else (
    echo.
    echo 没有发现正在运行的Nginx进程。
    echo.
    echo 可能的解决方案：
    echo 1. 使用管理员权限运行脚本
    echo 2. 确保run_deploy.bat中已添加编码设置
    echo 3. 检查防病毒软件是否阻止了命令执行
    echo.
)

echo ===== 工具执行完成 =====
echo.
echo 建议：
echo 1. 如果您需要安全停止Nginx，请使用stop_nginx.bat
echo 2. 如果您需要部署系统，请使用run_deploy.bat
echo 3. 如果您遇到中文乱码，请运行test_encoding.bat测试编码
echo.
echo 按任意键退出...
pause > nul 