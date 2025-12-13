# Script to show current contract address from .env

$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) {
    $ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
    if (-not $ProjectRoot) {
        $ProjectRoot = Get-Location
    }
}

$envPath = Join-Path $ProjectRoot '.env'

Write-Host ''
Write-Host '======================================='
Write-Host ' Contract Address Checker'
Write-Host '======================================='
Write-Host ''

if (-not (Test-Path $envPath)) {
    Write-Host '❌ .env file not found!' -ForegroundColor Red
    Write-Host "   Expected location: $envPath" -ForegroundColor Yellow
    Write-Host ''
    Write-Host '💡 Create .env file and add:' -ForegroundColor Cyan
    Write-Host '   VITE_CONTRACT_ADDRESS=0xYourContractAddress' -ForegroundColor White
    exit 1
}

$content = Get-Content $envPath
$contractAddress = $null

foreach ($line in $content) {
    if ($line -match '^VITE_CONTRACT_ADDRESS=(.+)$') {
        $contractAddress = $matches[1].Trim()
        break
    }
}

if ($contractAddress) {
    Write-Host '✅ Contract Address found:' -ForegroundColor Green
    Write-Host "   $contractAddress" -ForegroundColor Cyan
    Write-Host ''
    
    # Validate format
    if ($contractAddress -match '^0x[a-fA-F0-9]{40}$') {
        Write-Host '✅ Address format is valid' -ForegroundColor Green
    } else {
        Write-Host '⚠️  Warning: Address format may be invalid' -ForegroundColor Yellow
        Write-Host '   Expected: 0x followed by 40 hex characters' -ForegroundColor Yellow
    }
} else {
    Write-Host '❌ VITE_CONTRACT_ADDRESS not found in .env' -ForegroundColor Red
    Write-Host ''
    Write-Host '💡 Add this line to .env:' -ForegroundColor Cyan
    Write-Host '   VITE_CONTRACT_ADDRESS=0xYourContractAddress' -ForegroundColor White
}

Write-Host ''
Write-Host '📝 To deploy contract and get address:' -ForegroundColor Cyan
Write-Host '   npm run dev' -ForegroundColor White
Write-Host '   (or: npx hardhat run scripts/deploy.cjs --network localhost)' -ForegroundColor Gray
Write-Host ''

