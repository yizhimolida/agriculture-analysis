 @echo off
chcp 65001
echo ===== 农业数据分析系统部署准备脚本 =====
echo.

REM 更新依赖并构建项目
echo 步骤1: 安装或更新项目依赖
call npm install

if %errorlevel% neq 0 (
  echo 依赖安装失败，请检查错误信息。
  goto :error
)

echo.
echo 步骤2: 构建项目
call npm run build

if %errorlevel% neq 0 (
  echo 项目构建失败，请检查错误信息。
  goto :error
)

echo.
echo 步骤3: 提交更改到Git
git add .
git commit -m "更新农业数据分析系统，添加真实市场价格和农作物数据"

if %errorlevel% neq 0 (
  echo Git提交失败，请检查错误信息。
  echo 您可能需要手动提交更改。
) else (
  echo Git提交成功。
  echo 您现在可以推送更改到远程仓库。
)

echo.
echo 步骤4: 准备Vercel部署
echo 请确保已安装Vercel CLI，如果没有请运行: npm install -g vercel

echo.
echo ===== 部署准备完成 =====
echo.
echo 您现在可以:
echo 1. 运行 "git push origin main" 推送更改到GitHub
echo 2. 运行 "vercel --prod" 部署到Vercel生产环境
echo.
echo 如果您希望在本地预览，可以运行 "npm start"
echo.
goto :end

:error
echo.
echo 部署准备过程中出现错误，请解决后重试。

:end
pause