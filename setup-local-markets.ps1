# 设置本地 markets 包的 PowerShell 脚本

Write-Host "开始设置本地 markets 包..." -ForegroundColor Green

# 步骤 1: 检查是否已克隆仓库
$repoPath = "..\orderly-js-sdk"
if (-not (Test-Path $repoPath)) {
    Write-Host "未找到 orderly-js-sdk 仓库，请先克隆：" -ForegroundColor Yellow
    Write-Host "  cd .." -ForegroundColor Cyan
    Write-Host "  git clone https://github.com/OrderlyNetwork/js-sdk.git orderly-js-sdk" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "或者手动下载并解压到: $repoPath" -ForegroundColor Yellow
    exit 1
}

# 步骤 2: 检查 markets 包是否存在
$marketsPath = "$repoPath\packages\markets"
if (-not (Test-Path $marketsPath)) {
    Write-Host "错误: 找不到 markets 包在 $marketsPath" -ForegroundColor Red
    exit 1
}

# 步骤 3: 复制到本地包目录
$localMarketsPath = "local-packages\markets"
Write-Host "复制 markets 包到 $localMarketsPath..." -ForegroundColor Green

if (Test-Path $localMarketsPath) {
    Write-Host "删除现有目录..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $localMarketsPath
}

# 创建目录
New-Item -ItemType Directory -Path $localMarketsPath -Force | Out-Null

# 复制文件
Copy-Item -Path "$marketsPath\*" -Destination $localMarketsPath -Recurse -Force

Write-Host "复制完成！" -ForegroundColor Green

# 步骤 4: 提示构建
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Cyan
Write-Host "1. 进入 markets 包目录: cd $localMarketsPath" -ForegroundColor Yellow
Write-Host "2. 安装依赖: yarn install 或 npm install" -ForegroundColor Yellow
Write-Host "3. 构建包: yarn build 或 npm run build" -ForegroundColor Yellow
Write-Host "4. 返回项目根目录: cd ..\.." -ForegroundColor Yellow
Write-Host "5. 修改 package.json 中的依赖为: file:./local-packages/markets" -ForegroundColor Yellow
Write-Host "6. 重新安装依赖: yarn install" -ForegroundColor Yellow
