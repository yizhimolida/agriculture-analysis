@echo off
echo ===== 农业分析系统部署程序 (简易版) =====
echo 此版本使用端口8080，避免与其他系统冲突

REM 检查是否以管理员身份运行
net session >nul 2>&1
if %errorLevel% == 0 (
    echo 已获得管理员权限，继续执行...
) else (
    echo 需要管理员权限才能正常部署。
    echo 正在请求管理员权限...
    
    REM 使用PowerShell提升权限重新启动此脚本
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

REM 创建一个临时的PowerShell脚本来设置端口并运行部署
echo $env:DEPLOY_PORT = "8080" > temp_deploy.ps1
echo . .\local_deploy.ps1 >> temp_deploy.ps1

REM 执行临时PowerShell脚本
powershell -ExecutionPolicy Bypass -File temp_deploy.ps1

REM 清理临时文件
del temp_deploy.ps1

echo.
echo ===== 部署完成 =====
echo 如果部署成功，您可以通过以下地址访问网站:
echo http://localhost:8080
echo.
echo 请检查上方输出中的公网IP地址以从外部访问
echo.

pause 